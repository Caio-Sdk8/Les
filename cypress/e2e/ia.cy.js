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

describe("Tela de recomendação com IA - front", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
  });

  it("abre a tela e permite digitar uma pergunta", () => {
    cy.visit("/IA", {
      onBeforeLoad(win) {
        seedCustomerSession(win);
      },
    });

    cy.contains("Assistente IA").should("be.visible");
    cy.get('input[placeholder="Digite sua pergunta..."]')
      .type("Quais vitaminas ajudam na imunidade?")
      .should("have.value", "Quais vitaminas ajudam na imunidade?");
  });
});
