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

const endereco = {
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

function seedAdminSession(win) {
  win.localStorage.setItem("pharma_token", adminSession.token);
  win.localStorage.setItem("pharma_user", JSON.stringify(adminSession.user));
}

function pagedResult(items) {
  return { items, page: 1, totalCount: items.length, totalPages: 1 };
}

function openEditAddressPage({ currentAddresses }) {
  cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
    statusCode: 200,
    body: [],
  }).as("afterSales");

  cy.intercept("GET", "**/api/customers*", (req) => {
    if (!req.url.match(/\/api\/customers\/[^/]+/)) {
      req.reply({ statusCode: 200, body: pagedResult([{ ...baseCustomer }]) });
    } else {
      req.continue();
    }
  }).as("getCustomers");

  cy.intercept("GET", `**/api/customers/${baseCustomer.uuid}`, {
    statusCode: 200,
    body: customerDetails,
  }).as("getCustomerDetails");

  cy.intercept(
    "GET",
    `**/api/customers/${baseCustomer.uuid}/addresses`,
    (req) => {
      req.reply({ statusCode: 200, body: currentAddresses });
    },
  ).as("getAddresses");

  cy.intercept("GET", `**/api/customers/${baseCustomer.uuid}/credit-cards`, {
    statusCode: 200,
    body: [],
  }).as("getCards");

  cy.visit("/clientes", {
    onBeforeLoad(win) {
      seedAdminSession(win);
    },
  });

  cy.wait("@getCustomers");

  cy.get('img[alt="Editar"]').first().click();
  cy.wait("@getCustomerDetails");
  cy.wait("@getAddresses");
  cy.url().should("include", "/editarUsuario");

  cy.get('img[alt="Editar"]').first().click();
  cy.url().should("include", "/editarEndereco");
}

describe("Edição de endereço - front", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
  });

  it("carrega os dados do endereço preenchidos no formulário", () => {
    openEditAddressPage({ currentAddresses: [{ ...endereco }] });

    cy.get('input[placeholder="00000-000"]').should("have.value", "08750000");
    cy.get('input[placeholder="Digite a rua"]').should(
      "have.value",
      "Rua Central",
    );
    cy.get('input[placeholder="Nº"]').should("have.value", "100");
    cy.get('input[placeholder="Digite o Bairro"]').should(
      "have.value",
      "Centro",
    );
    cy.get('input[placeholder="Digite a cidade"]').should(
      "have.value",
      "Mogi das Cruzes",
    );
    cy.get('input[placeholder="Digite o estado"]').should("have.value", "SP");
    cy.get('input[placeholder="Digite o País"]').should("have.value", "Brasil");
    cy.get('input[placeholder="Complemento, referência..."]').should(
      "have.value",
      "Portão branco",
    );
  });

  it("edita o endereço e salva com sucesso", () => {
    const currentAddresses = [{ ...endereco }];

    cy.intercept(
      "PUT",
      `**/api/customers/${baseCustomer.uuid}/addresses/${endereco.uuid}`,
      (req) => {
        expect(req.body).to.deep.equal({
          AddressType: 1,
          Label: "Casa",
          ResidenceType: 2,
          StreetType: "Avenida",
          Street: "Avenida Brasil",
          Number: "500",
          Neighborhood: "Jardim",
          ZipCode: "01310100",
          City: "São Paulo",
          State: "SP",
          Country: "Brasil",
          Observations: null,
        });

        req.reply({ statusCode: 200, body: { success: true } });
      },
    ).as("updateAddress");

    openEditAddressPage({ currentAddresses });

    cy.get('select[name="residenceType"]').select("Apartamento");
    cy.get('select[name="streetType"]').select("Avenida");
    cy.get('input[placeholder="00000-000"]').clear().type("01310100");
    cy.get('input[placeholder="Digite a rua"]').clear().type("Avenida Brasil");
    cy.get('input[placeholder="Nº"]').clear().type("500");
    cy.get('input[placeholder="Digite o Bairro"]').clear().type("Jardim");
    cy.get('input[placeholder="Digite a cidade"]').clear().type("São Paulo");
    cy.get('input[placeholder="Digite o estado"]').clear().type("SP");
    cy.get('input[placeholder="Digite o País"]').clear().type("Brasil");
    cy.get('input[placeholder="Complemento, referência..."]').clear();

    cy.contains("button", "Salvar").scrollIntoView().click({ force: true });

    cy.wait("@updateAddress");

    cy.url().should("include", "/editarUsuario");
  });
});
