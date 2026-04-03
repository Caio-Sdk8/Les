const adminSession = {
  token: "fake-admin-token",
  user: {
    uuid: "admin-1",
    email: "admin@pharmapro.com",
    roles: ["Admin"],
  },
};

const baseCustomer = {
  uuid: "cli-1",
  name: "João da Silva",
  email: "joao@cliente.com",
  customerCode: "CLI-001",
  isActive: true,
};

const customerDetails = {
  uuid: "cli-1",
  customerCode: "CLI-001",
  name: "João da Silva",
  gender: 1,
  birthDate: "1990-05-10T00:00:00Z",
  cpf: "12345678901",
  email: "joao@cliente.com",
  isActive: true,
  ranking: 5,
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-01T10:00:00Z",
  phones: [
    {
      uuid: "phone-1",
      phoneType: 1,
      areaCode: "11",
      number: "999999999",
      isMain: true,
    },
  ],
};

const initialAddresses = [
  {
    uuid: "addr-1",
    addressType: 1,
    label: "Casa",
    residenceType: 1,
    streetType: "Rua",
    street: "Rua Central",
    number: "100",
    neighborhood: "Centro",
    zipCode: "08750000",
    city: "Mogi das Cruzes",
    state: "SP",
    country: "Brasil",
    observations: "Portão branco",
    isActive: true,
  },
];

const initialCards = [
  {
    uuid: "card-1",
    cardBrandName: "Visa",
    maskedCardNumber: "**** **** **** 1111",
    printedName: "João da Silva",
    expirationDate: "2028-12-01T00:00:00Z",
    isPreferred: true,
    isActive: true,
  },
  {
    uuid: "card-2",
    cardBrandName: "Mastercard",
    maskedCardNumber: "**** **** **** 2222",
    printedName: "Maria Souza",
    expirationDate: "2029-08-01T00:00:00Z",
    isPreferred: false,
    isActive: true,
  },
];

const cardBrands = [
  { uuid: "brand-visa", name: "Visa" },
  { uuid: "brand-master", name: "Mastercard" },
];

function seedAdminSession(win) {
  win.localStorage.setItem("pharma_token", adminSession.token);
  win.localStorage.setItem("pharma_user", JSON.stringify(adminSession.user));
}

function pagedResult(items) {
  return {
    items,
    page: 1,
    totalCount: items.length,
    totalPages: 1,
  };
}

function openEditPage({ currentCustomers, currentAddresses, currentCards }) {
  cy.intercept("GET", "**/api/customers", (req) => {
    req.reply({
      statusCode: 200,
      body: pagedResult(currentCustomers),
    });
  }).as("getCustomers");

  cy.intercept("GET", `**/api/customers/${customerDetails.uuid}`, {
    statusCode: 200,
    body: customerDetails,
  }).as("getCustomerDetails");

  cy.intercept(
    "GET",
    `**/api/customers/${customerDetails.uuid}/addresses`,
    (req) => {
      req.reply({
        statusCode: 200,
        body: currentAddresses,
      });
    },
  ).as("getAddresses");

  cy.intercept(
    "GET",
    `**/api/customers/${customerDetails.uuid}/credit-cards`,
    (req) => {
      req.reply({
        statusCode: 200,
        body: currentCards,
      });
    },
  ).as("getCards");

  cy.intercept("GET", "**/api/card-brands", {
    statusCode: 200,
    body: cardBrands,
  }).as("getCardBrands");

  cy.visit("/clientes", {
    onBeforeLoad(win) {
      seedAdminSession(win);
    },
  });

  cy.wait("@getCustomers");
  cy.get('img[alt="Editar"]').first().click();
  cy.wait("@getCustomerDetails");
  cy.wait("@getAddresses");
  cy.wait("@getCards");
  cy.url().should("include", "/editarUsuario");
}

describe("Edição de cliente - front", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
  });

  it("edita os dados principais do cliente", () => {
    let currentCustomers = [{ ...baseCustomer }];
    const currentAddresses = [...initialAddresses];
    const currentCards = [...initialCards];

    cy.intercept("PUT", `**/api/customers/${customerDetails.uuid}`, (req) => {
      expect(req.body).to.deep.equal({
        Name: "Joana da Silva",
        Gender: 2,
        BirthDate: "1988-10-22",
        Email: "joana@cliente.com",
        Phones: [
          {
            PhoneType: 2,
            AreaCode: "21",
            Number: "33334444",
            IsMain: true,
          },
        ],
      });

      currentCustomers[0] = {
        ...baseCustomer,
        name: "Joana da Silva",
        email: "joana@cliente.com",
      };

      req.reply({
        statusCode: 200,
        body: { success: true },
      });
    }).as("updateCustomer");

    openEditPage({ currentCustomers, currentAddresses, currentCards });

    cy.get('select[name="gender"]').select("Feminino");
    cy.get('input[name="name"]').clear().type("Joana da Silva");
    cy.get('input[name="birthDate"]').clear().type("1988-10-22");
    cy.get('input[name="email"]').clear().type("joana@cliente.com");
    cy.get('input[name="areaCode"]').clear().type("21");
    cy.get('select[name="phoneType"]').select("Residencial");
    cy.get('input[name="phoneNumber"]').clear().type("33334444");

    cy.contains("button", "Salvar").scrollIntoView().click({ force: true });

    cy.wait("@updateCustomer");
    cy.wait("@getCustomers");
    cy.url().should("include", "/clientes");
    cy.contains("Joana da Silva").should("be.visible");
    cy.contains("joana@cliente.com").should("be.visible");
  });

  it("altera a senha do cliente", () => {
    const currentCustomers = [{ ...baseCustomer }];
    const currentAddresses = [...initialAddresses];
    const currentCards = [...initialCards];

    cy.intercept(
      "PATCH",
      `**/api/customers/${customerDetails.uuid}/password`,
      (req) => {
        expect(req.body).to.deep.equal({
          currentPassword: "SenhaAtual1!",
          newPassword: "NovaSenha1!",
          newPasswordConfirmation: "NovaSenha1!",
        });

        req.reply({
          statusCode: 200,
          body: { success: true },
        });
      },
    ).as("changePassword");

    openEditPage({ currentCustomers, currentAddresses, currentCards });

    cy.on("window:alert", (message) => {
      expect(message).to.equal("Senha alterada com sucesso!");
    });

    cy.contains("button", "Alterar Senha")
      .scrollIntoView()
      .click({ force: true });
    cy.get('input[placeholder="Digite a senha atual"]').type("SenhaAtual1!");
    cy.get('input[placeholder="Digite a nova senha"]').type("NovaSenha1!");
    cy.get('input[placeholder="Digite a nova senha novamente"]').type(
      "NovaSenha1!",
    );
    cy.contains("button", /^Alterar$/).click({ force: true });

    cy.wait("@changePassword");
    cy.get('input[placeholder="Digite a senha atual"]').should("not.exist");
  });

  it("cadastra um novo endereço para o cliente", () => {
    const currentCustomers = [{ ...baseCustomer }];
    let currentAddresses = [...initialAddresses];
    const currentCards = [...initialCards];

    cy.intercept(
      "POST",
      `**/api/customers/${customerDetails.uuid}/addresses`,
      (req) => {
        expect(req.body).to.include({
          addressType: 2,
          label: "Trabalho",
          residenceType: 2,
          streetType: "Avenida",
          street: "Avenida Paulista",
          number: "1500",
          neighborhood: "Bela Vista",
          zipCode: "01310100",
          city: "São Paulo",
          state: "SP",
          country: "Brasil",
          observations: "Sala 12",
        });

        currentAddresses.push({
          uuid: "addr-2",
          ...req.body,
          isActive: true,
        });

        req.reply({
          statusCode: 201,
          body: { uuid: "addr-2" },
        });
      },
    ).as("addAddress");

    openEditPage({ currentCustomers, currentAddresses, currentCards });

    cy.contains("button", "Cadastrar Endereço")
      .scrollIntoView()
      .click({ force: true });
    cy.get('select[name="addressType"]').select("Entrega");
    cy.get('select[name="residenceType"]').select("Apartamento");
    cy.get('select[name="streetType"]').select("Avenida");
    cy.get('input[placeholder="Digite o apelido do endereço"]').type(
      "Trabalho",
    );
    cy.get('input[placeholder="Digite a rua"]').type("Avenida Paulista");
    cy.get('input[placeholder="Nº"]').type("1500");
    cy.get('input[placeholder="Digite o bairro"]').type("Bela Vista");
    cy.get('input[placeholder="00000-000"]').type("01310100");
    cy.get('input[placeholder="Digite a cidade"]').type("São Paulo");
    cy.get('input[placeholder="Ex: SP"]').type("SP");
    cy.get('input[placeholder="Brasil"]').clear().type("Brasil");
    cy.get('input[placeholder="Complemento, referência..."]').type("Sala 12");

    cy.contains("button", /^Cadastrar$/).click({ force: true });

    cy.wait("@addAddress");
    cy.get('input[placeholder="Digite o apelido do endereço"]').should(
      "not.exist",
    );
  });

  it("cadastra um novo cartão para o cliente", () => {
    const currentCustomers = [{ ...baseCustomer }];
    const currentAddresses = [...initialAddresses];
    let currentCards = [...initialCards];

    cy.intercept(
      "POST",
      `**/api/customers/${customerDetails.uuid}/credit-cards`,
      (req) => {
        expect(req.body).to.deep.equal({
          CardBrandUuid: "brand-master",
          CardNumber: "5555444433331111",
          PrintedName: "Carlos Souza",
          SecurityCode: "321",
          ExpirationDate: "2030-06-01",
          IsPreferred: true,
        });

        currentCards.forEach((card) => {
          card.isPreferred = false;
        });

        currentCards.push({
          uuid: "card-3",
          cardBrandName: "Mastercard",
          maskedCardNumber: "**** **** **** 1111",
          printedName: "Carlos Souza",
          expirationDate: "2030-06-01T00:00:00Z",
          isPreferred: true,
          isActive: true,
        });

        req.reply({
          statusCode: 201,
          body: { uuid: "card-3" },
        });
      },
    ).as("addCard");

    openEditPage({ currentCustomers, currentAddresses, currentCards });

    cy.contains("button", "Cadastrar Cartão")
      .scrollIntoView()
      .click({ force: true });
    cy.wait("@getCardBrands");

    cy.get('input[placeholder="Digite o nome do titular"]').type(
      "Carlos Souza",
    );
    cy.get('input[placeholder="Digite o número do cartão"]').type(
      "5555444433331111",
    );
    cy.get('select[name="cardBrandUuid"]').select("Mastercard");
    cy.get('input[placeholder="Digite o código de segurança"]').type("321");
    cy.get('input[name="expirationDate"]').type("2030-06-01");

    cy.contains("button", /^Cadastrar$/).click({ force: true });

    cy.wait("@addCard");
    cy.wait("@getCards");
    cy.contains("Carlos Souza").should("be.visible");
  });

  it("muda a preferência do cartão do cliente", () => {
    const currentCustomers = [{ ...baseCustomer }];
    const currentAddresses = [...initialAddresses];
    let currentCards = [...initialCards];

    cy.intercept(
      "PATCH",
      `**/api/customers/${customerDetails.uuid}/credit-cards/*/set-preferred`,
      (req) => {
        currentCards.forEach((card) => {
          card.isPreferred = req.url.includes("card-2")
            ? card.uuid === "card-2"
            : card.uuid === "card-1";
        });

        req.reply({
          statusCode: 200,
          body: { success: true },
        });
      },
    ).as("setPreferredCard");

    openEditPage({ currentCustomers, currentAddresses, currentCards });

    cy.contains("p", "Maria Souza")
      .closest("tr")
      .within(() => {
        cy.contains("button", "Não preferencial").click();
      });

    cy.wait("@setPreferredCard");
    cy.wait("@getCards");

    cy.contains("p", "Maria Souza")
      .closest("tr")
      .within(() => {
        cy.contains("Preferencial").should("be.visible");
      });
  });
});
