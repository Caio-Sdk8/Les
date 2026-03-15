import { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell/AppShell";
import {
  productService,
  stockService,
  supplierService,
  type ProductSummary,
  type StockSummary,
  type Supplier,
  type StockEntryCreate,
} from "../../services/catalog/productService";
import {
  ErrorMsg,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldSelect,
  FormGrid,
  ModalActions,
  ModalBox,
  ModalTitle,
  Overlay,
  PageArrowBtn,
  PageArrowIcon,
  PageBtn,
  PageWrapper,
  PaginationRow,
  PrimaryBtn,
  SearchInput,
  SecondaryBtn,
  StockBadge,
  Table,
  TableCard,
  Td,
  Th,
  TopBar,
  Tr,
} from "./style";
import SetaDireita from "../../assets/SetaDireita.svg";
import SetaEsquerda from "../../assets/SetaEsquerda.svg";

const PAGE_SIZE = 10;
const LOW_STOCK_THRESHOLD = 5;

interface EntryForm {
  productUuid: string;
  supplierUuid: string;
  quantity: string;
  costValue: string;
  entryDate: string;
}

const emptyForm = (): EntryForm => ({
  productUuid: "",
  supplierUuid: "",
  quantity: "",
  costValue: "",
  entryDate: new Date().toISOString().slice(0, 10),
});

export default function Estoque() {
  // Stock list state
  const [rows, setRows] = useState<StockSummary[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<EntryForm>(emptyForm());
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Dropdown data
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Load stock list
  const loadStock = async (p: number, q: string) => {
    setLoading(true);
    try {
      const result = await stockService.getStock({
        search: q || undefined,
        page: p,
        pageSize: PAGE_SIZE,
      });
      setRows(result.items);
      setTotalPages(result.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock(page, search);
  }, [page, search]);

  // Load dropdown data once
  useEffect(() => {
    productService.getProducts({ pageSize: 200, isActive: true }).then((r) => setProducts(r.items));
    supplierService.getAll().then(setSuppliers);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(pendingSearch);
  };

  // Modal helpers
  const openModal = () => {
    setForm(emptyForm());
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const setField = (field: keyof EntryForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const qty = parseInt(form.quantity, 10);
    const cost = parseFloat(form.costValue);

    if (!form.productUuid) return setFormError("Selecione um produto.");
    if (!form.supplierUuid) return setFormError("Selecione um fornecedor.");
    if (!qty || qty < 1) return setFormError("Quantidade deve ser maior que zero (RN0061).");
    if (!cost || cost <= 0) return setFormError("Preço de custo deve ser maior que zero (RN0062).");
    if (!form.entryDate) return setFormError("Data de entrada é obrigatória (RN0064).");

    const payload: StockEntryCreate = {
      productUuid: form.productUuid,
      supplierUuid: form.supplierUuid,
      quantity: qty,
      costValue: cost,
      entryDate: form.entryDate,
    };

    setSubmitting(true);
    try {
      await stockService.registerEntry(payload);
      setModalOpen(false);
      setPage(1);
      setSearch("");
      setPendingSearch("");
      loadStock(1, "");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao registrar entrada. Tente novamente.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Controle de Estoque">
      <PageWrapper>
        <TopBar>
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "8px" }}>
            <SearchInput
              placeholder="Buscar produto..."
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
            />
            <PrimaryBtn type="submit">Buscar</PrimaryBtn>
          </form>
          <PrimaryBtn type="button" onClick={openModal}>
            + Registrar Entrada
          </PrimaryBtn>
        </TopBar>

        <TableCard>
          <Table>
            <thead>
              <tr>
                <Th>Código</Th>
                <Th>Produto</Th>
                <Th>Preço de Venda</Th>
                <Th>Disponível</Th>
                <Th>Reservado</Th>
                <Th>Situação</Th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <Td colSpan={6} style={{ textAlign: "center", color: "var(--color-muted)" }}>
                    Carregando...
                  </Td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <Td colSpan={6} style={{ textAlign: "center", color: "var(--color-muted)" }}>
                    Nenhum produto encontrado.
                  </Td>
                </tr>
              )}
              {!loading &&
                rows.map((row, i) => (
                  <Tr key={row.productUuid} $even={i % 2 === 0}>
                    <Td>{row.productCode}</Td>
                    <Td>{row.productName}</Td>
                    <Td>R$ {row.salePrice.toFixed(2)}</Td>
                    <Td>{row.availableQuantity}</Td>
                    <Td>{row.blockedQuantity}</Td>
                    <Td>
                      <StockBadge $low={row.availableQuantity <= LOW_STOCK_THRESHOLD}>
                        {row.availableQuantity <= LOW_STOCK_THRESHOLD ? "Estoque baixo" : "Normal"}
                      </StockBadge>
                    </Td>
                  </Tr>
                ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <PaginationRow>
              <PageArrowBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <PageArrowIcon src={SetaEsquerda} alt="Página anterior" />
              </PageArrowBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>
                  {p}
                </PageBtn>
              ))}
              <PageArrowBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                <PageArrowIcon src={SetaDireita} alt="Próxima página" />
              </PageArrowBtn>
            </PaginationRow>
          )}
        </TableCard>
      </PageWrapper>

      {/* ── Entry Modal ─────────────────────────────────────────────────────── */}
      {modalOpen && (
        <Overlay onClick={closeModal}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Registrar Entrada de Estoque</ModalTitle>
            <form onSubmit={handleSubmit}>
              <FormGrid>
                <FieldGroup>
                  <FieldLabel htmlFor="entry-product">Produto *</FieldLabel>
                  <FieldSelect
                    id="entry-product"
                    value={form.productUuid}
                    onChange={(e) => setField("productUuid", e.target.value)}
                  >
                    <option value="">Selecione um produto...</option>
                    {products.map((p) => (
                      <option key={p.uuid} value={p.uuid}>
                        {p.productCode} — {p.name}
                      </option>
                    ))}
                  </FieldSelect>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="entry-supplier">Fornecedor *</FieldLabel>
                  <FieldSelect
                    id="entry-supplier"
                    value={form.supplierUuid}
                    onChange={(e) => setField("supplierUuid", e.target.value)}
                  >
                    <option value="">Selecione um fornecedor...</option>
                    {suppliers.map((s) => (
                      <option key={s.uuid} value={s.uuid}>
                        {s.name}
                      </option>
                    ))}
                  </FieldSelect>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="entry-qty">Quantidade *</FieldLabel>
                  <FieldInput
                    id="entry-qty"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Ex: 100"
                    value={form.quantity}
                    onChange={(e) => setField("quantity", e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="entry-cost">Preço de Custo (R$) *</FieldLabel>
                  <FieldInput
                    id="entry-cost"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Ex: 12.50"
                    value={form.costValue}
                    onChange={(e) => setField("costValue", e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="entry-date">Data de Entrada *</FieldLabel>
                  <FieldInput
                    id="entry-date"
                    type="date"
                    value={form.entryDate}
                    onChange={(e) => setField("entryDate", e.target.value)}
                  />
                </FieldGroup>

                {formError && <ErrorMsg>{formError}</ErrorMsg>}
              </FormGrid>

              <ModalActions>
                <SecondaryBtn type="button" onClick={closeModal} disabled={submitting}>
                  Cancelar
                </SecondaryBtn>
                <PrimaryBtn type="submit" disabled={submitting}>
                  {submitting ? "Salvando..." : "Confirmar Entrada"}
                </PrimaryBtn>
              </ModalActions>
            </form>
          </ModalBox>
        </Overlay>
      )}
    </AppShell>
  );
}
