import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler, Path } from "react-hook-form";
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
  PageSubtitle,
  PageTitle,
  SubTitle,
} from "./style";
import { AppShell } from "../../components/AppShell/AppShell";
import {
  CadastroClienteForm,
  CadastroClienteSchema,
} from "../../validations/schemas/CadastroCliente";
import { SingClient } from "../../services/requests/singClient";
import { maskAreaCode, maskCep, maskCpf, maskPhone, onlyDigits } from "../../utils/masks";

// opções
export const GENDER_OPTIONS = [
  { label: "Masculino", value: 1 },
  { label: "Feminino", value: 2 },
  { label: "Não-binário", value: 3 },
  { label: "Prefiro não informar", value: 4 },
];

export const RESIDENCE_OPTIONS = [
  { label: "Casa", value: 1 },
  { label: "Apartamento", value: 2 },
  { label: "Condomínio", value: 3 },
  { label: "Comercial", value: 4 },
  { label: "Outro", value: 5 },
];

export const ADDRESS_TYPE_OPTIONS = [
  { label: "Cobrança", value: 1 },
  { label: "Entrega", value: 2 },
  { label: "Residencial", value: 3 },
];

export const PHONE_TYPE_OPTIONS = [
  { label: "Celular", value: 1 },
  { label: "Residencial", value: 2 },
  { label: "Trabalho", value: 3 },
  { label: "Outro", value: 4 },
];
export const STREET_OPTIONS = [
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

const EMPTY_ADDRESS = {
  zipCode: "",
  street: "",
  number: "",
  neighborhood: "",
  state: "",
  city: "",
  country: "Brasil",
  residenceType: 1,
  streetType: "Rua",
  observations: "",
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
      gender: 0,
      birthDate: "",
      cpf: "",
      email: "",
      phoneNumber: "",
      areaCode: "",
      phoneType: 1,
      password: "",
      passwordConfirmation: "",
      billingAddresses: [{ ...EMPTY_ADDRESS }],
      deliveryAddresses: [{ ...EMPTY_ADDRESS }],
      cards: [{ ...EMPTY_CARD }],
    },
  });

  const watchBilling = watch("billingAddresses");
  const watchDelivery = watch("deliveryAddresses");
  const watchCards = watch("cards");

  function handleSameAddress(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setSameAddress(checked);
    if (checked) {
      setValue(
        "deliveryAddresses",
        watchBilling.map((address) => ({ ...address })),
      );
    }
  }

  function addBillingAddress() {
    setValue("billingAddresses", [...watchBilling, { ...EMPTY_ADDRESS }]);
  }

  function removeBillingAddress(index: number) {
    if (watchBilling.length <= 1) return;
    setValue(
      "billingAddresses",
      watchBilling.filter((_, i) => i !== index),
    );
  }

  function addDeliveryAddress() {
    setValue("deliveryAddresses", [...watchDelivery, { ...EMPTY_ADDRESS }]);
  }

  function removeDeliveryAddress(index: number) {
    if (watchDelivery.length <= 1) return;
    setValue(
      "deliveryAddresses",
      watchDelivery.filter((_, i) => i !== index),
    );
  }

  type CardField = keyof CadastroClienteForm["cards"][number];

  function handleCardChange(idx: number, name: CardField, value: string) {
    setValue(`cards.${idx}.${name}` as Path<CadastroClienteForm>, value);
  }

  const onSubmit: SubmitHandler<CadastroClienteForm> = async (data) => {
    const payload = {
      Name: data.name,
      Gender: data.gender,
      BirthDate: data.birthDate,
      Cpf: onlyDigits(data.cpf),
      Email: data.email,
      PhoneType: data.phoneType,
      AreaCode: onlyDigits(data.areaCode),
      PhoneNumber: onlyDigits(data.phoneNumber),
      Password: data.password,
      PasswordConfirmation: data.passwordConfirmation,
      BillingAddresses: data.billingAddresses.map((address) => ({
        ...address,
        zipCode: onlyDigits(address.zipCode),
      })),
      DeliveryAddresses: (sameAddress
        ? data.billingAddresses
        : data.deliveryAddresses
      ).map((address) => ({
        ...address,
        zipCode: onlyDigits(address.zipCode),
      })),
      CreditCards: data.cards.map((card, idx) => ({
        CardBrandName: card.cardBrandName,
        CardNumber: card.cardNumber,
        PrintedName: card.printedName,
        SecurityCode: card.securityCode,
        ExpirationDate: card.expirationDate + "-01",
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
          <div>
            <PageTitle>Cadastro de cliente</PageTitle>
            <PageSubtitle>
              Preencha os dados pessoais, endereços e cartões para concluir o
              cadastro.
            </PageSubtitle>
          </div>

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
              <InputSing
                {...register("cpf", {
                  onChange: (e) => {
                    e.target.value = maskCpf(e.target.value);
                  },
                })}
                placeholder="000.000.000-00"
              />
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
                {...register("phoneNumber", {
                  onChange: (e) => {
                    e.target.value = maskPhone(e.target.value);
                  },
                })}
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
                {...register("areaCode", {
                  onChange: (e) => {
                    e.target.value = maskAreaCode(e.target.value);
                  },
                })}
                placeholder="11"
                maxLength={2}
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
                {...register("phoneType", {
                  setValueAs: (v) => Number(v),
                })}
              >
                <option value="">Selecione</option>
                {PHONE_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
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
          {watchBilling.map((_, idx) => (
            <div key={`billing-${idx}`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <SubTitle style={{ marginBottom: 8 }}>{`Cobrança ${idx + 1}`}</SubTitle>
                {watchBilling.length > 1 && (
                  <RemoveButton onClick={() => removeBillingAddress(idx)}>
                    Remover endereço
                  </RemoveButton>
                )}
              </div>
              <AddressInputs
                prefix={`billingAddresses.${idx}`}
                register={register}
                errors={(errors.billingAddresses as any)?.[idx]}
              />
            </div>
          ))}
          {(errors.billingAddresses as any)?.message && (
            <span style={{ color: "red" }}>
              {(errors.billingAddresses as any).message}
            </span>
          )}
          <AddCardButton onClick={addBillingAddress}>
            + Adicionar endereço de cobrança
          </AddCardButton>

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

          <SubTitle>Endereço de entrega</SubTitle>
          {watchDelivery.map((_, idx) => (
            <div key={`delivery-${idx}`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <SubTitle style={{ marginBottom: 8 }}>{`Entrega ${idx + 1}`}</SubTitle>
                {watchDelivery.length > 1 && (
                  <RemoveButton onClick={() => removeDeliveryAddress(idx)}>
                    Remover endereço
                  </RemoveButton>
                )}
              </div>
              <AddressInputs
                prefix={`deliveryAddresses.${idx}`}
                register={register}
                errors={(errors.deliveryAddresses as any)?.[idx]}
                disabled={sameAddress}
              />
            </div>
          ))}
          {(errors.deliveryAddresses as any)?.message && (
            <span style={{ color: "red" }}>
              {(errors.deliveryAddresses as any).message}
            </span>
          )}
          <AddCardButton onClick={addDeliveryAddress} disabled={sameAddress}>
            + Adicionar endereço de entrega
          </AddCardButton>

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
            {...register(`${prefix}.zipCode`, {
              onChange: (e) => {
                e.target.value = maskCep(e.target.value);
              },
            })}
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
            {...register(`${prefix}.residenceType`, {
              setValueAs: (v) => Number(v),
            })}
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
          >
            {RESIDENCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
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
