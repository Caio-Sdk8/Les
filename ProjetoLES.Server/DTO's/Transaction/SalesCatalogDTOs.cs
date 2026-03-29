namespace ProjetoLES.Server.DTO_s.Transaction
{
    public record SalesPeriodDTO(
        string Value,
        string Label);

    public record SalesPointDTO(
        string Period,
        string Label,
        int Quantity,
        decimal Revenue);

    public record SalesSeriesDTO(
        string Id,
        string Label,
        IEnumerable<SalesPointDTO> Points);

    public record SalesCatalogDTO(
        IEnumerable<SalesPeriodDTO> Periods,
        IEnumerable<SalesSeriesDTO> Products,
        IEnumerable<SalesSeriesDTO> Categories);
}
