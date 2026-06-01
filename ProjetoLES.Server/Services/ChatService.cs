using Microsoft.EntityFrameworkCore;
using OpenAI;
using OpenAI.Chat;
using ProjetoLES.Server.Data;
using ProjetoLES.Server.DTO_s.Chat;
using ProjetoLES.Server.Models;

using Azure.Core;
using System.Text.RegularExpressions;
using System.Text.Json;
using System.Net.Http;
using System.ClientModel;

namespace ProjetoLES.Server.Services
{
    public class ChatService
    {
        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };

        private static readonly HashSet<string> StopWords = new(StringComparer.OrdinalIgnoreCase)
        {
            "a", "as", "ao", "aos", "com", "como", "de", "da", "das", "do", "dos", "e",
            "em", "para", "por", "que", "qual", "quais", "quando", "onde", "um", "uma",
            "os", "las", "me", "meu", "minha", "mostrar", "mostre", "tem", "sobre", "pra",
            "oi", "ola", "olá", "favor", "quero", "ver", "listar", "liste"
        };

        private static readonly string[] PharmacyKeywords =
        [
            "farmacia", "farmácia", "produto", "produtos", "medicamento", "medicamentos",
            "remedio", "remédio", "categoria", "categorias", "estoque", "pedido", "pedidos",
            "compra", "compras", "interacao", "interações", "interação", "receita", "posologia",
            "dose", "principio", "princípio", "catalogo", "catálogo"
        ];

        private static readonly string[] OffTopicKeywords =
        [
            "carro", "carros", "moto", "motos", "automovel", "automóveis", "avião", "aviao",
            "esporte", "esportes", "futebol", "basquete", "filme", "filmes", "serie", "série",
            "musica", "música", "jogo", "jogos", "politica", "política", "economia", "tecnologia",
            "programacao", "programação", "viagem", "viagens", "clima", "tempo"
        ];

        private static readonly string[] SubstitutionKeywords =
        [
            "generico", "genérico", "substitui", "substituir", "substituta", "substituto",
            "trocar", "alternativa", "alternativas", "equivalente", "equivalentes", "similar", "similares"
        ];

        private static readonly string SystemPrompt = """
            Você é o assistente virtual exclusivo da farmácia.
            Responda sempre em português do Brasil, com objetividade, clareza e tom profissional.
            
            DIRETRIZES DE ESCOPO RÍGIDAS:
            1. Concentre-se APENAS em saúde, bem-estar, medicamentos, produtos de higiene, cosméticos e assuntos farmacêuticos.
            2. Se o usuário solicitar produtos ou assuntos que não pertencem ao contexto farmacêutico (como chocolates finos ou importados como Lindt, eletrônicos, carros, etc.), você deve recusar de forma imediata, direta e incisiva, sem tentar oferecer alternativas fora de escopo. 
               Exemplo de recusa: "Como assistente de farmácia, meu atendimento é estritamente restrito a medicamentos, saúde e bem-estar. Não possuímos chocolates Lindt ou outros produtos alimentícios gourmet no catálogo. Como posso ajudar você com algum medicamento ou produto de higiene?"
            3. Não tente ser prestativo para itens totalmente fora do catálogo farmacêutico (como sugerir procurar "outros tipos de chocolates" se pedirem Lindt). Corte o assunto imediatamente e redirecione para saúde.
            4. Para dúvidas médicas complexas ou uso de medicamentos, recomende a orientação presencial de um farmacêutico ou médico.
            5. Não invente preços, estoque, códigos ou interações: use estritamente os dados retornados pelas ferramentas de busca.
            """;

        private readonly AppDbContext _context;
        private readonly ChatClient? _remoteClient;
        private readonly ILogger<ChatService> _logger;

        public ChatService(AppDbContext context, IConfiguration configuration, ILogger<ChatService> logger)
        {
            _context = context;
            _logger = logger;

            var apiKey = configuration["Groq:ApiKey"];
            var model = configuration["Groq:Model"];
            var baseUrl = configuration["Groq:BaseUrl"];

            if (!string.IsNullOrWhiteSpace(apiKey) &&
                !string.IsNullOrWhiteSpace(model) &&
                Uri.TryCreate(baseUrl, UriKind.Absolute, out var endpoint))
            {
                var options = new OpenAIClientOptions
                {
                    Endpoint = endpoint
                };
                _remoteClient = new ChatClient(model, new ApiKeyCredential(apiKey), options);
            }
        }

        public async Task<ChatResponseDTO> SendMessageAsync(
            List<ChatMessage> history,
            string message,
            Guid? userUuid,
            CancellationToken cancellationToken = default)
        {
            // Se a IA remota estiver ativa, priorizamos o processamento dela por completo,
            // permitindo que ela lide com o escopo e responda de forma muito mais natural e fluida.
            if (_remoteClient is not null)
            {
                const int maxAttempts = 3;
                int attempt = 0;
                while (true)
                {
                    try
                    {
                        var remoteReply = await SendWithModelAsync(history, message, userUuid, cancellationToken);
                        return new ChatResponseDTO(remoteReply, string.Empty, "groq");
                    }
                    catch (Exception ex)
                    {
                        attempt++;
                        _logger.LogWarning(ex, "Falha no chat remoto na tentativa {Attempt}.", attempt);
                        if (attempt >= maxAttempts)
                        {
                            // Exceeded retries, fallback to local mode.
                            break;
                        }
                        // Pequena pausa antes de nova tentativa.
                        await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
                    }
                }

                // Fallback local response after exhausted retries.
                return new ChatResponseDTO(
                    "Desculpe, tive uma instabilidade temporária na minha conexão com a inteligência artificial avançada. 🔌 " +
                    "Estou operando temporariamente no modo básico local.\n\n" +
                    "Você pode tentar repetir sua última pergunta em alguns instantes ou buscar diretamente por produtos (ex: 'buscar Advil') ou categorias.",
                    string.Empty,
                    "local"
                );
            }

            // O filtro de escopo local (rígido) só é aplicado no Modo Local (contingência)
            if (IsOutOfScope(message))
            {
                return new ChatResponseDTO(BuildOutOfScopeReply(), string.Empty, "local");
            }

            var localReply = await BuildLocalReplyAsync(message, userUuid, cancellationToken);
            return new ChatResponseDTO(localReply, string.Empty, "local");
        }

        private async Task<string> SendWithModelAsync(
            List<ChatMessage> history,
            string message,
            Guid? userUuid,
            CancellationToken cancellationToken)
        {
            var conversation = new List<ChatMessage>
            {
                new SystemChatMessage(SystemPrompt)
            };
            conversation.AddRange(history);
            conversation.Add(new UserChatMessage(message));

            var options = BuildChatOptions();

            while (true)
            {
                var completion = await _remoteClient!.CompleteChatAsync(conversation, options, cancellationToken);
                var value = completion.Value;

                if (value.FinishReason == ChatFinishReason.ToolCalls)
                {
                    conversation.Add(new AssistantChatMessage(value));

                    foreach (var toolCall in value.ToolCalls)
                    {
                        var toolResult = await ExecuteToolAsync(toolCall, userUuid, cancellationToken);
                        conversation.Add(new ToolChatMessage(toolCall.Id, toolResult));
                    }

                    continue;
                }

                return GetCompletionText(value);
            }
        }

        private ChatCompletionOptions BuildChatOptions()
        {
            var options = new ChatCompletionOptions();
            options.Tools.Add(ChatTool.CreateFunctionTool(
                functionName: "buscar_produtos",
                functionDescription: "Busca produtos do catálogo por nome, categoria ou preço máximo.",
                functionParameters: BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "termo": { "type": ["string", "null"], "description": "Nome ou parte do nome do produto" },
                    "categoria": { "type": ["string", "null"], "description": "Nome da categoria" },
                    "preco_max": { "type": ["number", "null"], "description": "Preço máximo desejado" },
                    "limite": { "type": ["integer", "null"], "description": "Quantidade máxima de resultados" }
                  }
                }
                """)));

            options.Tools.Add(ChatTool.CreateFunctionTool(
                functionName: "listar_categorias",
                functionDescription: "Lista as categorias disponíveis na farmácia.",
                functionParameters: BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "limite": { "type": "integer", "description": "Quantidade máxima de categorias" }
                  }
                }
                """)));

            options.Tools.Add(ChatTool.CreateFunctionTool(
                functionName: "meus_pedidos",
                functionDescription: "Retorna os pedidos recentes do cliente autenticado.",
                functionParameters: BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "limite": { "type": "integer", "description": "Quantidade máxima de pedidos" }
                  }
                }
                """)));

            options.Tools.Add(ChatTool.CreateFunctionTool(
                functionName: "verificar_interacoes",
                functionDescription: "Verifica possíveis interações entre produtos informados.",
                functionParameters: BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "produtos": {
                      "type": "array",
                      "items": { "type": "string" },
                      "description": "Nomes ou termos para identificar os produtos"
                    }
                  }
                }
                """)));

            return options;
        }

        private async Task<string> ExecuteToolAsync(ChatToolCall toolCall, Guid? userUuid, CancellationToken cancellationToken)
        {
            using var document = JsonDocument.Parse(toolCall.FunctionArguments.ToString());
            var root = document.RootElement;

            return toolCall.FunctionName switch
            {
                "buscar_produtos" => await SearchProductsAsync(root, cancellationToken),
                "listar_categorias" => await ListCategoriesAsync(root, cancellationToken),
                "meus_pedidos" => await ListMyOrdersAsync(root, userUuid, cancellationToken),
                "verificar_interacoes" => await CheckInteractionsAsync(root, cancellationToken),
                _ => JsonSerializer.Serialize(new { message = "Função não encontrada." }, JsonOptions)
            };
        }

        private async Task<string> SearchProductsAsync(JsonElement args, CancellationToken cancellationToken)
        {
            var term = GetString(args, "termo");
            var category = GetString(args, "categoria");
            var priceMax = GetNullableDecimal(args, "preco_max");
            var limit = GetInt(args, "limite") ?? 5;

            var products = await _context.Products
                .AsNoTracking()
                .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                .Include(p => p.Stock)
                .Where(p => p.IsActive)
                .ToListAsync(cancellationToken);

            var filtered = products
                .Where(product => MatchesProduct(product, term, category, priceMax))
                .OrderBy(product => product.Name)
                .Take(limit)
                .Select(product => new
                {
                    nome = product.Name,
                    codigo = product.ProductCode,
                    principioAtivo = product.ActivePrinciple,
                    preco = product.SalePrice,
                    estoque = product.Stock?.AvailableQuantity ?? 0,
                    categorias = product.ProductCategories.Select(pc => pc.Category.Name).Distinct().ToArray()
                })
                .ToList();

            return JsonSerializer.Serialize(new
            {
                total = filtered.Count,
                items = filtered
            }, JsonOptions);
        }

        private async Task<string> ListCategoriesAsync(JsonElement args, CancellationToken cancellationToken)
        {
            var limit = GetInt(args, "limite") ?? 8;

            var categories = await _context.Categories
                .AsNoTracking()
                .Where(category => category.IsActive)
                .OrderBy(category => category.Name)
                .Take(limit)
                .Select(category => new
                {
                    nome = category.Name,
                    descricao = category.Description
                })
                .ToListAsync(cancellationToken);

            return JsonSerializer.Serialize(new
            {
                total = categories.Count,
                items = categories
            }, JsonOptions);
        }

        private async Task<string> ListMyOrdersAsync(JsonElement args, Guid? userUuid, CancellationToken cancellationToken)
        {
            var limit = GetInt(args, "limite") ?? 5;

            if (!userUuid.HasValue)
            {
                return JsonSerializer.Serialize(new
                {
                    message = "Não foi possível identificar o cliente autenticado para consultar pedidos."
                }, JsonOptions);
            }

            var user = await _context.Users
                .AsNoTracking()
                .Include(user => user.Customer)
                .FirstOrDefaultAsync(user => user.Uuid == userUuid.Value && user.IsActive, cancellationToken);

            if (user?.Customer is null)
            {
                return JsonSerializer.Serialize(new
                {
                    message = "O usuário autenticado não está vinculado a um cliente."
                }, JsonOptions);
            }

            var orders = await _context.Transactions
                .AsNoTracking()
                .Where(transaction => transaction.CustomerId == user.Customer.Id)
                .OrderByDescending(transaction => transaction.CreatedAt)
                .Take(limit)
                .Select(transaction => new
                {
                    codigo = transaction.Description,
                    status = transaction.Status,
                    total = transaction.Amount,
                    criadoEm = transaction.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return JsonSerializer.Serialize(new
            {
                total = orders.Count,
                items = orders
            }, JsonOptions);
        }

        private async Task<string> CheckInteractionsAsync(JsonElement args, CancellationToken cancellationToken)
        {
            var terms = new List<string>();
            if (args.TryGetProperty("produtos", out var productsElement) && productsElement.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in productsElement.EnumerateArray())
                {
                    var value = item.GetString();
                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        terms.Add(value.Trim());
                    }
                }
            }

            var products = await _context.Products
                .AsNoTracking()
                .Where(product => product.IsActive)
                .ToListAsync(cancellationToken);

            var matchedProducts = terms.Count > 0
                ? products.Where(product => TermsMatchProduct(product, terms)).ToList()
                : products.Take(12).ToList();

            if (matchedProducts.Count < 2)
            {
                return JsonSerializer.Serialize(new
                {
                    message = "Informe ao menos dois produtos para verificar interações."
                }, JsonOptions);
            }

            var productIds = matchedProducts.Select(product => product.Id).Distinct().ToList();
            var interactions = await _context.DrugInteractions
                .AsNoTracking()
                .Include(interaction => interaction.ProductA)
                .Include(interaction => interaction.ProductB)
                .Where(interaction => productIds.Contains(interaction.ProductAId) && productIds.Contains(interaction.ProductBId))
                .OrderByDescending(interaction => interaction.SeverityLevel)
                .ToListAsync(cancellationToken);

            return JsonSerializer.Serialize(new
            {
                produtos = matchedProducts.Select(product => product.Name).Distinct().ToArray(),
                total = interactions.Count,
                items = interactions.Select(interaction => new
                {
                    produtoA = interaction.ProductA.Name,
                    produtoB = interaction.ProductB.Name,
                    descricao = interaction.Description,
                    severidade = interaction.SeverityLevel
                })
            }, JsonOptions);
        }

        private async Task<string> BuildLocalReplyAsync(string message, Guid? userUuid, CancellationToken cancellationToken)
        {
            if (IsOutOfScope(message))
            {
                return BuildOutOfScopeReply();
            }

            var normalized = message.Trim().ToLowerInvariant();

            if (ContainsAnyWord(normalized, SubstitutionKeywords))
            {
                var extractedTarget = ExtractTerms(message)
                    .FirstOrDefault(term => !ContainsAnyWord(term, SubstitutionKeywords));

                if (string.IsNullOrWhiteSpace(extractedTarget) || IsTooGenericTarget(extractedTarget))
                {
                    return "Posso sugerir opções mais baratas ou genéricos, mas preciso que você diga qual medicamento, princípio ativo ou produto quer substituir.";
                }

                var payload = JsonSerializer.Serialize(new { termo = extractedTarget, limite = 5 }, JsonOptions);
                var products = await SearchProductsAsync(JsonDocument.Parse(payload).RootElement.Clone(), cancellationToken);
                return FormatToolResult("Alternativas encontradas", products);
            }

            if (ContainsAny(normalized, "categoria", "categorias"))
            {
                var categories = await ListCategoriesAsync(JsonDocument.Parse("{\"limite\":8}").RootElement.Clone(), cancellationToken);
                return FormatToolResult("Categorias encontradas", categories);
            }

            if (ContainsAny(normalized, "pedido", "pedidos", "compra", "compras"))
            {
                var orders = await ListMyOrdersAsync(JsonDocument.Parse("{\"limite\":5}").RootElement.Clone(), userUuid, cancellationToken);
                return FormatToolResult("Pedidos recentes", orders);
            }

            if (ContainsAny(normalized, "interacao", "interações", "interação", "interacoes"))
            {
                var terms = ExtractTerms(message).Take(4).ToArray();
                var payload = JsonSerializer.Serialize(new { produtos = terms }, JsonOptions);
                var interactions = await CheckInteractionsAsync(JsonDocument.Parse(payload).RootElement.Clone(), cancellationToken);
                return FormatToolResult("Interações encontradas", interactions);
            }

            if (ContainsAnyWord(normalized, ["produto", "produtos", "medicamento", "medicamentos", "remedio", "remédio", "buscar", "procure"]))
            {
                var term = ExtractTerms(message).FirstOrDefault();
                var payload = JsonSerializer.Serialize(new { termo = term ?? message, limite = 5 }, JsonOptions);
                var products = await SearchProductsAsync(JsonDocument.Parse(payload).RootElement.Clone(), cancellationToken);
                return FormatToolResult("Produtos encontrados", products);
            }

            return "Olá! Sou o assistente virtual da farmácia. 🌟\n\nPosso ajudar você com:\n• 🔍 Buscar produtos (ex: 'buscar produtos para dor')\n• 🗂️ Listar categorias (ex: 'quais categorias existem?')\n• 📦 Consultar seus pedidos (ex: 'mostrar meus pedidos')\n• ⚠️ Verificar interações medicamentosas (ex: 'verificar dipirona e ibuprofeno')\n\nComo posso ajudar você hoje?";
        }

        private static string FormatToolResult(string title, string json)
        {
            try
            {
                using var document = JsonDocument.Parse(json);
                var root = document.RootElement;

                if (root.TryGetProperty("message", out var messageElement))
                {
                    return messageElement.GetString() ?? title;
                }

                var lines = new List<string> { title + ":" };

                if (root.TryGetProperty("total", out var totalElement) && totalElement.ValueKind == JsonValueKind.Number)
                {
                    var total = totalElement.GetInt32();
                    lines[0] = $"{title}: ({total})";

                    // If there are zero results, return a friendly message depending on the tool type
                    if (total == 0)
                    {
                        var lowerTitle = title.ToLowerInvariant();

                        if (lowerTitle.Contains("produto") || lowerTitle.Contains("produtos") || lowerTitle.Contains("alternativa"))
                        {
                            return "infelizmente não temos nada no estoque correspondente ao que você quer";
                        }

                        if (lowerTitle.Contains("categoria") || lowerTitle.Contains("categorias"))
                        {
                            return "infelizmente não temos categorias correspondentes ao que você quer";
                        }

                        if (lowerTitle.Contains("pedido") || lowerTitle.Contains("pedidos"))
                        {
                            return "infelizmente não encontramos pedidos correspondentes ao que você quer";
                        }

                        if (lowerTitle.Contains("intera") || lowerTitle.Contains("interações") || lowerTitle.Contains("interacao"))
                        {
                            return "infelizmente não foram encontradas interações para os produtos informados";
                        }
                    }
                }

                if (root.TryGetProperty("items", out var itemsElement) && itemsElement.ValueKind == JsonValueKind.Array)
                {
                    var any = false;
                    foreach (var item in itemsElement.EnumerateArray())
                    {
                        var formatted = FormatItem(item);
                        if (!string.IsNullOrWhiteSpace(formatted))
                        {
                            lines.Add(formatted);
                            any = true;
                        }
                        else
                        {
                            // fallback: append the raw item JSON if formatting produced nothing
                            lines.Add("- " + item.GetRawText());
                            any = true;
                        }
                    }

                    if (any)
                        return string.Join(Environment.NewLine, lines.Where(line => !string.IsNullOrWhiteSpace(line)));
                }

                // as a fallback, return the raw json or the title
                try
                {
                    return JsonSerializer.Serialize(JsonDocument.Parse(json).RootElement, JsonOptions);
                }
                catch
                {
                    return title;
                }
            }
            catch
            {
                return title;
            }
        }

        private static string FormatItem(JsonElement item)
        {
            var parts = new List<string>();

            if (item.TryGetProperty("nome", out var nome))
            {
                parts.Add(nome.GetString() ?? string.Empty);
            }

            if (item.TryGetProperty("codigo", out var codigo) && codigo.ValueKind == JsonValueKind.String)
            {
                parts.Add($"código {codigo.GetString()}");
            }

            if (item.TryGetProperty("preco", out var preco) && preco.ValueKind == JsonValueKind.Number)
            {
                parts.Add($"preço {preco.GetDecimal():C2}");
            }

            if (item.TryGetProperty("estoque", out var estoque) && estoque.ValueKind == JsonValueKind.Number)
            {
                parts.Add($"estoque {estoque.GetInt32()}");
            }

            if (item.TryGetProperty("status", out var status) && status.ValueKind == JsonValueKind.String)
            {
                parts.Add($"status {status.GetString()}");
            }

            if (item.TryGetProperty("descricao", out var descricao) && descricao.ValueKind == JsonValueKind.String)
            {
                parts.Add(descricao.GetString() ?? string.Empty);
            }

            if (item.TryGetProperty("severidade", out var severidade) && severidade.ValueKind == JsonValueKind.Number)
            {
                parts.Add($"severidade {severidade.GetInt32()}");
            }

            return "- " + string.Join(" | ", parts.Where(part => !string.IsNullOrWhiteSpace(part)));
        }

        private static bool ContainsAny(string text, params string[] terms)
            => terms.Any(term => text.Contains(term, StringComparison.OrdinalIgnoreCase));

        private static bool ContainsAnyWord(string text, IEnumerable<string> terms)
            => terms.Any(term => Regex.IsMatch(text, $"(^|\\W){Regex.Escape(term)}(\\W|$)", RegexOptions.IgnoreCase));

        private static bool IsOutOfScope(string message)
        {
            var normalized = message.Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(normalized))
            {
                return false;
            }

            if (ContainsAny(normalized, PharmacyKeywords))
            {
                return false;
            }

            return ContainsAny(normalized, OffTopicKeywords);
        }

        private static string BuildOutOfScopeReply()
            => "Olá! Como sou o assistente virtual da farmácia, posso ajudar você apenas com dúvidas sobre nossos produtos, categorias, pedidos ou interações medicamentosas. Como posso ajudar você nessa área?";

        private static bool IsTooGenericTarget(string term)
            => ContainsAnyWord(term, ["isso", "aquele", "aquela", "aquilo", "coisa", "item", "produto", "medicamento", "remedio", "remédio"]);

        private static IEnumerable<string> ExtractTerms(string message)
            => Regex.Split(message.ToLowerInvariant(), "[^a-z0-9áàâãéêíóôõúç]+")
                .Where(term => term.Length >= 3 && !StopWords.Contains(term))
                .Take(6);

        private static string? GetString(JsonElement args, string propertyName)
            => args.TryGetProperty(propertyName, out var value) && value.ValueKind == JsonValueKind.String
                ? value.GetString()
                : null;

        private static int? GetInt(JsonElement args, string propertyName)
            => args.TryGetProperty(propertyName, out var value) && value.ValueKind == JsonValueKind.Number && value.TryGetInt32(out var result)
                ? result
                : null;

        private static decimal? GetNullableDecimal(JsonElement args, string propertyName)
            => args.TryGetProperty(propertyName, out var value) && value.ValueKind == JsonValueKind.Number && value.TryGetDecimal(out var result)
                ? result
                : null;

        private static string GetCompletionText(ChatCompletion completion)
            => completion.Content.Count > 0 && !string.IsNullOrWhiteSpace(completion.Content[0].Text)
                ? completion.Content[0].Text
                : "Não consegui gerar uma resposta neste momento.";

        private static bool MatchesProduct(ProductModel product, string? term, string? category, decimal? priceMax)
        {
            if (priceMax.HasValue && product.SalePrice > priceMax.Value)
            {
                return false;
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                var categoryMatch = product.ProductCategories.Any(pc =>
                    pc.Category.Name.Contains(category, StringComparison.OrdinalIgnoreCase));

                if (!categoryMatch)
                {
                    return false;
                }
            }

            if (string.IsNullOrWhiteSpace(term))
            {
                return true;
            }

            return ContainsProductTerm(product, term);
        }

        private static bool ContainsProductTerm(ProductModel product, string term)
            => ContainsAny(product.Name, term)
               || ContainsAny(product.ActivePrinciple ?? string.Empty, term)
               || ContainsAny(product.Description ?? string.Empty, term)
               || product.ProductCategories.Any(pc => ContainsAny(pc.Category.Name, term));

        private static bool TermsMatchProduct(ProductModel product, IEnumerable<string> terms)
            => terms.Any(term => ContainsProductTerm(product, term));
    }
}