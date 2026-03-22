import { useForm } from "react-hook-form";
import {
  DivLabel,
  DivSeparator,
  InputSelect,
  InputSing,
  InputWrapper,
  Label,
} from "../../pages/Cadastro/style";
import {
  IconModal,
  ModalButtons,
  ModalButtonWarning,
  ModalButtonWarningWhite,
  ModalContainerSmall,
  ModalHeader,
  ModalSection,
  ModalSubtitle,
  ModalTitleError,
  Overlay,
} from "./style";
import {
  CardFormData,
  cardSchema,
} from "../../validations/schemas/CadastroCartao";
import { yupResolver } from "@hookform/resolvers/yup";
import { createCreditCard } from "../../services/requests/sinCredit";
import { GetCardBrandRequest } from "../../services/requests/getCardBrand";
import { GetAllCLientCardsRequest } from "../../services/requests/getCardClient";

type Props = {
  back?: () => void;
  next: () => void;
  title: string;
  message?: string;
  message2?: string;
  button?: string;
  button2?: string;
  height?: string;
  width?: string;
  uuid: string;
};

const ModalCartao = ({
  back,
  next,
  uuid,
  title,
  message,
  message2,
  button,
  button2,
  height,
  width,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: yupResolver(cardSchema),
  });

  const { data, refetch } = GetAllCLientCardsRequest(uuid);
  const { data: cardBrands, isLoading } = GetCardBrandRequest();

  const cardOptions =
    cardBrands?.map((item) => ({
      label: item.name,
      value: item.uuid,
    })) ?? [];

  const onSubmit = async (formData: CardFormData) => {
    try {
      if (!uuid) return;

      const payload = {
        CardBrandUuid: formData.cardBrandUuid,
        CardNumber: formData.cardNumber.replace(/\s/g, ""),
        PrintedName: formData.printedName,
        SecurityCode: formData.securityCode,
        ExpirationDate: formData.expirationDate,
        IsPreferred: true,
      };

      const response = await createCreditCard(uuid, payload);
      await refetch();

      console.log("Cartão cadastrado com sucesso:", response);
      next();
    } catch (error) {
      console.error("Erro ao cadastrar cartão:", error);
    }
  };

  return (
    <Overlay>
      <ModalContainerSmall width={width ?? "auto"} height={height ?? "auto"}>
        <ModalHeader>
          <ModalTitleError>{title}</ModalTitleError>
        </ModalHeader>

        <ModalSection>
          {message && <ModalSubtitle>{message}</ModalSubtitle>}
          {message2 && <ModalSubtitle>{message2}</ModalSubtitle>}

          <InputWrapper>
            <DivLabel>
              <Label>Nome do titular</Label>
            </DivLabel>

            <InputSing
              placeholder="Digite o nome do titular"
              {...register("printedName")}
            />
            {errors.printedName && <span>{errors.printedName.message}</span>}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Número do Cartão</Label>
            </DivLabel>

            <InputSing
              placeholder="Digite o número do cartão"
              {...register("cardNumber")}
            />
            {errors.cardNumber && <span>{errors.cardNumber.message}</span>}
          </InputWrapper>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Bandeira</Label>
              </DivLabel>

              <InputSelect {...register("cardBrandUuid")}>
                <option value="">
                  {isLoading ? "Carregando..." : "Selecione"}
                </option>

                {cardOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </InputSelect>

              {errors.cardBrandUuid && (
                <span>{errors.cardBrandUuid.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Código de Segurança</Label>
              </DivLabel>

              <InputSing
                placeholder="Digite o código de segurança"
                {...register("securityCode")}
              />
              {errors.securityCode && (
                <span>{errors.securityCode.message}</span>
              )}
            </InputWrapper>
          </DivSeparator>
          <InputWrapper>
            <DivLabel>
              <Label>Data de Validade</Label>
            </DivLabel>

            <InputSing type="date" {...register("expirationDate")} />
            {errors.expirationDate && (
              <span>{errors.expirationDate.message}</span>
            )}
          </InputWrapper>
        </ModalSection>
        <ModalButtons>
          {button2 && (
            <ModalButtonWarningWhite onClick={back}>
              {button2}
            </ModalButtonWarningWhite>
          )}
          {button && (
            <ModalButtonWarning type="button" onClick={handleSubmit(onSubmit)}>
              {button}
            </ModalButtonWarning>
          )}
        </ModalButtons>
      </ModalContainerSmall>
    </Overlay>
  );
};

export default ModalCartao;
