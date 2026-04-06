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

describe("Listagem de clientes - front", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);

    cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
      statusCode: 200,
      body: [],
    }).as("afterSales");
  });

  it("exibe a listagem dos clientes integrados no front", () => {
    const currentCustomers = [{ ...baseCustomer }];

    cy.intercept("GET", "**/api/customers*", {
      statusCode: 200,
      body: pagedResult(currentCustomers),
    }).as("getCustomers");

    cy.visit("/clientes", {
      onBeforeLoad(win) {
        seedAdminSession(win);
      },
    });

    cy.wait("@getCustomers");

    cy.contains("Listagem de Clientes").should("be.visible");
    cy.contains("João da Silva").should("be.visible");
    cy.contains("joao@cliente.com").should("be.visible");
    cy.contains("CLI-001").should("be.visible");
    cy.get('img[alt="Editar"]').should("have.length", 1);
    cy.get('img[alt="Pedidos"]').should("have.length", 1);
  });

  it("permite desativar e reativar um cliente pela listagem", () => {
    let isActive = true;

    cy.intercept("GET", "**/api/customers*", (req) => {
      req.reply({
        statusCode: 200,
        body: pagedResult([{ ...baseCustomer, isActive }]),
      });
    }).as("getCustomers");

    cy.intercept("PATCH", "**/api/customers/*/toggle-active", (req) => {
      isActive = !isActive;
      req.reply({ statusCode: 200, body: { success: true } });
    }).as("toggleCustomer");

    cy.visit("/clientes", {
      onBeforeLoad(win) {
        seedAdminSession(win);
      },
    });

    cy.wait("@getCustomers");

    cy.contains("p", "João da Silva")
      .closest("tr")
      .within(() => {
        cy.get('input[type="checkbox"]').should("be.checked");
        cy.get('input[type="checkbox"]').parent().click({ force: true });
      });

    cy.contains("Tem certeza que deseja desativar o cliente?").should(
      "be.visible",
    );
    cy.contains("button", "Sim").click();

    cy.wait("@toggleCustomer");
    cy.wait("@getCustomers");

    cy.contains("p", "João da Silva")
      .closest("tr")
      .within(() => {
        cy.get('input[type="checkbox"]').should("not.be.checked");
        cy.get('input[type="checkbox"]').parent().click({ force: true });
      });

    cy.contains("Tem certeza que deseja ativar o cliente?").should(
      "be.visible",
    );
    cy.contains("button", "Sim").click();

    cy.wait("@toggleCustomer");
    cy.wait("@getCustomers");

    cy.contains("p", "João da Silva")
      .closest("tr")
      .find('input[type="checkbox"]')
      .should("be.checked");
  });
});
