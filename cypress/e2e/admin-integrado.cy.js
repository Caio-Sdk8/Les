const adminSession = {
  token: "fake-admin-token",
  user: {
    uuid: "admin-1",
    email: "admin@pharmapro.com",
    roles: ["Admin"],
  },
};

const stockProducts = [
  {
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
  },
  {
    uuid: "prod-2",
    productCode: "MED-003",
    name: "Amoxicilina 500mg",
    activePrinciple: "Amoxicilina",
    imageUrl: "https://example.com/amoxicilina.png",
    salePrice: 32.4,
    prescriptionType: 2,
    isActive: true,
    categories: ["Antibióticos"],
    availableStock: 4,
  },
];

function pagedResult(items, pageSize = items.length || 1) {
  return {
    items,
    totalCount: items.length,
    page: 1,
    pageSize,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
}

function seedAdminSession(win) {
  win.localStorage.setItem("pharma_token", adminSession.token);
  win.localStorage.setItem("pharma_user", JSON.stringify(adminSession.user));
}

describe("Telas administrativas integradas - front", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
  });

  it("consulta estoque, filtra produtos e registra nova entrada", () => {
    let stockRows = [
      {
        productUuid: "prod-1",
        productCode: "MED-001",
        productName: "Dipirona 500mg",
        salePrice: 12.5,
        availableQuantity: 15,
        blockedQuantity: 0,
      },
      {
        productUuid: "prod-2",
        productCode: "MED-003",
        productName: "Amoxicilina 500mg",
        salePrice: 32.4,
        availableQuantity: 4,
        blockedQuantity: 1,
      },
    ];

    cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
      statusCode: 200,
      body: [],
    }).as("getPendingAfterSales");

    cy.intercept("GET", "**/api/stock*", (req) => {
      const search = String(req.query.search || "").toLowerCase();
      const filtered = stockRows.filter(
        (row) =>
          search.length === 0 || row.productName.toLowerCase().includes(search),
      );

      req.reply({ statusCode: 200, body: pagedResult(filtered, 10) });
    }).as("getStock");

    cy.intercept("GET", "**/api/products*", {
      statusCode: 200,
      body: pagedResult(stockProducts, 200),
    }).as("getProducts");

    cy.intercept("GET", "**/api/suppliers", {
      statusCode: 200,
      body: [
        {
          uuid: "sup-1",
          name: "Fornecedor Farma",
          cnpj: "12345678000199",
          contactEmail: "contato@fornecedor.com",
          contactPhone: "11999999999",
          isActive: true,
        },
      ],
    }).as("getSuppliers");

    cy.intercept("POST", "**/api/stock/entries", (req) => {
      expect(req.body).to.deep.equal({
        productUuid: "prod-2",
        supplierUuid: "sup-1",
        quantity: 10,
        costValue: 15.75,
        entryDate: "2026-04-13",
      });

      stockRows = stockRows.map((row) =>
        row.productUuid === "prod-2"
          ? { ...row, availableQuantity: row.availableQuantity + 10 }
          : row,
      );

      req.reply({
        statusCode: 200,
        body: {
          uuid: "entry-1",
          productUuid: "prod-2",
          productName: "Amoxicilina 500mg",
          supplierUuid: "sup-1",
          supplierName: "Fornecedor Farma",
          quantity: 10,
          costValue: 15.75,
          entryDate: "2026-04-13",
          createdAt: "2026-04-13T12:00:00Z",
        },
      });
    }).as("registerEntry");

    cy.visit("/estoque", {
      onBeforeLoad(win) {
        seedAdminSession(win);
      },
    });

    cy.wait("@getPendingAfterSales");
    cy.wait("@getStock");
    cy.wait("@getProducts");
    cy.wait("@getSuppliers");

    cy.contains("Amoxicilina 500mg").should("be.visible");
    cy.contains("Estoque baixo").should("be.visible");

    cy.get('input[placeholder="Buscar produto..."]').type("amoxicilina");
    cy.contains("button", "Buscar").click();
    cy.wait("@getStock");
    cy.contains("Dipirona 500mg").should("not.exist");
    cy.contains("Amoxicilina 500mg").should("be.visible");

    cy.contains("button", "+ Registrar Entrada").click();
    cy.contains("button", "Confirmar Entrada").click();
    cy.contains("Selecione um produto.").should("be.visible");

    cy.get("#entry-product").select("MED-003 — Amoxicilina 500mg");
    cy.get("#entry-supplier").select("Fornecedor Farma");
    cy.get("#entry-qty").type("10");
    cy.get("#entry-cost").type("15.75");
    cy.get("#entry-date").clear().type("2026-04-13");
    cy.contains("button", "Confirmar Entrada").click();

    cy.wait("@registerEntry");
    cy.wait("@getStock");
    cy.contains("Amoxicilina 500mg").should("be.visible");
    cy.contains(/^14$/).should("be.visible");
  });

  it("carrega o gráfico de vendas, troca o modo de análise e compara séries", () => {
    cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
      statusCode: 200,
      body: [{ requestUuid: "req-pending" }],
    }).as("getPendingAfterSales");

    cy.intercept("GET", "**/api/transactions/sales-catalog", {
      statusCode: 200,
      body: {
        periods: [
          { value: "2026-01", label: "Jan/2026" },
          { value: "2026-02", label: "Fev/2026" },
          { value: "2026-03", label: "Mar/2026" },
        ],
        products: [
          {
            id: "prod-1",
            label: "Dipirona 500mg",
            points: [
              {
                period: "2026-01",
                label: "Jan/2026",
                quantity: 10,
                revenue: 125,
              },
              {
                period: "2026-02",
                label: "Fev/2026",
                quantity: 12,
                revenue: 150,
              },
              {
                period: "2026-03",
                label: "Mar/2026",
                quantity: 15,
                revenue: 187.5,
              },
            ],
          },
          {
            id: "prod-2",
            label: "Amoxicilina 500mg",
            points: [
              {
                period: "2026-01",
                label: "Jan/2026",
                quantity: 5,
                revenue: 162,
              },
              {
                period: "2026-02",
                label: "Fev/2026",
                quantity: 6,
                revenue: 194.4,
              },
              {
                period: "2026-03",
                label: "Mar/2026",
                quantity: 9,
                revenue: 291.6,
              },
            ],
          },
        ],
        categories: [
          {
            id: "cat-1",
            label: "Dor e Febre",
            points: [
              {
                period: "2026-01",
                label: "Jan/2026",
                quantity: 10,
                revenue: 125,
              },
              {
                period: "2026-02",
                label: "Fev/2026",
                quantity: 12,
                revenue: 150,
              },
              {
                period: "2026-03",
                label: "Mar/2026",
                quantity: 15,
                revenue: 187.5,
              },
            ],
          },
          {
            id: "cat-2",
            label: "Antibióticos",
            points: [
              {
                period: "2026-01",
                label: "Jan/2026",
                quantity: 5,
                revenue: 162,
              },
              {
                period: "2026-02",
                label: "Fev/2026",
                quantity: 6,
                revenue: 194.4,
              },
              {
                period: "2026-03",
                label: "Mar/2026",
                quantity: 9,
                revenue: 291.6,
              },
            ],
          },
        ],
      },
    }).as("getSalesCatalog");

    cy.visit("/grafico", {
      onBeforeLoad(win) {
        seedAdminSession(win);
      },
    });

    cy.wait("@getPendingAfterSales");
    cy.wait("@getSalesCatalog");

    cy.contains("Filtros de análise").should("be.visible");
    cy.contains("Dipirona 500mg").should("be.visible");
    cy.contains(/R\$\s*462,50/).should("be.visible");
    cy.contains("Líder do período: Dipirona 500mg").should("be.visible");

    cy.get("#analysis-mode").select("Categoria");
    cy.get("#primary-series").select("Dor e Febre");
    cy.get("#secondary-series").select("Antibióticos");
    cy.get("#start-period").clear().type("2026-02");
    cy.get("#end-period").clear().type("2026-03");

    cy.contains("Categoria").should("be.visible");
    cy.contains("Antibióticos").should("be.visible");
    cy.contains("Dor e Febre").should("be.visible");
    cy.contains("Dados carregados exclusivamente da API de transações.").should(
      "be.visible",
    );
  });

  it("analisa receitas e dispara ações administrativas", () => {
    const reviews = [
      {
        id: 1,
        transactionUuid: "order-1",
        transactionCode: "PED-2026-0101",
        customerName: "João da Silva",
        customerDocument: "123.456.789-01",
        sentAt: "13/04/2026 10:00",
        fileName: "receita-1.png",
        status: "PENDENTE",
        note: "",
        products: [
          {
            name: "Amoxicilina 500mg",
            quantity: 1,
            prescriptionLabel: "Tarja vermelha",
          },
        ],
      },
      {
        id: 2,
        transactionUuid: "order-2",
        transactionCode: "PED-2026-0102",
        customerName: "Maria Oliveira",
        customerDocument: "987.654.321-00",
        sentAt: "13/04/2026 11:00",
        fileName: "receita-2.png",
        status: "PENDENTE",
        note: "",
        products: [
          {
            name: "Clonazepam 2mg",
            quantity: 1,
            prescriptionLabel: "Tarja preta",
          },
        ],
      },
      {
        id: 3,
        transactionUuid: "order-3",
        transactionCode: "PED-2026-0103",
        customerName: "Ana Costa",
        customerDocument: "111.222.333-44",
        sentAt: "13/04/2026 12:00",
        fileName: "receita-3.png",
        status: "PENDENTE",
        note: "",
        products: [
          {
            name: "Sertralina 50mg",
            quantity: 2,
            prescriptionLabel: "Tarja vermelha",
          },
        ],
      },
    ];

    cy.intercept("GET", "**/api/transactions/after-sales-requests*", {
      statusCode: 200,
      body: [{ requestUuid: "req-1" }],
    }).as("getPendingAfterSales");

    cy.intercept("GET", "**/api/transactions/prescriptions*", {
      statusCode: 200,
      body: reviews,
    }).as("getPrescriptionReviews");

    cy.intercept("GET", "**/api/transactions/*/prescription-file", {
      statusCode: 200,
      body: {
        fileName: "receita.png",
        contentType: "image/png",
        base64:
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lxL7WQAAAABJRU5ErkJggg==",
      },
    }).as("getPrescriptionFile");

    cy.intercept(
      "PATCH",
      "**/api/transactions/prescriptions/order-1/approve",
      (req) => {
        expect(req.body.note).to.equal("Aprovada para separação.");
        req.reply({ statusCode: 200, body: {} });
      },
    ).as("approvePrescription");

    cy.intercept(
      "PATCH",
      "**/api/transactions/prescriptions/order-2/reject",
      (req) => {
        expect(req.body.note).to.equal("Documento incompatível.");
        req.reply({ statusCode: 200, body: {} });
      },
    ).as("rejectPrescription");

    cy.intercept(
      "PATCH",
      "**/api/transactions/prescriptions/order-3/request-resubmission",
      (req) => {
        expect(req.body.note).to.equal("Envie foto mais nítida.");
        req.reply({ statusCode: 200, body: {} });
      },
    ).as("resubmitPrescription");

    cy.visit("/avaliacao-receitas", {
      onBeforeLoad(win) {
        seedAdminSession(win);
      },
    });

    cy.wait("@getPendingAfterSales");
    cy.wait("@getPrescriptionReviews");
    cy.wait("@getPrescriptionFile");

    cy.contains("PED-2026-0101").should("be.visible");
    cy.get('img[alt="receita-1.png"]').should("be.visible");

    cy.get(
      'textarea[placeholder="Descreva o motivo da aprovação ou reprovação"]',
    ).type("Aprovada para separação.");
    cy.contains("button", "Aprovar receita").click();
    cy.wait("@approvePrescription");
    cy.contains("APROVADA").should("be.visible");

    cy.contains("PED-2026-0102").click();
    cy.wait("@getPrescriptionFile");
    cy.get(
      'textarea[placeholder="Descreva o motivo da aprovação ou reprovação"]',
    )
      .clear()
      .type("Documento incompatível.");
    cy.contains("button", "Reprovar receita").click();
    cy.wait("@rejectPrescription");
    cy.contains("REPROVADA").should("be.visible");

    cy.contains("PED-2026-0103").click();
    cy.wait("@getPrescriptionFile");
    cy.get(
      'textarea[placeholder="Descreva o motivo da aprovação ou reprovação"]',
    )
      .clear()
      .type("Envie foto mais nítida.");
    cy.contains("button", "Solicitar novo envio").click();
    cy.wait("@resubmitPrescription");
    cy.contains("REENVIO_SOLICITADO").should("be.visible");
  });

  it("filtra solicitações de troca e devolução e registra aprovação e reprovação", () => {
    let requests = [
      {
        requestUuid: "req-1",
        transactionUuid: "order-1",
        transactionCode: "PED-2026-0201",
        type: "TROCA",
        status: "PENDENTE",
        reason: "Produto chegou amassado.",
        reviewNote: null,
        requestedAt: "2026-04-13",
        reviewedAt: null,
        reviewedBy: null,
        items: [
          { productUuid: "prod-1", productName: "Dipirona 500mg", quantity: 1 },
        ],
      },
      {
        requestUuid: "req-2",
        transactionUuid: "order-2",
        transactionCode: "PED-2026-0202",
        type: "DEVOLUCAO",
        status: "PENDENTE",
        reason: "Cliente desistiu da compra.",
        reviewNote: null,
        requestedAt: "2026-04-12",
        reviewedAt: null,
        reviewedBy: null,
        items: [
          {
            productUuid: "prod-2",
            productName: "Amoxicilina 500mg",
            quantity: 1,
          },
        ],
      },
    ];

    cy.intercept("GET", "**/api/transactions/after-sales-requests*", (req) => {
      const status = String(req.query.status || "");
      const type = String(req.query.type || "");
      const requestedFrom = String(req.query.requestedFrom || "");
      const requestedTo = String(req.query.requestedTo || "");

      const filtered = requests.filter((item) => {
        const statusMatches = !status || item.status === status;
        const typeMatches = !type || item.type === type;
        const fromMatches = !requestedFrom || item.requestedAt >= requestedFrom;
        const toMatches = !requestedTo || item.requestedAt <= requestedTo;
        return statusMatches && typeMatches && fromMatches && toMatches;
      });

      req.reply({ statusCode: 200, body: filtered });
    }).as("getAfterSalesRequests");

    cy.intercept(
      "PATCH",
      "**/api/transactions/order-1/after-sales-requests/req-1/approve",
      (req) => {
        expect(req.body.note).to.equal("Aprovado para troca imediata.");
        requests = requests.map((item) =>
          item.requestUuid === "req-1"
            ? {
                ...item,
                status: "APROVADA",
                reviewNote: "Aprovado para troca imediata.",
              }
            : item,
        );
        req.reply({ statusCode: 200, body: {} });
      },
    ).as("approveAfterSales");

    cy.intercept(
      "PATCH",
      "**/api/transactions/order-2/after-sales-requests/req-2/reject",
      (req) => {
        expect(req.body.note).to.equal("Prazo de devolução expirado.");
        requests = requests.map((item) =>
          item.requestUuid === "req-2"
            ? {
                ...item,
                status: "REPROVADA",
                reviewNote: "Prazo de devolução expirado.",
              }
            : item,
        );
        req.reply({ statusCode: 200, body: {} });
      },
    ).as("rejectAfterSales");

    cy.visit("/avaliacao-trocas-devolucoes", {
      onBeforeLoad(win) {
        seedAdminSession(win);
      },
    });

    cy.wait("@getAfterSalesRequests");
    cy.contains("PED-2026-0201").should("be.visible");
    cy.contains("PED-2026-0202").should("be.visible");

    cy.get("select").first().select("Pendente");
    cy.get("select").eq(1).select("Devolução");
    cy.contains("button", "Filtrar").click();
    cy.wait("@getAfterSalesRequests");
    cy.contains("PED-2026-0201").should("not.exist");
    cy.contains("PED-2026-0202").should("be.visible").click();

    cy.get(
      'textarea[placeholder="Descreva a justificativa da aprovação/reprovação"]',
    ).type("Prazo de devolução expirado.");
    cy.contains("button", "Reprovar").click();
    cy.wait("@rejectAfterSales");
    cy.contains("REPROVADA").should("be.visible");
    cy.contains("Prazo de devolução expirado.").should("be.visible");

    cy.get("select").first().select("Status (todos)");
    cy.get("select").eq(1).select("Tipo (todos)");
    cy.contains("button", "Filtrar").click();
    cy.wait("@getAfterSalesRequests");
    cy.contains("PED-2026-0201").click();

    cy.get(
      'textarea[placeholder="Descreva a justificativa da aprovação/reprovação"]',
    )
      .clear()
      .type("Aprovado para troca imediata.");
    cy.contains("button", "Aprovar").click();
    cy.wait("@approveAfterSales");
    cy.contains("APROVADA").should("be.visible");
    cy.contains("Aprovado para troca imediata.").should("be.visible");
  });
});
