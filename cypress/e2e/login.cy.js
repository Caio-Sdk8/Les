describe("Login - front", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
  });

  it("exibe erro quando tenta entrar sem preencher e-mail e senha", () => {
    cy.visit("/");

    cy.contains("button", "Entrar").click();

    cy.contains("Preencha e-mail e senha.").should("be.visible");
  });

  it("faz login como admin e redireciona para a listagem de clientes", () => {
    cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
      statusCode: 200,
      body: [],
    }).as("afterSales");

    cy.intercept("POST", "**/api/auth/login", (req) => {
      expect(req.body).to.deep.equal({
        email: "admin@pharmapro.com",
        password: "Senha123!",
      });

      req.reply({
        statusCode: 200,
        body: {
          token: "fake-jwt-token",
          expiresAt: "2030-01-01T00:00:00Z",
          user: {
            uuid: "admin-1",
            email: "admin@pharmapro.com",
            roles: ["Admin"],
          },
        },
      });
    }).as("loginRequest");

    cy.intercept("GET", "**/api/customers*", {
      statusCode: 200,
      body: {
        items: [
          {
            uuid: "cli-1",
            name: "João da Silva",
            email: "joao@cliente.com",
            customerCode: "CLI-001",
            isActive: true,
          },
        ],
        page: 1,
        totalCount: 1,
        totalPages: 1,
      },
    }).as("getCustomers");

    cy.visit("/");
    cy.get("#email").type("admin@pharmapro.com");
    cy.get("#password").type("Senha123!");
    cy.contains("button", "Entrar").click();

    cy.wait("@loginRequest");
    cy.wait("@getCustomers");

    cy.url().should("include", "/clientes");
    cy.contains("Listagem de Clientes").should("be.visible");
    cy.contains("joao@cliente.com").should("be.visible");
  });
});
