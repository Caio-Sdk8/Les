using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI.Chat;
using ProjetoLES.Server.DTO_s.Chat;
using ProjetoLES.Server.Services;
using System.Collections.Concurrent;
using System.Text.Json;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/chat")]
    [Produces("application/json")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private static readonly ConcurrentDictionary<string, List<ChatMessage>> Conversations = new();
        private readonly ChatService _chatService;

        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost]
        public async Task<IActionResult> Send(
            [FromBody] JsonElement request,
            CancellationToken cancellationToken = default)
        {
            if (!request.TryGetProperty("message", out var messageElement) || messageElement.ValueKind != JsonValueKind.String)
            {
                return BadRequest(new { message = "Informe uma mensagem válida para o assistente." });
            }

            var message = (messageElement.GetString() ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(message))
            {
                return BadRequest(new { message = "Digite uma pergunta para o assistente." });
            }

            string? requestSessionId = null;
            if (request.TryGetProperty("sessionId", out var sessionIdElement) && sessionIdElement.ValueKind == JsonValueKind.String)
            {
                requestSessionId = sessionIdElement.GetString();
            }

            var userUuid = GetUserUuid();
            var sessionId = !string.IsNullOrWhiteSpace(requestSessionId)
                ? requestSessionId.Trim()
                : userUuid?.ToString("N") ?? Guid.NewGuid().ToString("N");

            var history = Conversations.GetOrAdd(sessionId, _ => new List<ChatMessage>());

            ChatResponseDTO response;
            lock (history)
            {
                response = _chatService.SendMessageAsync(history, message, userUuid, cancellationToken)
                    .GetAwaiter()
                    .GetResult();

                history.Add(new UserChatMessage(message));
                history.Add(new AssistantChatMessage(response.Reply));

                if (history.Count > 20)
                {
                    history.RemoveRange(0, history.Count - 20);
                }
            }

            return Ok(response with { SessionId = sessionId });
        }

        private Guid? GetUserUuid()
        {
            var claim = User.FindFirst("uuid")?.Value;
            return Guid.TryParse(claim, out var userUuid) ? userUuid : null;
        }
    }
}