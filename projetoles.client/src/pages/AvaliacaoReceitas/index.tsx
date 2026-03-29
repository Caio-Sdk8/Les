import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../../components/AppShell/AppShell";
import {
  transactionService,
  type PrescriptionReviewItem,
} from "../../services/transactions/transactionService";
import {
  ActionButton,
  ActionRow,
  DetailBlock,
  DetailBody,
  DetailGrid,
  DetailLabel,
  DetailValue,
  EmptyState,
  FileLink,
  ProductItem,
  ProductList,
  ProductMeta,
  PreviewFrame,
  PreviewImage,
  PreviewPanel,
  ReviewCard,
  ReviewHeader,
  ReviewLayout,
  ReviewRow,
  ReviewSubtitle,
  ReviewTable,
  ReviewTitle,
  StatusBadge,
  TextArea,
} from "./style";

export default function AvaliacaoReceitas() {
  const [reviews, setReviews] = useState<PrescriptionReviewItem[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [previewDataUrl, setPreviewDataUrl] = useState("");
  const [previewContentType, setPreviewContentType] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const loadReviews = async () => {
    const items = await transactionService.getPrescriptionReviews();
    setReviews(items);
    if (items.length > 0) {
      setSelectedId((current) => (items.some((item) => item.id === current) ? current : items[0].id));
    } else {
      setSelectedId(0);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const selectedReview = useMemo(
    () => reviews.find((item) => item.id === selectedId) ?? null,
    [reviews, selectedId]
  );

  useEffect(() => {
    if (!selectedReview) {
      setPreviewDataUrl("");
      setPreviewContentType("");
      setPreviewError("");
      return;
    }

    let cancelled = false;

    const loadPreview = async () => {
      setPreviewLoading(true);
      setPreviewError("");
      try {
        const file = await transactionService.getPrescriptionFile(selectedReview.transactionUuid);
        if (cancelled) return;

        setPreviewContentType(file.contentType);
        setPreviewDataUrl(`data:${file.contentType};base64,${file.base64}`);
      } catch {
        if (!cancelled) {
          setPreviewDataUrl("");
          setPreviewContentType("");
          setPreviewError("Não foi possível carregar a visualização da receita.");
        }
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };

    void loadPreview();
    return () => {
      cancelled = true;
    };
  }, [selectedReview]);

  const updateLocalReview = (
    reviewId: number,
    updater: (review: PrescriptionReviewItem) => PrescriptionReviewItem
  ) => {
    setReviews((current) => current.map((item) => (item.id === reviewId ? updater(item) : item)));
  };

  const handleApprove = async () => {
    if (!selectedReview) return;
    await transactionService.approvePrescription(selectedReview.transactionUuid, selectedReview.note);

    updateLocalReview(selectedReview.id, (review) => ({
      ...review,
      status: "APROVADA",
      note: review.note?.trim() || "Receita aprovada para separação do pedido.",
    }));
  };

  const handleReject = async () => {
    if (!selectedReview) return;
    await transactionService.rejectPrescription(selectedReview.transactionUuid, selectedReview.note);

    updateLocalReview(selectedReview.id, (review) => ({
      ...review,
      status: "REPROVADA",
      note: review.note?.trim() || "Receita rejeitada. Solicitar novo envio ao cliente.",
    }));
  };

  const handleRequestResubmission = async () => {
    if (!selectedReview) return;
    await transactionService.requestPrescriptionResubmission(selectedReview.transactionUuid, selectedReview.note);

    updateLocalReview(selectedReview.id, (review) => ({
      ...review,
      status: "REENVIO_SOLICITADO",
      note: review.note?.trim() || "Solicitado novo envio da receita pelo farmacêutico.",
    }));
  };

  const openPreviewInNewTab = () => {
    if (!previewDataUrl) return;
    window.open(previewDataUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <AppShell title="Avaliação de receitas">
      <ReviewLayout>
        <ReviewCard>
          <ReviewHeader>
            <div>
              <ReviewTitle>Pedidos aguardando análise</ReviewTitle>
              <ReviewSubtitle>
                Mock administrativo para validação farmacêutica após o cliente enviar a receita no checkout.
              </ReviewSubtitle>
            </div>
          </ReviewHeader>

          <ReviewTable>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Recebido em</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <ReviewRow
                  key={review.id}
                  $active={review.id === selectedId}
                  onClick={() => setSelectedId(review.id)}
                >
                  <td>
                    <strong>{review.transactionCode}</strong>
                    <br />
                    {review.fileName}
                  </td>
                  <td>{review.customerName}</td>
                  <td>{review.sentAt}</td>
                  <td>
                    <StatusBadge $status={review.status}>{review.status}</StatusBadge>
                  </td>
                </ReviewRow>
              ))}
            </tbody>
          </ReviewTable>
        </ReviewCard>

        <ReviewCard>
          <ReviewHeader>
            <div>
              <ReviewTitle>Detalhes da análise</ReviewTitle>
              <ReviewSubtitle>
                Abra o pedido, revise os itens prescritos e registre a decisão do farmacêutico.
              </ReviewSubtitle>
            </div>
            {selectedReview && <StatusBadge $status={selectedReview.status}>{selectedReview.status}</StatusBadge>}
          </ReviewHeader>

          {!selectedReview && <EmptyState>Nenhum pedido selecionado.</EmptyState>}

          {selectedReview && (
            <DetailBody>
              <DetailGrid>
                <DetailBlock>
                  <DetailLabel>Pedido</DetailLabel>
                  <DetailValue>{selectedReview.transactionCode}</DetailValue>
                </DetailBlock>

                <DetailBlock>
                  <DetailLabel>Cliente</DetailLabel>
                  <DetailValue>{selectedReview.customerName}</DetailValue>
                </DetailBlock>

                <DetailBlock>
                  <DetailLabel>Documento</DetailLabel>
                  <DetailValue>{selectedReview.customerDocument}</DetailValue>
                </DetailBlock>

                <DetailBlock>
                  <DetailLabel>Recebido em</DetailLabel>
                  <DetailValue>{selectedReview.sentAt}</DetailValue>
                </DetailBlock>
              </DetailGrid>

              <DetailBlock>
                <DetailLabel>Arquivo enviado</DetailLabel>
                <FileLink type="button" onClick={openPreviewInNewTab}>
                  {selectedReview.fileName}
                </FileLink>

                <PreviewPanel>
                  {previewLoading && <ProductMeta>Carregando visualização da receita...</ProductMeta>}
                  {!previewLoading && previewError && <ProductMeta>{previewError}</ProductMeta>}

                  {!previewLoading && !previewError && previewDataUrl && previewContentType.startsWith("image/") && (
                    <PreviewImage src={previewDataUrl} alt={selectedReview.fileName} />
                  )}

                  {!previewLoading && !previewError && previewDataUrl && previewContentType === "application/pdf" && (
                    <PreviewFrame title="Receita em PDF" src={previewDataUrl} />
                  )}

                  {!previewLoading && !previewError && previewDataUrl && !previewContentType.startsWith("image/") && previewContentType !== "application/pdf" && (
                    <ProductMeta>
                      Tipo de arquivo não suportado para pré-visualização. Use o nome do arquivo para abrir em nova aba.
                    </ProductMeta>
                  )}
                </PreviewPanel>
              </DetailBlock>

              <DetailBlock>
                <DetailLabel>Produtos sob análise</DetailLabel>
                <ProductList>
                  {selectedReview.products.map((product, index) => (
                    <ProductItem key={`${selectedReview.id}-${product.name}-${index}`}>
                      <strong>{product.name}</strong>
                      <ProductMeta>
                        Quantidade: {product.quantity} • Classificação: {product.prescriptionLabel}
                      </ProductMeta>
                    </ProductItem>
                  ))}
                </ProductList>
              </DetailBlock>

              <DetailBlock>
                <DetailLabel>Observação farmacêutica</DetailLabel>
                <TextArea
                  value={selectedReview.note}
                  placeholder="Descreva o motivo da aprovação ou reprovação"
                  onChange={(event) =>
                    updateLocalReview(selectedReview.id, (review) => ({
                      ...review,
                      note: event.target.value,
                    }))
                  }
                />
              </DetailBlock>

              <ActionRow>
                <ActionButton type="button" $variant="approve" onClick={handleApprove}>
                  Aprovar receita
                </ActionButton>
                <ActionButton type="button" $variant="reject" onClick={handleReject}>
                  Reprovar receita
                </ActionButton>
                <ActionButton type="button" $variant="ghost" onClick={handleRequestResubmission}>
                  Solicitar novo envio
                </ActionButton>
              </ActionRow>
            </DetailBody>
          )}
        </ReviewCard>
      </ReviewLayout>
    </AppShell>
  );
}