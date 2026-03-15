import { useForm } from "react-hook-form";
import { RESIDENCE_OPTIONS, STREET_OPTIONS } from "../../pages/Cadastro";
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
  AddressFormData,
  addressSchema,
} from "../../validations/schemas/CadastroEndereco";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddAddressClient } from "../../services/requests/singAddress";

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
  uuid?: string;
};

const ModalEndereco = ({
  back,
  next,
  title,
  message,
  message2,
  button,
  button2,
  height,
  uuid,
  width,
}: Props) => {
  const ADDRESS_TYPE_OPTIONS = [
    { label: "Cobrança", value: 1 },
    { label: "Entrega", value: 2 },
    { label: "Residencial", value: 3 },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      country: "Brasil",
      streetType: "Rua",
      residenceType: 1,
      addressType: 0,
    },
  });

  const onSubmit = async (formData: AddressFormData) => {
    try {
      if (!uuid) return;
      await AddAddressClient(uuid, formData);
      next();
    } catch (error) {
      console.error("Erro ao cadastrar endereço:", error);
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

          <InputWrapper>
            <DivLabel>
              <Label>Tipo de Endereço</Label>
            </DivLabel>
            <InputSelect
              {...register("addressType", { setValueAs: (v) => Number(v) })}
            >
              <option value={0}>Selecione</option>
              {ADDRESS_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </InputSelect>
            {errors.addressType && (
              <span style={{ color: "red" }}>{errors.addressType.message}</span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Tipo de Residência</Label>
            </DivLabel>
            <InputSelect
              {...register("residenceType", { setValueAs: (v) => Number(v) })}
            >
              {RESIDENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </InputSelect>
            {errors.residenceType && (
              <span style={{ color: "red" }}>
                {errors.residenceType.message}
              </span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Tipo Logradouro</Label>
            </DivLabel>
            <InputSelect {...register("streetType")}>
              {STREET_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </InputSelect>
            {errors.streetType && (
              <span style={{ color: "red" }}>{errors.streetType.message}</span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Apelido</Label>
            </DivLabel>
            <InputSing
              placeholder="Digite o apelido do endereço"
              {...register("label")}
            />
            {errors.label && (
              <span style={{ color: "red" }}>{errors.label.message}</span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Rua</Label>
            </DivLabel>
            <InputSing placeholder="Digite a rua" {...register("street")} />
            {errors.street && (
              <span style={{ color: "red" }}>{errors.street.message}</span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Número</Label>
            </DivLabel>
            <InputSing placeholder="Nº" {...register("number")} />
            {errors.number && (
              <span style={{ color: "red" }}>{errors.number.message}</span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Bairro</Label>
            </DivLabel>
            <InputSing
              placeholder="Digite o bairro"
              {...register("neighborhood")}
            />
            {errors.neighborhood && (
              <span style={{ color: "red" }}>
                {errors.neighborhood.message}
              </span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>CEP</Label>
            </DivLabel>
            <InputSing placeholder="00000-000" {...register("zipCode")} />
            {errors.zipCode && (
              <span style={{ color: "red" }}>{errors.zipCode.message}</span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Cidade</Label>
            </DivLabel>
            <InputSing placeholder="Digite a cidade" {...register("city")} />
            {errors.city && (
              <span style={{ color: "red" }}>{errors.city.message}</span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Estado</Label>
            </DivLabel>
            <InputSing placeholder="Ex: SP" {...register("state")} />
            {errors.state && (
              <span style={{ color: "red" }}>{errors.state.message}</span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>País</Label>
            </DivLabel>
            <InputSing placeholder="Brasil" {...register("country")} />
            {errors.country && (
              <span style={{ color: "red" }}>{errors.country.message}</span>
            )}
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Observações</Label>
            </DivLabel>
            <InputSing
              placeholder="Complemento, referência..."
              {...register("observations")}
            />
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

export default ModalEndereco;
