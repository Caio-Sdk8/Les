import { useMemo, useState } from "react";
import { AppShell } from "../../components/AppShell/AppShell";
import {
  prescriptionReviewsMock,
  type PrescriptionReviewItem,
} from "../../mock/receitasAdmin";
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
  const [reviews, setReviews] = useState(prescriptionReviewsMock);
  const [selectedId, setSelectedId] = useState<number>(prescriptionReviewsMock[0]?.id ?? 0);

  const selectedReview = useMemo(
    () => reviews.find((item) => item.id === selectedId) ?? null,
    [reviews, selectedId]
  );

  const updateReview = (
    reviewId: number,
    updater: (review: PrescriptionReviewItem) => PrescriptionReviewItem
  ) => {
    setReviews((current) => current.map((item) => (item.id === reviewId ? updater(item) : item)));
  };

  const handleApprove = () => {
    if (!selectedReview) return;
    updateReview(selectedReview.id, (review) => ({
      ...review,
      status: "APROVADA",
      note: review.note?.trim() || "Receita aprovada para separação do pedido.",
    }));
  };

  const handleReject = () => {
    if (!selectedReview) return;
    updateReview(selectedReview.id, (review) => ({
      ...review,
      status: "REPROVADA",
      note: review.note?.trim() || "Receita rejeitada. Solicitar novo envio ao cliente.",
    }));
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
                <FileLink type="button">{selectedReview.fileName}</FileLink>
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
                    updateReview(selectedReview.id, (review) => ({
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
                <ActionButton type="button" $variant="ghost">
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