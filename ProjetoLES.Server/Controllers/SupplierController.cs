using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetoLES.Server.DTO_s.Supplier;
using ProjetoLES.Server.Interfaces.Repositories;

namespace ProjetoLES.Server.Controllers
{
    [ApiController]
    [Route("api/suppliers")]
    [Produces("application/json")]
    [Authorize(Roles = "Admin,Employee")]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierRepository _supplierRepository;

        public SupplierController(ISupplierRepository supplierRepository)
            => _supplierRepository = supplierRepository;

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var suppliers = await _supplierRepository.GetAllActiveAsync(cancellationToken);
            var dtos = suppliers.Select(s => new SupplierResponseDTO(
                s.Uuid, s.Name, s.Cnpj, s.ContactEmail, s.ContactPhone, s.IsActive));
            return Ok(dtos);
        }

        [HttpGet("{uuid:guid}")]
        public async Task<IActionResult> GetById(Guid uuid, CancellationToken cancellationToken)
        {
            var supplier = await _supplierRepository.GetByUuidAsync(uuid, cancellationToken);
            if (supplier is null) return NotFound();
            return Ok(new SupplierResponseDTO(
                supplier.Uuid, supplier.Name, supplier.Cnpj,
                supplier.ContactEmail, supplier.ContactPhone, supplier.IsActive));
        }
    }
}
