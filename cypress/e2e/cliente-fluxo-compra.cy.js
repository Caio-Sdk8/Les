const customerSession = {
  token: "fake-customer-token",
  user: {
    uuid: "customer-1",
    email: "cliente@pharmapro.com",
    roles: ["Customer"],
  },
};

const categories = [
  { uuid: "cat-analgesicos", name: "Dor e Febre", isActive: true },
  { uuid: "cat-vitaminas", name: "Vitaminas", isActive: true },
  { uuid: "cat-antibioticos", name: "Antibióticos", isActive: true },
];

const products = {
  dipirona: {
    uuid: "prod-1",
    productCode: "MED-001",
    name: "Dipirona 500mg",
    activePrinciple: "Dipirona monoidratada",
    imageUrl: "https://example.com/dipirona.png",
    salePrice: 12.5,
    prescriptionType: 0,
    isActive: true,
    categories: ["Dor e Febre"],
    availableStock: 15,
    barcode: "7891234567890",
    description: "Analgésico e antitérmico para dores leves e febre.",
    pricingGroupName: "Medicamentos essenciais",
    blockedStock: 0,
    heightCm: 12,
    widthCm: 5,
    depthCm: 3,
    weightGrams: 120,
  },
  vitamina: {
    uuid: "prod-2",
    productCode: "MED-002",
    name: "Vitamina C 1g",
    activePrinciple: "Ácido ascórbico",
    imageUrl: "https://example.com/vitamina-c.png",
    salePrice: 18.9,
    prescriptionType: 0,
    isActive: true,
    categories: ["Vitaminas"],
    availableStock: 22,
    barcode: "7891234567891",
    description: "Suplemento alimentar com vitamina C.",
    pricingGroupName: "Vitaminas",
    blockedStock: 0,
    heightCm: 10,
    widthCm: 5,
    depthCm: 4,
    weightGrams: 90,
  },
  amoxicilina: {
    uuid: "prod-3",
    productCode: "MED-003",
    name: "Amoxicilina 500mg",
    activePrinciple: "Amoxicilina",
    imageUrl: "https://example.com/amoxicilina.png",
    salePrice: 32.4,
    prescriptionType: 2,
    isActive: true,
    categories: ["Antibióticos"],
    availableStock: 8,
    barcode: "7891234567892",
    description: "Antibiótico de uso adulto com retenção de receita.",
    pricingGroupName: "Antibióticos",
    blockedStock: 1,
    heightCm: 11,
    widthCm: 5,
    depthCm: 3,
    weightGrams: 110,
  },
};

const productList = Object.values(products).map(
  ({
    description,
    barcode,
    pricingGroupName,
    blockedStock,
    heightCm,
    widthCm,
    depthCm,
    weightGrams,
    ...summary
  }) => summary,
);

const checkoutAddresses = [
  {
    uuid: "addr-1",
    label: "Casa",
    street: "Rua das Flores",
    number: "100",
    city: "Mogi das Cruzes",
    state: "SP",
    zipCode: "08750000",
    isActive: true,
  },
];

const checkoutCards = [
  {
    uuid: "card-1",
    cardBrandName: "visa",
    maskedCardNumber: "**** 1111",
    isPreferred: true,
    isActive: true,
  },
  {
    uuid: "card-2",
    cardBrandName: "mastercard",
    maskedCardNumber: "**** 2222",
    isPreferred: false,
    isActive: true,
  },
];

function pagedResult(items) {
  return {
    items,
    totalCount: items.length,
    page: 1,
    pageSize: items.length || 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
}

function seedCustomerSession(win, cartItems = []) {
  win.localStorage.setItem("pharma_token", customerSession.token);
  win.localStorage.setItem("pharma_user", JSON.stringify(customerSession.user));
  win.localStorage.setItem("pharma_cart", JSON.stringify(cartItems));
}

function mockStoreApis() {
  cy.intercept("GET", "**/api/products*", (req) => {
    const search = String(req.query.search || "").toLowerCase();
    const filtered = productList.filter((item) => {
      if (!search) return true;
      return (
        item.name.toLowerCase().includes(search) ||
        (item.activePrinciple || "").toLowerCase().includes(search) ||
        item.categories.some((category) =>
          category.toLowerCase().includes(search),
        )
      );
    });

    req.reply({ statusCode: 200, body: pagedResult(filtered) });
  }).as("getProducts");

  cy.intercept("GET", "**/api/categories", {
    statusCode: 200,
    body: categories,
  }).as("getCategories");
}

function mockProductDetailApis() {
  cy.intercept("GET", "**/api/products/*/substitutes", (req) => {
    if (req.url.includes(products.dipirona.uuid)) {
      req.reply({ statusCode: 200, body: [productList[0], productList[1]] });
      return;
    }

    req.reply({ statusCode: 200, body: [productList[0]] });
  }).as("getSubstitutes");

  cy.intercept("GET", "**/api/products/*", (req) => {
    const uuid = req.url.split("/api/products/")[1]?.split("?")[0];
    const detail = Object.values(products).find((item) => item.uuid === uuid);

    if (!detail) {
      req.reply({
        statusCode: 404,
        body: { message: "Produto não encontrado" },
      });
      return;
    }

    req.reply({ statusCode: 200, body: detail });
  }).as("getProductDetail");
}

function mockCartApis(interactions = []) {
  cy.intercept("GET", "**/api/customers/me/addresses", {
    statusCode: 200,
    body: checkoutAddresses,
  }).as("getCheckoutAddresses");

  cy.intercept("GET", "**/api/customers/me/credit-cards", {
    statusCode: 200,
    body: checkoutCards,
  }).as("getCheckoutCards");

  cy.intercept("POST", "**/api/products/drug-interactions", (req) => {
    expect(req.body).to.be.an("array");
    req.reply({ statusCode: 200, body: interactions });
  }).as("checkDrugInteractions");
}

describe("Fluxo de compra do cliente - front", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
  });

  it("lista produtos, filtra o catálogo e adiciona item ao carrinho pela loja", () => {
    mockStoreApis();

    cy.visit("/loja", {
      onBeforeLoad(win) {
        seedCustomerSession(win);
      },
    });

    cy.wait("@getProducts");
    cy.wait("@getCategories");

    cy.contains("Farmácia online com ofertas todos os dias").should(
      "be.visible",
    );
    cy.contains("button", "Vitaminas").click();
    cy.contains("Vitamina C 1g").should("be.visible");
    cy.contains("Dipirona 500mg").should("not.exist");

    cy.get('input[placeholder="Buscar produto, categoria ou marca"]')
      .clear()
      .type("dipirona");
    cy.contains("button", "Todos").click();
    cy.contains("Dipirona 500mg").should("be.visible");

    cy.get('img[alt="Adicionar"]').first().click();

    cy.window()
      .its("localStorage")
      .invoke("getItem", "pharma_cart")
      .then((raw) => {
        expect(JSON.parse(raw)).to.deep.equal([
          { productUuid: products.dipirona.uuid, quantity: 1 },
        ]);
      });
  });

  it("mostra detalhes do produto e navega entre substitutos", () => {
    mockStoreApis();
    mockProductDetailApis();

    cy.visit(`/produto/${products.dipirona.uuid}`, {
      onBeforeLoad(win) {
        seedCustomerSession(win);
      },
    });

    cy.wait("@getProductDetail");
    cy.wait("@getSubstitutes");

    cy.contains(products.dipirona.name).should("be.visible");
    cy.contains("Preço atual").should("be.visible");
    cy.contains(/R\$\s*12,50/).should("be.visible");
    cy.contains("Venda livre").should("be.visible");
    cy.contains("Substitutos e similares").should("be.visible");

    cy.contains("Vitamina C 1g").click();
    cy.url().should("include", `/produto/${products.vitamina.uuid}`);
    cy.wait("@getProductDetail");
    cy.contains(products.vitamina.name).should("be.visible");

    cy.contains("button", "Continuar comprando").click();
    cy.url().should("include", "/loja");
  });

  it("valida interações, exige receita para antibiótico e finaliza checkout com sucesso", () => {
    mockStoreApis();
    mockCartApis([
      {
        productAUuid: products.dipirona.uuid,
        productAName: products.dipirona.name,
        productBUuid: products.amoxicilina.uuid,
        productBName: products.amoxicilina.name,
        description:
          "Monitorar administração concomitante e avaliação clínica.",
        severityLevel: 2,
      },
    ]);

    cy.intercept("POST", "**/api/transactions/checkout", (req) => {
      expect(req.body.items).to.deep.equal([
        { productUuid: products.dipirona.uuid, quantity: 2 },
        { productUuid: products.amoxicilina.uuid, quantity: 1 },
      ]);
      expect(req.body.paymentType).to.equal("credito1");
      expect(req.body.addressUuid).to.equal("addr-1");
      expect(req.body.singleCardUuid).to.equal("card-1");
      expect(req.body.couponCode).to.equal("semana10");
      expect(req.body.prescriptionFileName).to.equal("receita.pdf");

      req.reply({
        statusCode: 200,
        body: {
          transactionUuid: "order-1",
          transactionCode: "PED-2026-0001",
          status: "EM_PROCESSAMENTO",
          subtotal: 57.4,
          shipping: 0,
          discount: 5.74,
          total: 51.66,
        },
      });
    }).as("checkoutRequest");

    cy.visit("/carrinho", {
      onBeforeLoad(win) {
        seedCustomerSession(win, [
          { productUuid: products.dipirona.uuid, quantity: 1 },
          { productUuid: products.amoxicilina.uuid, quantity: 1 },
        ]);
      },
    });

    cy.wait("@getProducts");
    cy.wait("@getCheckoutAddresses");
    cy.wait("@getCheckoutCards");
    cy.wait("@checkDrugInteractions");

    cy.contains("Dipirona 500mg").should("be.visible");
    cy.contains("Amoxicilina 500mg").should("be.visible");
    cy.contains("Monitorar administração concomitante").should("be.visible");
    cy.contains(
      "Anexe a receita para finalizar o pedido com medicamento sob prescrição.",
    ).should("be.visible");

    cy.get('img[alt="Aumentar"]').first().click();
    cy.contains(/R\$\s*57,40/).should("be.visible");

    cy.get("select").eq(0).select("Cartão de crédito (1 cartão)");
    cy.get("select").eq(1).select("Casa • 08750000");
    cy.get("select").eq(2).select("SEMANA10");
    cy.get("select").eq(3).select("VISA **** 1111");

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from("fake-pdf-content"),
      fileName: "receita.pdf",
      mimeType: "application/pdf",
      lastModified: Date.now(),
    });

    cy.contains("Arquivo selecionado: receita.pdf").should("be.visible");
    cy.contains("button", "Finalizar pedido").click();

    cy.wait("@checkoutRequest");
    cy.url().should("include", "/loja");
    cy.window()
      .its("localStorage")
      .invoke("getItem", "pharma_cart")
      .should("equal", null);
  });

  it("lista pedidos, abre detalhes, reenvia receita e solicita troca", () => {
    let currentDetail = {
      transactionUuid: "order-2",
      transactionCode: "PED-2026-0002",
      status: "AGUARDANDO_REENVIO_RECEITA",
      createdAt: "2026-04-10T14:30:00Z",
      description: "PED-2026-0002 - Pedido com antibiótico",
      paymentType: "credito1",
      addressLabel: "Casa - 08750000",
      couponCode: "sem",
      subtotal: 32.4,
      shipping: 8.9,
      discount: 0,
      total: 41.3,
      prescriptionFileName: "receita-antiga.pdf",
      prescriptionStatus: "REENVIO_SOLICITADO",
      prescriptionNote: "Arquivo ilegível.",
      items: [
        {
          productUuid: products.amoxicilina.uuid,
          productName: products.amoxicilina.name,
          categoryName: "Antibióticos",
          quantity: 1,
          unitPrice: 32.4,
          totalPrice: 32.4,
          prescriptionLabel: "Tarja vermelha",
        },
      ],
      afterSalesRequests: [],
    };

    cy.intercept("GET", "**/api/transactions/my*", {
      statusCode: 200,
      body: {
        items: [
          {
            id: 1,
            uuid: "order-2",
            customerId: 1,
            amount: 41.3,
            description: "PED-2026-0002 - Pedido com antibiótico",
            status: "AGUARDANDO_REENVIO_RECEITA",
            createdAt: "2026-04-10T14:30:00Z",
          },
        ],
        totalCount: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }).as("getMyOrders");

    cy.intercept("GET", "**/api/transactions/order-2", (req) => {
      req.reply({
        statusCode: 200,
        body: currentDetail,
      });
    }).as("getOrderDetail");

    cy.intercept(
      "PATCH",
      "**/api/transactions/order-2/prescription-resubmission",
      (req) => {
        expect(req.body.prescriptionFileName).to.equal("nova-receita.pdf");
        expect(req.body.note).to.equal("Arquivo legível reenviado.");

        currentDetail = {
          ...currentDetail,
          status: "AGUARDANDO_ANALISE_RECEITA",
          prescriptionFileName: "nova-receita.pdf",
          prescriptionStatus: "EM_ANALISE",
          prescriptionNote: "Arquivo legível reenviado.",
        };

        req.reply({ statusCode: 200, body: {} });
      },
    ).as("resubmitPrescription");

    cy.intercept(
      "POST",
      "**/api/transactions/order-2/after-sales-requests",
      (req) => {
        expect(req.body).to.deep.equal({
          type: "TROCA",
          reason: "Produto com avaria na embalagem externa.",
          items: [{ productUuid: products.amoxicilina.uuid, quantity: 1 }],
        });

        currentDetail = {
          ...currentDetail,
          afterSalesRequests: [
            {
              requestUuid: "req-1",
              transactionUuid: "order-2",
              transactionCode: "PED-2026-0002",
              type: "TROCA",
              status: "PENDENTE",
              reason: "Produto com avaria na embalagem externa.",
              reviewNote: null,
              requestedAt: "2026-04-13T12:00:00Z",
              reviewedAt: null,
              reviewedBy: null,
              items: [
                {
                  productUuid: products.amoxicilina.uuid,
                  productName: products.amoxicilina.name,
                  quantity: 1,
                },
              ],
            },
          ],
        };

        req.reply({
          statusCode: 200,
          body: currentDetail.afterSalesRequests[0],
        });
      },
    ).as("createAfterSales");

    cy.visit("/pedidos", {
      onBeforeLoad(win) {
        seedCustomerSession(win);
      },
    });

    cy.wait("@getMyOrders");
    cy.contains("PED-2026-0002").should("be.visible");
    cy.contains("button", "Ver").click();

    cy.wait("@getOrderDetail");
    cy.contains("Status da receita: REENVIO_SOLICITADO").should("be.visible");
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from("updated-pdf"),
      fileName: "nova-receita.pdf",
      mimeType: "application/pdf",
      lastModified: Date.now(),
    });
    cy.contains("Arquivo selecionado: nova-receita.pdf").should("be.visible");
    cy.get("textarea").first().type("Arquivo legível reenviado.");
    cy.contains("button", "Reenviar receita").click();

    cy.wait("@resubmitPrescription");
    cy.wait("@getOrderDetail");
    cy.contains("Status da receita: EM_ANALISE").should("be.visible");

    cy.contains("button", "Solicitar troca/devolução").click();
    cy.contains("Descreva o motivo com pelo menos 8 caracteres.").should(
      "be.visible",
    );

    cy.get('input[type="checkbox"]').check();
    cy.get("textarea").last().type("Produto com avaria na embalagem externa.");
    cy.contains("button", "Solicitar troca/devolução").click();

    cy.wait("@createAfterSales");
    cy.wait("@getOrderDetail");
    cy.contains(
      "Você já possui uma solicitação pendente para este pedido.",
    ).should("be.visible");
    cy.contains("Troca • Pendente").should("be.visible");
  });
});
