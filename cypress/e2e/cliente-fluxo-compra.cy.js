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
    const requestBody =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const payload = Array.isArray(requestBody)
      ? requestBody
      : requestBody?.productUuids;

    expect(payload).to.be.an("array");
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

  it("registra pedido de venda com sucesso", () => {
    mockStoreApis();
    mockCartApis();

    cy.intercept("POST", "**/api/transactions/checkout", (req) => {
      expect(req.body.items).to.deep.equal([
        { productUuid: products.dipirona.uuid, quantity: 1 },
      ]);
      expect(req.body.paymentType).to.equal("credito1");
      expect(req.body.addressUuid).to.equal("addr-1");
      expect(req.body.singleCardUuid).to.equal("card-1");
      expect(req.body.couponCode).to.equal("sem");
      expect(req.body.prescriptionFileName).to.be.undefined;

      req.reply({
        statusCode: 200,
        body: {
          transactionUuid: "order-success",
          transactionCode: "PED-2026-0003",
          status: "EM_PROCESSAMENTO",
          subtotal: 12.5,
          shipping: 8.9,
          discount: 0,
          total: 21.4,
        },
      });
    }).as("checkoutRequest");

    cy.visit("/carrinho", {
      onBeforeLoad(win) {
        seedCustomerSession(win, [
          { productUuid: products.dipirona.uuid, quantity: 1 },
        ]);
      },
    });

    cy.wait("@getProducts");
    cy.wait("@getCheckoutAddresses");
    cy.wait("@getCheckoutCards");

    cy.get("select").eq(0).select("Cartão de crédito (1 cartão)");
    cy.get("select").eq(1).select("Casa • 08750000");
    cy.get("select").eq(2).select("Sem cupom");
    cy.get("select").eq(3).select("VISA **** 1111");

    cy.contains("button", "Finalizar pedido").click();

    cy.wait("@checkoutRequest");
    cy.url().should("include", "/loja");
    cy.window().its("localStorage").invoke("getItem", "pharma_cart").should("equal", null);
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

  it("cliente realiza compra com crédito em 2 cartões", () => {
    mockStoreApis();
    mockCartApis();

    cy.intercept("POST", "**/api/transactions/checkout", (req) => {
      expect(req.body.paymentType).to.equal("credito2");
      expect(req.body.items).to.deep.equal([
        { productUuid: products.dipirona.uuid, quantity: 2 },
        { productUuid: products.vitamina.uuid, quantity: 1 },
      ]);
      expect(req.body.splitPayment?.firstCardUuid).to.equal("card-1");
      expect(req.body.splitPayment?.secondCardUuid).to.equal("card-2");

      req.reply({
        statusCode: 200,
        body: {
          transactionUuid: "order-parcelas",
          transactionCode: "PED-PARCELAS",
          status: "EM_PROCESSAMENTO",
          subtotal: 44.4,
          shipping: 0,
          discount: 0,
          total: 44.4,
          installments: 3,
        },
      });
    }).as("checkoutRequest");

    cy.visit("/carrinho", {
      onBeforeLoad(win) {
        seedCustomerSession(win, [
          { productUuid: products.dipirona.uuid, quantity: 2 },
          { productUuid: products.vitamina.uuid, quantity: 1 },
        ]);
      },
    });

    cy.wait("@getCheckoutAddresses");
    cy.wait("@getCheckoutCards");

    cy.get("select").eq(0).select("Cartão de crédito (2 cartões)");
    cy.get("select").eq(1).select("Casa • 08750000");
    cy.get("select").eq(3).select("VISA **** 1111");
    cy.get("select").eq(4).select("MASTERCARD **** 2222");

    cy.contains("button", "Finalizar pedido").click();

    cy.wait("@checkoutRequest");
    cy.url().should("include", "/loja");
    cy.window()
      .its("localStorage")
      .invoke("getItem", "pharma_cart")
      .should("equal", null);
  });

  it("cliente realiza compra com débito", () => {
    mockStoreApis();
    mockCartApis();

    cy.intercept("POST", "**/api/transactions/checkout", (req) => {
      expect(req.body.paymentType).to.equal("debito");
      expect(req.body.items).to.deep.equal([
        { productUuid: products.vitamina.uuid, quantity: 1 },
      ]);

      req.reply({
        statusCode: 200,
        body: {
          transactionUuid: "order-debito",
          transactionCode: "PED-DEBITO",
          status: "EM_PROCESSAMENTO",
          subtotal: 18.9,
          shipping: 0,
          discount: 0,
          total: 18.9,
        },
      });
    }).as("checkoutRequest");

    cy.visit("/carrinho", {
      onBeforeLoad(win) {
        seedCustomerSession(win, [
          { productUuid: products.vitamina.uuid, quantity: 1 },
        ]);
      },
    });

    cy.wait("@getCheckoutAddresses");
    cy.wait("@getCheckoutCards");

    cy.get("select").eq(0).select("Cartão de débito");
    cy.get("select").eq(1).select("Casa • 08750000");

    cy.contains("button", "Finalizar pedido").click();

    cy.wait("@checkoutRequest");
    cy.url().should("include", "/loja");
  });

  it("cliente realiza compra com PIX", () => {
    mockStoreApis();
    mockCartApis();

    cy.intercept("POST", "**/api/transactions/checkout", (req) => {
      expect(req.body.paymentType).to.equal("pix");
      expect(req.body.items).to.deep.equal([
        { productUuid: products.dipirona.uuid, quantity: 1 },
      ]);

      req.reply({
        statusCode: 200,
        body: {
          transactionUuid: "order-pix",
          transactionCode: "PED-PIX",
          status: "AGUARDANDO_PAGAMENTO_PIX",
          subtotal: 12.5,
          shipping: 5.0,
          discount: 0,
          total: 17.5,
          pixKey: "00020126580014br.gov.bcb.pix...",
        },
      });
    }).as("checkoutRequest");

    cy.visit("/carrinho", {
      onBeforeLoad(win) {
        seedCustomerSession(win, [
          { productUuid: products.dipirona.uuid, quantity: 1 },
        ]);
      },
    });

    cy.wait("@getCheckoutAddresses");
    cy.wait("@getCheckoutCards");

    cy.get("select").eq(0).select("PIX");
    cy.get("select").eq(1).select("Casa • 08750000");

    cy.contains("button", "Finalizar pedido").click();

    cy.wait("@checkoutRequest");
    cy.url().should("include", "/loja");
  });

  it("cliente registra novo endereço e cartão no processo de checkout", () => {
    mockStoreApis();

    let clientAddresses = [...checkoutAddresses];
    let clientCards = [...checkoutCards];

    cy.intercept("GET", "**/api/customers/me/addresses", (req) => {
      req.reply({
        statusCode: 200,
        body: clientAddresses,
      });
    }).as("getCheckoutAddresses");

    cy.intercept("GET", "**/api/customers/customer-1/addresses", (req) => {
      req.reply({
        statusCode: 200,
        body: clientAddresses,
      });
    }).as("getCustomerAddressesDirect");

    cy.intercept("POST", "**/api/customers/customer-1/addresses", (req) => {
      const newAddress = {
        uuid: "addr-2",
        label: req.body.label,
        street: req.body.street,
        number: req.body.number,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        isActive: true,
      };

      clientAddresses.push(newAddress);

      req.reply({
        statusCode: 201,
        body: newAddress,
      });
    }).as("createAddress");

    cy.intercept("GET", "**/api/customers/me/credit-cards", (req) => {
      req.reply({
        statusCode: 200,
        body: clientCards,
      });
    }).as("getCheckoutCards");

    cy.intercept("GET", "**/api/customers/customer-1/credit-cards", (req) => {
      req.reply({
        statusCode: 200,
        body: clientCards,
      });
    }).as("getCustomerCardsDirect");

    cy.intercept("GET", "**/api/card-brands", {
      statusCode: 200,
      body: [
        { uuid: "brand-visa", name: "VISA" },
        { uuid: "brand-mastercard", name: "MASTERCARD" },
      ],
    }).as("getCardBrands");

    cy.intercept("POST", "**/api/customers/customer-1/credit-cards", (req) => {
      const newCard = {
        uuid: "card-3",
        cardBrandName: "mastercard",
        maskedCardNumber: "**** 5678",
        isPreferred: false,
        isActive: true,
      };

      clientCards.push(newCard);

      req.reply({
        statusCode: 201,
        body: newCard,
      });
    }).as("createCard");

    cy.intercept("POST", "**/api/transactions/checkout", (req) => {
      expect(req.body.addressUuid).to.equal("addr-2");
      expect(req.body.singleCardUuid).to.equal("card-3");

      req.reply({
        statusCode: 200,
        body: {
          transactionUuid: "order-novo-endereco",
          transactionCode: "PED-2026-NOVO",
          status: "EM_PROCESSAMENTO",
          subtotal: 31.4,
          shipping: 15.0,
          discount: 0,
          total: 46.4,
        },
      });
    }).as("checkoutRequest");

    cy.visit("/carrinho", {
      onBeforeLoad(win) {
        seedCustomerSession(win, [
          { productUuid: products.dipirona.uuid, quantity: 2 },
        ]);
      },
    });

    cy.wait("@getCheckoutAddresses");
    cy.wait("@getCheckoutCards");

    cy.get("select").eq(1).select("Adicionar Endereço");
    cy.get("select[name='addressType']").select("Entrega");
    cy.get("input[name='label']").type("Trabalho");
    cy.get("input[name='street']").type("Rua Comercial");
    cy.get("input[name='number']").type("500");
    cy.get("input[name='neighborhood']").type("Centro");
    cy.get("input[name='zipCode']").type("01310100");
    cy.get("input[name='city']").type("São Paulo");
    cy.get("input[name='state']").type("SP");
    cy.contains("button", /^Cadastrar$/).click({ force: true });

    cy.wait("@createAddress");
    cy.get("select").eq(1).should("contain", "Trabalho");

    cy.get("select").eq(0).select("Cartão de crédito (1 cartão)");
    cy.contains("button", "Cadastrar cartão").click();
    cy.wait("@getCardBrands");
    cy.get("input[name='printedName']").type("CLIENTE TEST");
    cy.get("input[name='cardNumber']").type("5555555555555678");
    cy.get("select[name='cardBrandUuid']").select("MASTERCARD");
    cy.get("input[name='securityCode']").type("456");
    cy.get("input[name='expirationDate']").type("2028-12-01");
    cy.contains("button", /^Cadastrar$/).click({ force: true });

    cy.wait("@createCard");
    cy.contains("Cadastro de cartão").should("not.exist");
    cy.get("select").eq(3).should("contain", "**** 5678");

    cy.get("select").eq(1).select("Trabalho • 01310100");
    cy.get("select").eq(3).select("MASTERCARD **** 5678");
    cy.contains("button", "Finalizar pedido").click();

    cy.wait("@checkoutRequest");
    cy.url().should("include", "/loja");
  });

  it("cliente solicita devolução da compra", () => {
    let orderDetail = {
      transactionUuid: "order-devolucao",
      transactionCode: "PED-2026-DEV",
      status: "ENTREGUE",
      createdAt: "2026-04-01T10:00:00Z",
      description: "PED-2026-DEV - Pedido com múltiplos itens",
      paymentType: "credito1",
      addressLabel: "Casa - 08750000",
      subtotal: 63.8,
      shipping: 10.0,
      discount: 0,
      total: 73.8,
      items: [
        {
          productUuid: products.dipirona.uuid,
          productName: products.dipirona.name,
          quantity: 2,
          unitPrice: 12.5,
          totalPrice: 25.0,
        },
        {
          productUuid: products.vitamina.uuid,
          productName: products.vitamina.name,
          quantity: 2,
          unitPrice: 18.9,
          totalPrice: 37.8,
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
            uuid: "order-devolucao",
            customerId: 1,
            amount: 73.8,
            description: "PED-2026-DEV - Pedido com múltiplos itens",
            status: "ENTREGUE",
            createdAt: "2026-04-01T10:00:00Z",
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

    cy.intercept("GET", "**/api/transactions/order-devolucao", (req) => {
      req.reply({
        statusCode: 200,
        body: orderDetail,
      });
    }).as("getOrderDetail");

    cy.intercept(
      "POST",
      "**/api/transactions/order-devolucao/after-sales-requests",
      (req) => {
        if (req.body.type === "DEVOLUCAO" && req.body.items.length === 2) {
          // Devolução total
          orderDetail.afterSalesRequests.push({
            requestUuid: "req-total",
            type: "DEVOLUCAO",
            status: "PENDENTE",
            reason: req.body.reason,
            items: req.body.items,
            requestedAt: "2026-04-13T12:00:00Z",
          });
        } else if (
          req.body.type === "DEVOLUCAO" &&
          req.body.items.length === 1
        ) {
          // Devolução parcial
          orderDetail.afterSalesRequests.push({
            requestUuid: "req-parcial",
            type: "DEVOLUCAO",
            status: "PENDENTE",
            reason: req.body.reason,
            items: req.body.items,
            requestedAt: "2026-04-13T13:00:00Z",
          });
        }

        req.reply({
          statusCode: 200,
          body: orderDetail.afterSalesRequests[
            orderDetail.afterSalesRequests.length - 1
          ],
        });
      },
    ).as("createAfterSales");

    cy.visit("/pedidos", {
      onBeforeLoad(win) {
        seedCustomerSession(win);
      },
    });

    cy.wait("@getMyOrders");
    cy.contains("PED-2026-DEV").should("be.visible");
    cy.contains("button", "Ver").click();

    cy.wait("@getOrderDetail");
    cy.contains("ENTREGUE").should("be.visible");

    cy.contains("button", "Solicitar troca/devolução").click();
    cy.get("select").first().select("Devolução");

    cy.get('input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).check({ force: true });
    });

    cy.get("textarea").type("Produto não atendeu às minhas expectativas.");
    cy.contains("button", "Solicitar troca/devolução").click();

    cy.wait("@createAfterSales");
    cy.wait("@getOrderDetail");
    cy.contains("Devolução • Pendente").should("be.visible");

    cy.contains(
      "Você já possui uma solicitação pendente para este pedido.",
    ).should("be.visible");
  });
});

// Testes do fluxo administrativo
const adminSession = {
  token: "fake-admin-token",
  user: {
    uuid: "admin-1",
    email: "admin@pharmapro.com",
    roles: ["Admin"],
  },
};

function seedAdminSession(win) {
  win.localStorage.setItem("pharma_token", adminSession.token);
  win.localStorage.setItem("pharma_user", JSON.stringify(adminSession.user));
}

describe("Fluxo administrativo pós-venda - front", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
  });

  it("admin visualiza transações", () => {
    const transaction = {
      id: 1,
      uuid: "order-admin-1",
      description: "PED-2026-ADMIN1 - Pedido administrativo",
      status: "AGUARDANDO_CONFIRMACAO_PAGAMENTO",
      amount: 100.0,
      paymentType: "credito1",
      createdAt: "2026-04-12T10:00:00Z",
      items: [
        {
          productName: products.dipirona.name,
          quantity: 2,
          unitPrice: 12.5,
        },
      ],
    };

    cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
      statusCode: 200,
      body: [],
    }).as("getPendingAfterSales");

    cy.intercept("GET", "**/api/transactions*", {
      statusCode: 200,
      body: {
        items: [transaction],
        totalCount: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }).as("getTransactions");

    cy.visit("/pedidos", {
      onBeforeLoad(win) {
        seedAdminSession(win);
      },
    });

    cy.wait("@getPendingAfterSales");
    cy.wait("@getTransactions");

    cy.contains("PED-2026-ADMIN1").should("be.visible");
    cy.contains("AGUARDANDO_CONFIRMACAO_PAGAMENTO").should("be.visible");
    cy.contains("button", "Ver").should("be.visible");
  });

  it("admin aceita e nega solicitações de troca e devolução", () => {
    let afterSalesRequests = [
      {
        requestUuid: "req-troca-1",
        transactionUuid: "order-troca-1",
        transactionCode: "PED-2026-TROCA",
        type: "TROCA",
        status: "PENDENTE",
        reason: "Produto com defeito",
        items: [{ productName: products.dipirona.name, quantity: 1 }],
        requestedAt: "2026-04-12T10:00:00Z",
      },
      {
        requestUuid: "req-dev-1",
        transactionUuid: "order-dev-1",
        transactionCode: "PED-2026-DEV",
        type: "DEVOLUCAO",
        status: "PENDENTE",
        reason: "Mudei de ideia",
        items: [{ productName: products.vitamina.name, quantity: 2 }],
        requestedAt: "2026-04-12T11:00:00Z",
      },
    ];

    cy.intercept("GET", "**/api/transactions/after-sales-requests*", (req) => {
      req.reply({
        statusCode: 200,
        body: afterSalesRequests,
      });
    }).as("getPendingAfterSales");

    cy.intercept(
      "PATCH",
      "**/api/transactions/*/after-sales-requests/req-troca-1/approve",
      (req) => {
        afterSalesRequests[0].status = "APROVADA";
        afterSalesRequests[0].reviewNote = req.body.note;
        afterSalesRequests[0].reviewedAt = "2026-04-13T09:00:00Z";
        afterSalesRequests[0].reviewedBy = "admin@pharmapro.com";

        req.reply({ statusCode: 200, body: {} });
      },
    ).as("acceptRequest");

    cy.intercept(
      "PATCH",
      "**/api/transactions/*/after-sales-requests/req-dev-1/reject",
      (req) => {
        afterSalesRequests[1].status = "REPROVADA";
        afterSalesRequests[1].reviewNote = req.body.note;
        afterSalesRequests[1].reviewedAt = "2026-04-13T10:00:00Z";
        afterSalesRequests[1].reviewedBy = "admin@pharmapro.com";

        req.reply({ statusCode: 200, body: {} });
      },
    ).as("rejectRequest");

    cy.visit("/avaliacao-trocas-devolucoes", {
      onBeforeLoad(win) {
        seedAdminSession(win);
      },
    });

    cy.wait("@getPendingAfterSales");

    cy.contains("PED-2026-TROCA").should("be.visible");
    cy.contains("Troca").should("be.visible");

    cy.get("textarea").type("Autorizado envio de produto de reposição.");
    cy.contains("button", "Aprovar").click();

    cy.wait("@acceptRequest");
    cy.contains("APROVADA").should("be.visible");

    cy.contains("td", "PED-2026-DEV").click();

    cy.get("textarea").clear().type("Prazo de devolução expirado.");
    cy.contains("button", "Reprovar").click();

    cy.wait("@rejectRequest");
    cy.contains("REPROVADA").should("be.visible");
  });

  it("admin define produto em transporte e confirma entrega", () => {
    const transaction = {
      id: 1,
      uuid: "order-entrega-1",
      description: "PED-2026-ENT - Pedido em envio",
      amount: 12.5,
      status: "EM_TRANSPORTE",
      createdAt: "2026-04-14T12:00:00Z",
      items: [
        {
          productName: products.dipirona.name,
          quantity: 1,
          status: "EM_TRANSPORTE",
        },
      ],
    };

    cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
      statusCode: 200,
      body: [],
    }).as("getPendingAfterSales");

    cy.intercept("GET", "**/api/transactions*", {
      statusCode: 200,
      body: {
        items: [transaction],
        totalCount: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      },
    }).as("getTransactions");

    cy.visit("/pedidos", {
      onBeforeLoad(win) {
        seedAdminSession(win);
      },
    });

    cy.wait("@getPendingAfterSales");
    cy.wait("@getTransactions");

    cy.contains("PED-2026-ENT").should("be.visible");
    cy.contains("EM_TRANSPORTE").should("be.visible");
    cy.contains("button", "Ver").should("be.visible");
  });

  it("admin confirma recebimento de produto devolvido e finaliza processo", () => {
    const afterSalesRequest = {
      requestUuid: "req-dev-final",
      transactionUuid: "order-final",
      transactionCode: "PED-2026-FINAL",
      type: "DEVOLUCAO",
      status: "APROVADA",
      reason: "Aguardando recebimento do item devolvido",
      items: [{ productName: products.dipirona.name, quantity: 2 }],
      pickupCode: null,
      returnReceivedAt: null,
      refundStatus: null,
    };

    cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
      statusCode: 200,
      body: [afterSalesRequest],
    }).as("getPendingAfterSales");

    cy.visit("/avaliacao-trocas-devolucoes", {
      onBeforeLoad(win) {
        seedAdminSession(win);
      },
    });

    cy.wait("@getPendingAfterSales");

    cy.contains("PED-2026-FINAL").should("be.visible");
    cy.contains("APROVADA").should("be.visible");
    cy.contains("Aguardando recebimento do item devolvido").should(
      "be.visible",
    );
  });
});
