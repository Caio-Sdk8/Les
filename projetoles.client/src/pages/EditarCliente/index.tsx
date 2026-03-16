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
  SubTitle,
} from "../Cadastro/style";
import { EditButton } from "./style";
import { useEffect, useState } from "react";
import ModalCartao from "../../components/Modals/Cartão";
import ModalEndereco from "../../components/Modals/Endereco";
import ModalSenha from "../../components/Modals/Senha";
import { AppShell } from "../../components/AppShell/AppShell";
import EnderecoTable from "../../components/Tables/EnderecoTable";
import CartaoTable from "../../components/Tables/CartaoTable";
import { GetClientDataRequest } from "../../services/requests/getClientData";
import { useForm } from "react-hook-form";
import {
  EditClienteForm,
  EditClienteSchema,
} from "../../validations/schemas/EditClientSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { GENDER_OPTIONS } from "../Cadastro";
import { UpdateClient } from "../../services/requests/editClient";
import { PhoneTypeEnum } from "../../validations/interfaces/interfaces";

export default function Edicao() {
  const [modalCartao, setModalCartao] = useState(false);
  const [modalEndereco, setModalEndereco] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const customerName =
    (
      location.state as { customerName?: string } | null
    )?.customerName?.trim() ?? "";

  const pageTitle = customerName
    ? `Edição de ${customerName}`
    : "Edição de Cliente";

  const customerUuid = location.state?.uuid;

  const { data } = GetClientDataRequest(customerUuid);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditClienteForm>({
    resolver: yupResolver(EditClienteSchema),
    defaultValues: {
      name: "",
      gender: 0,
      birthDate: "",
      cpf: "",
      email: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name ?? "",
        gender: data.gender ?? 0,
        birthDate: data.birthDate
          ? new Date(data.birthDate).toISOString().split("T")[0]
          : "",
        cpf: data.cpf ?? "",
        email: data.email ?? "",
        phoneType: data?.phones[0].phoneType ?? "",
        areaCode: data?.phones[0].areaCode ?? "",
        phoneNumber: data?.phones[0].number ?? "",
      });
    }
  }, [data, reset]);

  const handleSalvar = async (formData: EditClienteForm) => {
    if (!customerUuid) return;

    const payload = {
      Name: formData.name,
      Gender: Number(formData.gender),
      BirthDate: formData.birthDate,
      Email: formData.email,
      Phones: [
        {
          PhoneType: Number(formData.phoneType),
          AreaCode: formData.areaCode,
          Number: formData.phoneNumber,
          IsMain: true,
        },
      ],
    };

    try {
      const updatedClient = await UpdateClient(customerUuid, payload);
      console.log("Cliente atualizado:", updatedClient);
      navigate("/clientes");
    } catch (err) {
      console.error("Erro ao atualizar cliente", err);
    }
  };

  return (
    <AppShell title={pageTitle}>
      <DataContainer>
        <BodyData>
          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Gênero</Label>
              </DivLabel>
              <InputSelect
                {...register("gender", { setValueAs: (v) => Number(v) })}
              >
                <option value="">Selecione</option>
                {GENDER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </InputSelect>
              {errors.gender && (
                <span style={{ color: "red" }}>{errors.gender.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Nome</Label>
              </DivLabel>
              <InputSing {...register("name")} placeholder="Digite o nome" />
              {errors.name && (
                <span style={{ color: "red" }}>{errors.name.message}</span>
              )}
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Data de nascimento</Label>
              </DivLabel>
              <InputSing
                type="date"
                {...register("birthDate")}
                placeholder="00/00/0000"
              />
              {errors.birthDate && (
                <span style={{ color: "red" }}>{errors.birthDate.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>CPF</Label>
              </DivLabel>
              <InputSing
                {...register("cpf")}
                placeholder="000.000.000-00"
                readOnly
              />
              {errors.cpf && (
                <span style={{ color: "red" }}>{errors.cpf.message}</span>
              )}
            </InputWrapper>
          </DivSeparator>

          {/* <DivSeparator> */}
          <InputWrapper>
            <DivLabel>
              <Label>Email</Label>
            </DivLabel>
            <InputSing {...register("email")} placeholder="Digite o e-mail" />
            {errors.email && (
              <span style={{ color: "red" }}>{errors.email.message}</span>
            )}
          </InputWrapper>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>DDD</Label>
              </DivLabel>
              <InputSing
                {...register("areaCode")}
                placeholder="Digite o DDD do telefone"
              />
              {errors.areaCode && (
                <span style={{ color: "red" }}>{errors.areaCode.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Tipo de Telefone</Label>
              </DivLabel>
              <InputSelect
                {...register("phoneType", { setValueAs: (v) => Number(v) })}
              >
                <option value="">Selecione</option>
                {Object.entries(PhoneTypeEnum).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </InputSelect>
              {errors.phoneType && (
                <span style={{ color: "red" }}>{errors.phoneType.message}</span>
              )}
            </InputWrapper>
          </DivSeparator>

          <InputWrapper>
            <DivLabel>
              <Label>Telefone</Label>
            </DivLabel>
            <InputSing
              {...register("phoneNumber")}
              placeholder="Digite o telefone"
            />
            {errors.phoneNumber && (
              <span style={{ color: "red" }}>{errors.phoneNumber.message}</span>
            )}
          </InputWrapper>

          <EnderecoTable uuid={customerUuid} />

          <CartaoTable uuid={customerUuid} clientUuid={customerUuid} />

          <ButtonDiv>
            <EditButton onClick={() => setModalSenha(true)}>
              Alterar Senha
            </EditButton>
            <EditButton onClick={() => setModalEndereco(true)}>
              Cadastrar Endereço
            </EditButton>
            <EditButton onClick={() => setModalCartao(true)}>
              Cadastrar Cartão
            </EditButton>
            <NextButton onClick={handleSubmit(handleSalvar)}>Salvar</NextButton>
          </ButtonDiv>
        </BodyData>
      </DataContainer>

      {modalCartao && (
        <ModalCartao
          next={() => setModalCartao(false)}
          title="Cadastro de cartão"
          button="Cadastrar"
          button2="Cancelar"
          back={() => setModalCartao(false)}
          uuid={customerUuid}
        />
      )}

      {modalSenha && (
        <ModalSenha
          next={() => setModalSenha(false)}
          title="Alterar Senha"
          button="Alterar"
          button2="Cancelar"
          back={() => setModalSenha(false)}
          uuid={customerUuid}
        />
      )}

      {modalEndereco && (
        <ModalEndereco
          next={() => setModalEndereco(false)}
          title="Cadastro de endereço"
          button="Cadastrar"
          button2="Cancelar"
          back={() => setModalEndereco(false)}
          width="700px"
          uuid={customerUuid}
        />
      )}
    </AppShell>
  );
}
