const customerSession = {
  token: "fake-customer-token",
  user: {
    uuid: "customer-1",
    email: "cliente@pharmapro.com",
    roles: ["Customer"],
  },
};

function seedCustomerSession(win) {
  win.localStorage.setItem("pharma_token", customerSession.token);
  win.localStorage.setItem("pharma_user", JSON.stringify(customerSession.user));
}

describe("Assistente de IA flutuante", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
  });

  it("abre o modal de IA a partir da bolinha e permite digitar uma pergunta", () => {
    cy.visit("/loja", {
      onBeforeLoad(win) {
        seedCustomerSession(win);
      },
    });

    cy.get('[data-cy="ia-widget-button"]').should("be.visible").click();
    cy.contains("💊 Assistente da Farmácia").should("be.visible");
    cy.get('[data-cy="ia-chat-input"]')
      .should("be.visible")
      .type("Quais vitaminas ajudam na imunidade?", { delay: 50 });
    cy.get('[data-cy="ia-chat-input"]').should(
      "have.value",
      "Quais vitaminas ajudam na imunidade?",
    );
  });
});
