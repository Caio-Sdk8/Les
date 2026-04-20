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
import {
  createCreditCard,
  createMyCreditCard,
} from "../../services/requests/sinCredit";
import { GetCardBrandRequest } from "../../services/requests/getCardBrand";
import { useQueryClient } from "@tanstack/react-query";
import {
  maskCardExpiration,
  maskCardNumber,
  maskSecurityCode,
} from "../../utils/masks";

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
  useMyEndpoint?: boolean;
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
  useMyEndpoint = false,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: yupResolver(cardSchema),
    defaultValues: {
      isPreferred: true,
    },
  });
  const { data: cardBrands, isLoading } = GetCardBrandRequest();

  const cardOptions =
    cardBrands?.map((item) => ({
      label: item.name,
      value: item.uuid,
    })) ?? [];

  const queryClient = useQueryClient();

  const toApiExpirationDate = (maskedExpirationDate: string) => {
    const [month, year] = maskedExpirationDate.split("/");
    const fullYear = `20${year}`;
    return `${fullYear}-${month}-01`;
  };

  const onSubmit = async (formData: CardFormData) => {
    try {
      if (!useMyEndpoint && !uuid) return;

      const payload = {
        CardBrandUuid: formData.cardBrandUuid,
        CardNumber: formData.cardNumber.replace(/\D/g, ""),
        PrintedName: formData.printedName.trim().toUpperCase(),
        SecurityCode: formData.securityCode.replace(/\D/g, ""),
        ExpirationDate: toApiExpirationDate(formData.expirationDate),
        IsPreferred: formData.isPreferred ?? true,
      };

      if (useMyEndpoint) {
        await createMyCreditCard(payload);
      } else {
        await createCreditCard(uuid, payload);
      }

      await queryClient.invalidateQueries({
        queryKey: ["GetAllCLientCards", uuid],
      });

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
              maxLength={23}
              {...register("cardNumber", {
                onChange: (event) => {
                  event.target.value = maskCardNumber(event.target.value);
                },
              })}
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
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
                placeholder="CVV"
                {...register("securityCode", {
                  onChange: (event) => {
                    event.target.value = maskSecurityCode(event.target.value);
                  },
                })}
              />
              {errors.securityCode && (
                <span>{errors.securityCode.message}</span>
              )}
            </InputWrapper>
          </DivSeparator>
          <InputWrapper>
            <DivLabel>
              <Label>Validade (MM/AA)</Label>
            </DivLabel>

            <InputSing
              inputMode="numeric"
              autoComplete="cc-exp"
              maxLength={5}
              placeholder="MM/AA"
              {...register("expirationDate", {
                onChange: (event) => {
                  event.target.value = maskCardExpiration(event.target.value);
                },
              })}
            />
            {errors.expirationDate && (
              <span>{errors.expirationDate.message}</span>
            )}
          </InputWrapper>
          <InputWrapper>
            <label style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
              <input type="checkbox" {...register("isPreferred")} />
              Definir como cartão preferencial
            </label>
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
