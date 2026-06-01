namespace ProjetoLES.Server.DTO_s.Chat
{
    public record ChatRequestDTO
    {
        public string Message { get; init; } = string.Empty;

        public string? SessionId { get; init; }
    }
}