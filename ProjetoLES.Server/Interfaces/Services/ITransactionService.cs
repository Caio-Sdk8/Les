using ProjetoLES.Server.DTO_s.Transaction;
using ProjetoLES.Server.DTO_s;
using ProjetoLES.Server.Models;

namespace ProjetoLES.Server.Interfaces.Services
{
    public interface ITransactionService
    {
        Task<PagedResultDTO<TransactionModel>> GetMyTransactionsAsync(
            Guid userUuid,
            int page,
            int pageSize,
            string? status,
            CancellationToken cancellationToken = default);

        Task<PagedResultDTO<TransactionModel>> GetTransactionsAsync(
            int page,
            int pageSize,
            string? status,
            Guid? customerUuid,
            CancellationToken cancellationToken = default);

        Task<AfterSalesRequestDTO> CreateAfterSalesRequestAsync(
            Guid transactionUuid,
            Guid userUuid,
            AfterSalesRequestCreateDTO dto,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<AfterSalesRequestDTO>> GetAfterSalesRequestsAsync(
            string? status,
            string? type,
            DateTime? requestedFrom,
            DateTime? requestedTo,
            CancellationToken cancellationToken = default);

        Task ReviewAfterSalesRequestAsync(
            Guid transactionUuid,
            Guid requestUuid,
            bool approve,
            string? note,
            string reviewedBy,
            CancellationToken cancellationToken = default);

        Task<ExchangeCreditBalanceDTO> GetMyExchangeCreditBalanceAsync(
            Guid userUuid,
            CancellationToken cancellationToken = default);

        Task<OrderDetailDTO> GetTransactionDetailAsync(
            Guid transactionUuid,
            Guid? userUuid,
            bool canViewAnyOrder,
            CancellationToken cancellationToken = default);

        Task<PrescriptionFileDTO> GetPrescriptionFileAsync(
            Guid transactionUuid,
            Guid? userUuid,
            bool canViewAnyOrder,
            CancellationToken cancellationToken = default);

        Task<CheckoutResponseDTO> CheckoutAsync(
            Guid userUuid,
            CheckoutRequestDTO dto,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<PrescriptionReviewItemDTO>> GetPrescriptionReviewsAsync(
            string? status,
            CancellationToken cancellationToken = default);

        Task ApprovePrescriptionAsync(
            Guid transactionUuid,
            string? note,
            string reviewedBy,
            CancellationToken cancellationToken = default);

        Task RejectPrescriptionAsync(
            Guid transactionUuid,
            string? note,
            string reviewedBy,
            CancellationToken cancellationToken = default);

        Task RequestPrescriptionResubmissionAsync(
            Guid transactionUuid,
            string? note,
            string reviewedBy,
            CancellationToken cancellationToken = default);

        Task ResubmitPrescriptionAsync(
            Guid transactionUuid,
            Guid userUuid,
            PrescriptionResubmissionRequestDTO dto,
            CancellationToken cancellationToken = default);

        Task<SalesCatalogDTO> GetSalesCatalogAsync(
            CancellationToken cancellationToken = default);

        // Generates synthetic sales data for the past N months to populate dashboards.
        Task GenerateSampleSalesDataAsync(int months, CancellationToken cancellationToken = default);
    }
}
