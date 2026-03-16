import { useLocation, useNavigate } from "react-router-dom";
import {
  BodyData,
  ButtonDiv,
  DataContainer,
  DivLabel,
  DivSeparator,
  InputSelect,
  InputSing,
  InputWrapper,
  Label,
  NextButton,
} from "../Cadastro/style";
import { useState } from "react";
import { AppShell } from "../../components/AppShell/AppShell";
import EnderecoTable from "../../components/Tables/EnderecoTable";
import { IGetAddressResponse } from "../../services/interfaces/GetAddressClient";
import { useForm } from "react-hook-form";
import {
  AddressFormData,
  addressSchema,
} from "../../validations/schemas/CadastroEndereco";
import { yupResolver } from "@hookform/resolvers/yup";
import { RESIDENCE_OPTIONS, STREET_OPTIONS } from "../Cadastro";
import { UpdateAddress } from "../../services/requests/editAddress";

export default function EdicaoEndereco() {
  const navigate = useNavigate();
  const location = useLocation();

  const { endereco, clientUuid } = location.state as {
    endereco: IGetAddressResponse;
    clientUuid: string;
  };

  const handleEdit = (uuid: string) => {
    navigate("/editarUsuario", { state: { uuid } });
  };

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      addressType: endereco.addressType,
      residenceType: endereco.residenceType,
      label: endereco.label,
      streetType: endereco.streetType,
      street: endereco.street,
      number: endereco.number,
      neighborhood: endereco.neighborhood,
      zipCode: endereco.zipCode,
      city: endereco.city,
      state: endereco.state,
      country: endereco.country,
      observations: endereco.observations,
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    const payload = {
      AddressType: data.addressType,
      Label: data.label,
      ResidenceType: data.residenceType,
      StreetType: data.streetType,
      Street: data.street,
      Number: data.number,
      Neighborhood: data.neighborhood,
      ZipCode: data.zipCode,
      City: data.city,
      State: data.state,
      Country: data.country,
      Observations: data.observations || null,
    };

    try {
      await UpdateAddress(clientUuid, payload, endereco.uuid);
      console.log("Endereço atualizado!");
      handleEdit(clientUuid);
    } catch (err) {
      console.error("Erro ao atualizar endereço:", err);
    }

    console.log("Payload para enviar ao backend:", payload);
  };

  return (
    <AppShell title="Editar Endereço">
      <DataContainer>
        <BodyData>
          <DivSeparator>
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
                <Label>Tipo de Logradouro</Label>
              </DivLabel>
              <InputSelect {...register("streetType")}>
                {STREET_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </InputSelect>
              {errors.streetType && (
                <span style={{ color: "red" }}>
                  {errors.streetType.message}
                </span>
              )}
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>CEP</Label>
              </DivLabel>
              <InputSing {...register("zipCode")} placeholder="00000-000" />
              {errors.zipCode && (
                <span style={{ color: "red" }}>{errors.zipCode.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Rua</Label>
              </DivLabel>
              <InputSing {...register("street")} placeholder="Digite a rua" />
              {errors.street && (
                <span style={{ color: "red" }}>{errors.street.message}</span>
              )}
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Número</Label>
              </DivLabel>
              <InputSing {...register("number")} placeholder="Nº" />
              {errors.number && (
                <span style={{ color: "red" }}>{errors.number.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Bairro</Label>
              </DivLabel>
              <InputSing
                {...register("neighborhood")}
                placeholder="Digite o Bairro"
              />
              {errors.neighborhood && (
                <span style={{ color: "red" }}>
                  {errors.neighborhood.message}
                </span>
              )}
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Cidade</Label>
              </DivLabel>
              <InputSing {...register("city")} placeholder="Digite a cidade" />
              {errors.city && (
                <span style={{ color: "red" }}>{errors.city.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Estado</Label>
              </DivLabel>
              <InputSing {...register("state")} placeholder="Digite o estado" />
              {errors.state && (
                <span style={{ color: "red" }}>{errors.state.message}</span>
              )}
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>País</Label>
              </DivLabel>
              <InputSing {...register("country")} placeholder="Digite o País" />
              {errors.country && (
                <span style={{ color: "red" }}>{errors.country.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Observações</Label>
              </DivLabel>
              <InputSing
                {...register("observations")}
                placeholder="Complemento, referência..."
              />
              {errors.observations && (
                <span style={{ color: "red" }}>
                  {errors.observations.message}
                </span>
              )}
            </InputWrapper>
          </DivSeparator>

          <EnderecoTable uuid={clientUuid} />

          <ButtonDiv>
            <NextButton onClick={handleSubmit(onSubmit)}>Salvar</NextButton>
          </ButtonDiv>
        </BodyData>
      </DataContainer>
    </AppShell>
  );
}
