namespace ProjetoLES.Server.DTO_s.Transaction
{
    public record PrescriptionReviewProductDTO(
        string Name,
        int Quantity,
        string PrescriptionLabel);

    public record PrescriptionReviewItemDTO(
        int Id,
        Guid TransactionUuid,
        string TransactionCode,
        string CustomerName,
        string CustomerDocument,
        string SentAt,
        string FileName,
        string Status,
        string Note,
        IEnumerable<PrescriptionReviewProductDTO> Products);

    public record PrescriptionReviewDecisionDTO(string? Note);

    public record PrescriptionRequestResubmissionDTO(string? Note);

    public record PrescriptionResubmissionRequestDTO(
        string PrescriptionFileName,
        string PrescriptionFileContentType,
        string PrescriptionFileBase64,
        string? Note);

    public record PrescriptionFileDTO(
        string FileName,
        string ContentType,
        string Base64);
}
