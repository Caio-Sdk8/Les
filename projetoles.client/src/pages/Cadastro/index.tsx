import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  BodyData,
  ButtonDiv,
  CardBadge,
  CardHeader,
  CardItem,
  CardsContainer,
  DataContainer,
  DivLabel,
  DivSeparator,
  InputSing,
  InputSelect,
  InputWrapper,
  Label,
  NextButton,
  PreferredBadge,
  RemoveButton,
  SetPreferredButton,
  AddCardButton,
  SubTitle,
} from "./style";
import { AppShell } from "../../components/AppShell/AppShell";
import {
  CadastroClienteForm,
  CadastroClienteSchema,
} from "../../validations/schemas/CadastroCliente";
import { SingClient } from "../../services/requests/singClient";

// opções
const GENDER_OPTIONS = [
  { label: "Masculino", value: 1 },
  { label: "Feminino", value: 2 },
  { label: "Não-binário", value: 3 },
  { label: "Prefiro não informar", value: 4 },
];
const PHONE_TYPE_OPTIONS = ["Celular", "Residencial", "Comercial", "Outro"];
const RESIDENCE_OPTIONS = [
  "Casa",
  "Apartamento",
  "Condomínio",
  "Comercial",
  "Outro",
];
const STREET_OPTIONS = [
  "Rua",
  "Avenida",
  "Alameda",
  "Travessa",
  "Estrada",
  "Praça",
  "Largo",
  "Outro",
];
const BRAND_OPTIONS = [
  "Visa",
  "Mastercard",
  "American Express",
  "Elo",
  "Hipercard",
  "Diners Club",
];

const EMPTY_CARD = {
  cardBrandName: "Visa",
  cardNumber: "",
  printedName: "",
  securityCode: "",
  expirationDate: "",
};

export default function Cadastro() {
  const navigate = useNavigate();
  const [sameAddress, setSameAddress] = useState(false);
  const [preferredIdx, setPreferred] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CadastroClienteForm>({
    resolver: yupResolver(CadastroClienteSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      cpf: "",
      email: "",
      phoneNumber: "",
      areaCode: "",
      phoneType: "Celular",
      password: "",
      passwordConfirmation: "",
      billingAddress: {
        zipCode: "",
        street: "",
        number: "",
        neighborhood: "",
        state: "",
        city: "",
        country: "Brasil",
        residenceType: "Casa",
        streetType: "Rua",
        observations: "",
      },
      deliveryAddress: {
        zipCode: "",
        street: "",
        number: "",
        neighborhood: "",
        state: "",
        city: "",
        country: "Brasil",
        residenceType: "Casa",
        streetType: "Rua",
        observations: "",
      },
      cards: [{ ...EMPTY_CARD }],
    },
  });

  const watchBilling = watch("billingAddress");
  const watchDelivery = watch("deliveryAddress");
  const watchCards = watch("cards");

  function handleSameAddress(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setSameAddress(checked);
    if (checked) {
      Object.entries(watchBilling).forEach(([k, v]) =>
        setValue(`deliveryAddress.${k}`, v),
      );
    }
  }

  function handleCardChange(idx: number, name: string, value: string) {
    setValue(`cards.${idx}.${name}`, value);
  }

  const onSubmit: SubmitHandler<CadastroClienteForm> = async (data) => {
    const payload = {
      Name: data.name,
      Gender: data.gender,
      BirthDate: data.birthDate,
      Cpf: data.cpf,
      Email: data.email,
      PhoneType: data.phoneType,
      AreaCode: data.areaCode,
      PhoneNumber: data.phoneNumber,
      Password: data.password,
      PasswordConfirmation: data.passwordConfirmation,
      BillingAddress: { ...data.billingAddress },
      DeliveryAddress: { ...data.deliveryAddress },
      CreditCards: data.cards.map((card, idx) => ({
        CardBrandName: card.cardBrandName,
        CardNumber: card.cardNumber,
        PrintedName: card.printedName,
        SecurityCode: card.securityCode,
        ExpirationDate: card.expirationDate,
        IsPreferred: idx === preferredIdx,
      })),
    };
    try {
      const { dataClient } = await SingClient(payload);

      console.log("Payload do cliente:", payload);
      navigate("/clientes");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <AppShell title="Cadastro do Usuário">
      <DataContainer>
        <BodyData>
          {/* Dados Pessoais */}
          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Gênero</Label>
              </DivLabel>
              <InputSelect
                {...register("gender", {
                  setValueAs: (v) => Number(v),
                })}
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
              <InputSing type="date" {...register("birthDate")} />
              {errors.birthDate && (
                <span style={{ color: "red" }}>{errors.birthDate.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>CPF</Label>
              </DivLabel>
              <InputSing {...register("cpf")} placeholder="000.000.000-00" />
              {errors.cpf && (
                <span style={{ color: "red" }}>{errors.cpf.message}</span>
              )}
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Email</Label>
              </DivLabel>
              <InputSing
                type="email"
                {...register("email")}
                placeholder="Digite o e-mail"
              />
              {errors.email && (
                <span style={{ color: "red" }}>{errors.email.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Telefone</Label>
              </DivLabel>
              <InputSing
                {...register("phoneNumber")}
                placeholder="00000-0000"
              />
              {errors.phoneNumber && (
                <span style={{ color: "red" }}>
                  {errors.phoneNumber.message}
                </span>
              )}
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>DDD</Label>
              </DivLabel>
              <InputSing
                {...register("areaCode")}
                placeholder="11"
                maxLength={3}
              />
              {errors.areaCode && (
                <span style={{ color: "red" }}>{errors.areaCode.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Tipo de Telefone</Label>
              </DivLabel>
              <InputSelect {...register("phoneType")}>
                {PHONE_TYPE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </InputSelect>
              {errors.phoneType && (
                <span style={{ color: "red" }}>{errors.phoneType.message}</span>
              )}
            </InputWrapper>
          </DivSeparator>

          {/* Senha */}
          <SubTitle>Senha</SubTitle>
          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Senha</Label>
              </DivLabel>
              <InputSing
                type="password"
                {...register("password")}
                placeholder="Digite a senha"
              />
              {errors.password && (
                <span style={{ color: "red" }}>{errors.password.message}</span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Confirmar senha</Label>
              </DivLabel>
              <InputSing
                type="password"
                {...register("passwordConfirmation")}
                placeholder="Repita a senha"
              />
              {errors.passwordConfirmation && (
                <span style={{ color: "red" }}>
                  {errors.passwordConfirmation.message}
                </span>
              )}
            </InputWrapper>
          </DivSeparator>

          {/* Endereço de Cobrança */}
          <SubTitle>Endereço de cobrança</SubTitle>
          <AddressInputs
            prefix="billingAddress"
            register={register}
            errors={errors.billingAddress}
          />

          {/* Checkbox mesmo endereço */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              fontSize: 14,
              color: "#555",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={sameAddress}
              onChange={handleSameAddress}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            Endereço de entrega igual ao de cobrança
          </label>

          {/* Endereço de Entrega */}
          <SubTitle>Endereço de entrega</SubTitle>
          <AddressInputs
            prefix="deliveryAddress"
            register={register}
            errors={errors.deliveryAddress}
            disabled={sameAddress}
          />

          {/* Cartões de Crédito */}
          <SubTitle>Cartões de Crédito</SubTitle>
          <CardsContainer>
            {watchCards.map((card, idx) => (
              <CardItem key={idx} $preferred={idx === preferredIdx}>
                <CardHeader>
                  <CardBadge $preferred={idx === preferredIdx}>
                    {idx === preferredIdx
                      ? "★ Preferencial"
                      : `Cartão ${idx + 1}`}
                  </CardBadge>
                  <div style={{ display: "flex", gap: 8 }}>
                    {idx !== preferredIdx && (
                      <SetPreferredButton onClick={() => setPreferred(idx)}>
                        Definir preferencial
                      </SetPreferredButton>
                    )}
                    {watchCards.length > 1 && (
                      <RemoveButton
                        onClick={() =>
                          setValue(
                            "cards",
                            watchCards.filter((_, i) => i !== idx),
                          )
                        }
                      >
                        Remover
                      </RemoveButton>
                    )}
                  </div>
                </CardHeader>

                <DivSeparator>
                  <InputWrapper>
                    <DivLabel>
                      <Label>Bandeira</Label>
                    </DivLabel>
                    <InputSelect
                      value={card.cardBrandName}
                      onChange={(e) =>
                        handleCardChange(idx, "cardBrandName", e.target.value)
                      }
                    >
                      {BRAND_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </InputSelect>
                  </InputWrapper>
                  <InputWrapper>
                    <DivLabel>
                      <Label>Número do Cartão</Label>
                    </DivLabel>
                    <InputSing
                      value={card.cardNumber}
                      onChange={(e) =>
                        handleCardChange(idx, "cardNumber", e.target.value)
                      }
                      placeholder="0000 0000 0000 0000"
                    />
                  </InputWrapper>
                </DivSeparator>

                <DivSeparator>
                  <InputWrapper>
                    <DivLabel>
                      <Label>Nome impresso no Cartão</Label>
                    </DivLabel>
                    <InputSing
                      value={card.printedName}
                      onChange={(e) =>
                        handleCardChange(idx, "printedName", e.target.value)
                      }
                      placeholder="Como está no cartão"
                      style={{ textTransform: "uppercase" }}
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <DivLabel>
                      <Label>Código de Segurança</Label>
                    </DivLabel>
                    <InputSing
                      value={card.securityCode}
                      onChange={(e) =>
                        handleCardChange(idx, "securityCode", e.target.value)
                      }
                      type="password"
                      placeholder="CVV"
                      maxLength={4}
                    />
                  </InputWrapper>
                </DivSeparator>

                <InputWrapper>
                  <DivLabel>
                    <Label>Validade (AAAA-MM)</Label>
                  </DivLabel>
                  <InputSing
                    value={card.expirationDate}
                    onChange={(e) =>
                      handleCardChange(idx, "expirationDate", e.target.value)
                    }
                    placeholder="2028-12"
                    maxLength={7}
                    style={{ maxWidth: 220 }}
                  />
                </InputWrapper>

                {idx === preferredIdx && (
                  <PreferredBadge>
                    Este é o cartão preferencial para cobranças
                  </PreferredBadge>
                )}
              </CardItem>
            ))}
            <AddCardButton
              onClick={() =>
                setValue("cards", [...watchCards, { ...EMPTY_CARD }])
              }
            >
              + Adicionar outro cartão
            </AddCardButton>
          </CardsContainer>

          <ButtonDiv>
            <NextButton onClick={handleSubmit(onSubmit)}>Salvar</NextButton>
          </ButtonDiv>
        </BodyData>
      </DataContainer>
    </AppShell>
  );
}

// componente auxiliar para inputs de endereço
function AddressInputs({ prefix, register, errors, disabled }: any) {
  return (
    <>
      <DivSeparator>
        <InputWrapper>
          <DivLabel>
            <Label>CEP</Label>
          </DivLabel>
          <InputSing
            {...register(`${prefix}.zipCode`)}
            placeholder="00000-000"
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
          {errors?.zipCode && (
            <span style={{ color: "red" }}>{errors.zipCode.message}</span>
          )}
        </InputWrapper>

        <InputWrapper>
          <DivLabel>
            <Label>Rua</Label>
          </DivLabel>
          <InputSing
            {...register(`${prefix}.street`)}
            placeholder="Digite a rua"
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
          {errors?.street && (
            <span style={{ color: "red" }}>{errors.street.message}</span>
          )}
        </InputWrapper>
      </DivSeparator>

      <DivSeparator>
        <InputWrapper>
          <DivLabel>
            <Label>Número</Label>
          </DivLabel>
          <InputSing
            {...register(`${prefix}.number`)}
            placeholder="Nº"
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
          {errors?.number && (
            <span style={{ color: "red" }}>{errors.number.message}</span>
          )}
        </InputWrapper>

        <InputWrapper>
          <DivLabel>
            <Label>Bairro</Label>
          </DivLabel>
          <InputSing
            {...register(`${prefix}.neighborhood`)}
            placeholder="Digite o Bairro"
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
          {errors?.neighborhood && (
            <span style={{ color: "red" }}>{errors.neighborhood.message}</span>
          )}
        </InputWrapper>
      </DivSeparator>

      <DivSeparator>
        <InputWrapper>
          <DivLabel>
            <Label>Estado</Label>
          </DivLabel>
          <InputSing
            {...register(`${prefix}.state`)}
            placeholder="Ex: SP"
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
          {errors?.state && (
            <span style={{ color: "red" }}>{errors.state.message}</span>
          )}
        </InputWrapper>

        <InputWrapper>
          <DivLabel>
            <Label>Cidade</Label>
          </DivLabel>
          <InputSing
            {...register(`${prefix}.city`)}
            placeholder="Digite a cidade"
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
          {errors?.city && (
            <span style={{ color: "red" }}>{errors.city.message}</span>
          )}
        </InputWrapper>
      </DivSeparator>

      <DivSeparator>
        <InputWrapper>
          <DivLabel>
            <Label>Tipo de Residência</Label>
          </DivLabel>
          <InputSelect
            {...register(`${prefix}.residenceType`)}
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          >
            {RESIDENCE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </InputSelect>
          {errors?.residenceType && (
            <span style={{ color: "red" }}>{errors.residenceType.message}</span>
          )}
        </InputWrapper>

        <InputWrapper>
          <DivLabel>
            <Label>Tipo Logradouro</Label>
          </DivLabel>
          <InputSelect
            {...register(`${prefix}.streetType`)}
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          >
            {STREET_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </InputSelect>
          {errors?.streetType && (
            <span style={{ color: "red" }}>{errors.streetType.message}</span>
          )}
        </InputWrapper>
      </DivSeparator>

      <InputWrapper style={{ height: "auto" }}>
        <DivLabel>
          <Label>Observações</Label>
        </DivLabel>
        <InputSing
          {...register(`${prefix}.observations`)}
          placeholder="Complemento, referência..."
          disabled={disabled}
          style={{ opacity: disabled ? 0.5 : 1 }}
        />
        {errors?.observations && (
          <span style={{ color: "red" }}>{errors.observations.message}</span>
        )}
      </InputWrapper>
    </>
  );
}
