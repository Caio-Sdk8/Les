import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BodyData,
    ButtonDiv,
    CardBadge,
    CardHeader,
    CardItem,
    CardsContainer,
    CardSection,
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


const GENDER_OPTIONS = ["Masculino", "Feminino", "Não-binário", "Prefiro não informar"];
const PHONE_TYPE_OPTIONS = ["Celular", "Residencial", "Comercial", "Outro"];
const RESIDENCE_OPTIONS = ["Casa", "Apartamento", "Condomínio", "Comercial", "Outro"];
const STREET_OPTIONS = ["Rua", "Avenida", "Alameda", "Travessa", "Estrada", "Praça", "Largo", "Outro"];
const BRAND_OPTIONS = ["Visa", "Mastercard", "American Express", "Elo", "Hipercard", "Diners Club"];

const EMPTY_ADDRESS = {
    zipCode: "", street: "", number: "", neighborhood: "",
    state: "", city: "", country: "Brasil",
    residenceType: "Casa", streetType: "Rua", observations: "",
};

const EMPTY_CARD = {
    cardBrandName: "Visa", cardNumber: "", printedName: "",
    securityCode: "", expirationDate: "",
};


const maskCpf = v => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").slice(0, 14);
const maskPhone = v => v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 10);
const maskZip = v => v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
const maskCard = v => v.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);

function applyMask(name, value) {
    if (name === "cpf") return maskCpf(value);
    if (name === "phoneNumber") return maskPhone(value);
    if (name === "zipCode") return maskZip(value);
    if (name === "cardNumber") return maskCard(value);
    return value;
}

export default function Cadastro() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        gender: "", name: "", birthDate: "", cpf: "",
        email: "", phoneNumber: "", areaCode: "", phoneType: "Celular",
        password: "", passwordConfirmation: "",
    });

    const [billingAddress, setBilling] = useState({ ...EMPTY_ADDRESS });
    const [deliveryAddress, setDelivery] = useState({ ...EMPTY_ADDRESS });
    const [sameAddress, setSameAddress] = useState(false);

    const [cards, setCards] = useState([{ ...EMPTY_CARD }]);
    const [preferredIdx, setPreferred] = useState(0);

    const [errors, setErrors] = useState({});
    function handleField(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: applyMask(name, value) }));
    }

    function handleAddress(setter, otherSetter, e) {
        const { name, value } = e.target;
        setter(a => ({ ...a, [name]: applyMask(name, value) }));
        if (sameAddress && setter === setBilling) {
            otherSetter(a => ({ ...a, [name]: applyMask(name, value) }));
        }
    }

    function handleSameAddress(e) {
        const checked = e.target.checked;
        setSameAddress(checked);
        if (checked) setDelivery({ ...billingAddress });
    }

    function addCard() {
        setCards(c => [...c, { ...EMPTY_CARD }]);
    }

    function removeCard(idx) {
        if (cards.length === 1) return;
        const next = cards.filter((_, i) => i !== idx);
        setCards(next);
        if (preferredIdx === idx) setPreferred(0);
        else if (preferredIdx > idx) setPreferred(p => p - 1);
    }

    function changeCard(idx, e) {
        const { name, value } = e.target;
        setCards(c => c.map((card, i) => i === idx ? { ...card, [name]: applyMask(name, value) } : card));
    }


    const handleSalvar = () => {
        navigate("/clientes");
    };

    return (
        <AppShell title="Cadastro do Usuário">
            <DataContainer>
                <BodyData>

                    {/* ── Dados pessoais ─────────────────────────────────────────── */}

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>Gênero</Label></DivLabel>
                            <InputSelect name="gender" value={form.gender} onChange={handleField}>
                                <option value="">Selecione</option>
                                {GENDER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </InputSelect>
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Nome</Label></DivLabel>
                            <InputSing name="name" value={form.name} onChange={handleField} placeholder="Digite o nome" />
                        </InputWrapper>
                    </DivSeparator>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>Data de nascimento</Label></DivLabel>
                            <InputSing name="birthDate" value={form.birthDate} onChange={handleField} type="date" />
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>CPF</Label></DivLabel>
                            <InputSing name="cpf" value={form.cpf} onChange={handleField} placeholder="000.000.000-00" />
                        </InputWrapper>
                    </DivSeparator>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>Email</Label></DivLabel>
                            <InputSing name="email" value={form.email} onChange={handleField} placeholder="Digite o e-mail" type="email" />
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Telefone</Label></DivLabel>
                            <InputSing name="phoneNumber" value={form.phoneNumber} onChange={handleField} placeholder="00000-0000" />
                        </InputWrapper>
                    </DivSeparator>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>DDD</Label></DivLabel>
                            <InputSing name="areaCode" value={form.areaCode} onChange={handleField} placeholder="11" maxLength={3} />
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Tipo de Telefone</Label></DivLabel>
                            <InputSelect name="phoneType" value={form.phoneType} onChange={handleField}>
                                {PHONE_TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </InputSelect>
                        </InputWrapper>
                    </DivSeparator>

                    {/* ── Senha ──────────────────────────────────────────────────── */}

                    <SubTitle>Senha</SubTitle>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>Senha</Label></DivLabel>
                            <InputSing name="password" value={form.password} onChange={handleField} placeholder="Digite a senha" type="password" />
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Confirmar senha</Label></DivLabel>
                            <InputSing name="passwordConfirmation" value={form.passwordConfirmation} onChange={handleField} placeholder="Repita a senha" type="password" />
                        </InputWrapper>
                    </DivSeparator>

                    {/* ── Endereço de cobrança ───────────────────────────────────── */}

                    <SubTitle>Endereço de cobrança</SubTitle>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>CEP</Label></DivLabel>
                            <InputSing name="zipCode" value={billingAddress.zipCode} onChange={e => handleAddress(setBilling, setDelivery, e)} placeholder="00000-000" />
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Rua</Label></DivLabel>
                            <InputSing name="street" value={billingAddress.street} onChange={e => handleAddress(setBilling, setDelivery, e)} placeholder="Digite a rua" />
                        </InputWrapper>
                    </DivSeparator>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>Número</Label></DivLabel>
                            <InputSing name="number" value={billingAddress.number} onChange={e => handleAddress(setBilling, setDelivery, e)} placeholder="Nº" />
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Bairro</Label></DivLabel>
                            <InputSing name="neighborhood" value={billingAddress.neighborhood} onChange={e => handleAddress(setBilling, setDelivery, e)} placeholder="Digite o Bairro" />
                        </InputWrapper>
                    </DivSeparator>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>Estado</Label></DivLabel>
                            <InputSing name="state" value={billingAddress.state} onChange={e => handleAddress(setBilling, setDelivery, e)} placeholder="Ex: SP" />
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Cidade</Label></DivLabel>
                            <InputSing name="city" value={billingAddress.city} onChange={e => handleAddress(setBilling, setDelivery, e)} placeholder="Digite a cidade" />
                        </InputWrapper>
                    </DivSeparator>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>Tipo de Residência</Label></DivLabel>
                            <InputSelect name="residenceType" value={billingAddress.residenceType} onChange={e => handleAddress(setBilling, setDelivery, e)}>
                                {RESIDENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </InputSelect>
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Tipo Logradouro</Label></DivLabel>
                            <InputSelect name="streetType" value={billingAddress.streetType} onChange={e => handleAddress(setBilling, setDelivery, e)}>
                                {STREET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </InputSelect>
                        </InputWrapper>
                    </DivSeparator>

                    <InputWrapper style={{ height: "auto" }}>
                        <DivLabel><Label>Observações</Label></DivLabel>
                        <InputSing name="observations" value={billingAddress.observations} onChange={e => handleAddress(setBilling, setDelivery, e)} placeholder="Complemento, referência..." />
                    </InputWrapper>

                    {/* ── Toggle mesmo endereço ──────────────────────────────────── */}

                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#555", userSelect: "none" }}>
                        <input type="checkbox" checked={sameAddress} onChange={handleSameAddress} style={{ width: 16, height: 16, cursor: "pointer" }} />
                        Endereço de entrega igual ao de cobrança
                    </label>

                    {/* ── Endereço de entrega ────────────────────────────────────── */}

                    <SubTitle>Endereço de entrega</SubTitle>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>CEP</Label></DivLabel>
                            <InputSing name="zipCode" value={deliveryAddress.zipCode} onChange={e => handleAddress(setDelivery, null, e)} placeholder="00000-000" disabled={sameAddress} style={{ opacity: sameAddress ? 0.5 : 1 }} />
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Rua</Label></DivLabel>
                            <InputSing name="street" value={deliveryAddress.street} onChange={e => handleAddress(setDelivery, null, e)} placeholder="Digite a rua" disabled={sameAddress} style={{ opacity: sameAddress ? 0.5 : 1 }} />
                        </InputWrapper>
                    </DivSeparator>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>Número</Label></DivLabel>
                            <InputSing name="number" value={deliveryAddress.number} onChange={e => handleAddress(setDelivery, null, e)} placeholder="Nº" disabled={sameAddress} style={{ opacity: sameAddress ? 0.5 : 1 }} />
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Bairro</Label></DivLabel>
                            <InputSing name="neighborhood" value={deliveryAddress.neighborhood} onChange={e => handleAddress(setDelivery, null, e)} placeholder="Digite o Bairro" disabled={sameAddress} style={{ opacity: sameAddress ? 0.5 : 1 }} />
                        </InputWrapper>
                    </DivSeparator>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>Estado</Label></DivLabel>
                            <InputSing name="state" value={deliveryAddress.state} onChange={e => handleAddress(setDelivery, null, e)} placeholder="Ex: SP" disabled={sameAddress} style={{ opacity: sameAddress ? 0.5 : 1 }} />
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Cidade</Label></DivLabel>
                            <InputSing name="city" value={deliveryAddress.city} onChange={e => handleAddress(setDelivery, null, e)} placeholder="Digite a cidade" disabled={sameAddress} style={{ opacity: sameAddress ? 0.5 : 1 }} />
                        </InputWrapper>
                    </DivSeparator>

                    <DivSeparator>
                        <InputWrapper>
                            <DivLabel><Label>Tipo de Residência</Label></DivLabel>
                            <InputSelect name="residenceType" value={deliveryAddress.residenceType} onChange={e => handleAddress(setDelivery, null, e)} disabled={sameAddress} style={{ opacity: sameAddress ? 0.5 : 1 }}>
                                {RESIDENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </InputSelect>
                        </InputWrapper>
                        <InputWrapper>
                            <DivLabel><Label>Tipo Logradouro</Label></DivLabel>
                            <InputSelect name="streetType" value={deliveryAddress.streetType} onChange={e => handleAddress(setDelivery, null, e)} disabled={sameAddress} style={{ opacity: sameAddress ? 0.5 : 1 }}>
                                {STREET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </InputSelect>
                        </InputWrapper>
                    </DivSeparator>

                    <InputWrapper style={{ height: "auto" }}>
                        <DivLabel><Label>Observações</Label></DivLabel>
                        <InputSing name="observations" value={deliveryAddress.observations} onChange={e => handleAddress(setDelivery, null, e)} placeholder="Complemento, referência..." disabled={sameAddress} style={{ opacity: sameAddress ? 0.5 : 1 }} />
                    </InputWrapper>

                    {/* ── Cartões de crédito ─────────────────────────────────────── */}

                    <SubTitle>Cartões de Crédito</SubTitle>

                    <CardsContainer>
                        {cards.map((card, idx) => (
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
                                        {cards.length > 1 && (
                                            <RemoveButton onClick={() => removeCard(idx)}>
                                                Remover
                                            </RemoveButton>
                                        )}
                                    </div>
                                </CardHeader>

                                <DivSeparator>
                                    <InputWrapper>
                                        <DivLabel><Label>Bandeira</Label></DivLabel>
                                        <InputSelect name="cardBrandName" value={card.cardBrandName} onChange={e => changeCard(idx, e)}>
                                            {BRAND_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </InputSelect>
                                    </InputWrapper>
                                    <InputWrapper>
                                        <DivLabel><Label>Número do Cartão</Label></DivLabel>
                                        <InputSing name="cardNumber" value={card.cardNumber} onChange={e => changeCard(idx, e)} placeholder="0000 0000 0000 0000" />
                                    </InputWrapper>
                                </DivSeparator>

                                <DivSeparator>
                                    <InputWrapper>
                                        <DivLabel><Label>Nome impresso no Cartão</Label></DivLabel>
                                        <InputSing name="printedName" value={card.printedName} onChange={e => changeCard(idx, e)} placeholder="Como está no cartão" style={{ textTransform: "uppercase" }} />
                                    </InputWrapper>
                                    <InputWrapper>
                                        <DivLabel><Label>Código de Segurança</Label></DivLabel>
                                        <InputSing name="securityCode" value={card.securityCode} onChange={e => changeCard(idx, e)} type="password" placeholder="CVV" maxLength={4} />
                                    </InputWrapper>
                                </DivSeparator>

                                <InputWrapper>
                                    <DivLabel><Label>Validade (AAAA-MM)</Label></DivLabel>
                                    <InputSing name="expirationDate" value={card.expirationDate} onChange={e => changeCard(idx, e)} placeholder="2028-12" maxLength={7} style={{ maxWidth: 220 }} />
                                </InputWrapper>

                                {idx === preferredIdx && (
                                    <PreferredBadge>Este é o cartão preferencial para cobranças</PreferredBadge>
                                )}
                            </CardItem>
                        ))}

                        <AddCardButton onClick={addCard}>
                            + Adicionar outro cartão
                        </AddCardButton>
                    </CardsContainer>

                    <ButtonDiv>
                        <NextButton onClick={handleSalvar}>Salvar</NextButton>
                    </ButtonDiv>

                </BodyData>
            </DataContainer>
        </AppShell>
    );
}