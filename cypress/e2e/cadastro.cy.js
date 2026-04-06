function preencherEndereco(prefix, endereco) {
  cy.get(`input[name="${prefix}.zipCode"]`)
    .should("be.visible")
    .type(endereco.zipCode);
  cy.get(`input[name="${prefix}.street"]`)
    .should("be.visible")
    .type(endereco.street);
  cy.get(`input[name="${prefix}.number"]`)
    .should("be.visible")
    .type(endereco.number);
  cy.get(`input[name="${prefix}.neighborhood"]`)
    .should("be.visible")
    .type(endereco.neighborhood);
  cy.get(`input[name="${prefix}.state"]`)
    .should("be.visible")
    .type(endereco.state);
  cy.get(`input[name="${prefix}.city"]`)
    .should("be.visible")
    .type(endereco.city);
  cy.get(`input[name="${prefix}.observations"]`)
    .should("be.visible")
    .type(endereco.observations);
}

describe("Cadastro de cliente - front", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
  });

  it("mostra as validações obrigatórias ao tentar salvar vazio", () => {
    cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
      statusCode: 200,
      body: [],
    }).as("afterSales");

    cy.visit("/cadastro");

    cy.url().should("include", "/cadastro");
    cy.contains("button", "Salvar").click();

    cy.contains("Nome é obrigatório").should("be.visible");
    cy.contains("E-mail é obrigatório").should("be.visible");
    cy.contains("CPF é obrigatório").should("be.visible");
    cy.contains("Senha é obrigatória").should("be.visible");
  });

  it("envia o cadastro com sucesso usando o mesmo endereço para entrega e cobrança", () => {
    cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
      statusCode: 200,
      body: [],
    }).as("afterSales");

    cy.intercept("POST", "**/api/customers/register", (req) => {
      expect(req.body.Name).to.equal("João da Silva");
      expect(req.body.Email).to.equal("joao@cliente.com");
      expect(req.body.BillingAddresses[0].zipCode).to.equal("08750000");
      expect(req.body.DeliveryAddresses[0].zipCode).to.equal("08750000");
      expect(req.body.CreditCards).to.have.length(1);
      expect(req.body.CreditCards[0]).to.include({
        CardBrandName: "Visa",
        CardNumber: "4111111111111111",
        PrintedName: "JOAO DA SILVA",
        SecurityCode: "123",
        ExpirationDate: "2028-12-01",
        IsPreferred: true,
      });

      req.reply({
        statusCode: 200,
        body: { dataClient: { uuid: "new-client-1" } },
      });
    }).as("registerCustomer");

    cy.intercept("GET", "**/api/customers*", {
      statusCode: 200,
      body: { items: [], page: 1, totalCount: 0, totalPages: 1 },
    }).as("getCustomers");

    cy.visit("/cadastro", {
      onBeforeLoad(win) {
        win.localStorage.setItem("pharma_token", "fake-admin-token");
        win.localStorage.setItem(
          "pharma_user",
          JSON.stringify({
            uuid: "admin-1",
            email: "admin@pharmapro.com",
            roles: ["Admin"],
          }),
        );
      },
    });

    cy.url().should("include", "/cadastro");

    cy.get('select[name="gender"]').select("Masculino");
    cy.wait(300);

    cy.get('input[name="name"]').should("be.visible").type("João da Silva");
    cy.get('input[name="birthDate"]').should("be.visible").type("1990-05-10");
    cy.get('input[name="cpf"]').should("be.visible").type("12345678901");
    cy.get('input[name="email"]').should("be.visible").type("joao@cliente.com");
    cy.get('input[name="phoneNumber"]')
      .should("be.visible")
      .type("11999999999");
    cy.get('input[name="areaCode"]').should("be.visible").type("11");
    cy.get('select[name="phoneType"]').select("Celular");
    cy.get('input[name="password"]').should("be.visible").type("Senha123!");
    cy.get('input[name="passwordConfirmation"]')
      .should("be.visible")
      .type("Senha123!");

    preencherEndereco("billingAddresses.0", {
      zipCode: "08750000",
      street: "Rua das Flores",
      number: "123",
      neighborhood: "Centro",
      state: "SP",
      city: "Mogi das Cruzes",
      observations: "Casa azul",
    });

    cy.contains("label", "Endereço de entrega igual ao de cobrança")
      .find('input[type="checkbox"]')
      .check();

    cy.get('input[name="deliveryAddresses.0.zipCode"]').should("be.disabled");

    cy.get('input[placeholder="0000 0000 0000 0000"]')
      .should("be.visible")
      .type("4111111111111111");
    cy.get('input[placeholder="Como está no cartão"]')
      .should("be.visible")
      .type("JOAO DA SILVA");
    cy.get('input[placeholder="CVV"]').should("be.visible").type("123");
    cy.get('input[placeholder="2028-12"]').should("be.visible").type("2028-12");

    cy.contains("button", "Salvar").click();

    cy.wait("@registerCustomer");
    cy.wait("@getCustomers");

    cy.url().should("include", "/clientes");
    cy.contains("Listagem de Clientes").should("be.visible");
  });
});
