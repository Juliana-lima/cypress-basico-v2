/// <reference types="Cypress" />
import "../support/commands.js";
const longText =
  "Amor é fogo que arde sem se ver, é ferida que dói, e não se sente; é um contentamento descontente, é dor que desatina sem doer.";
const THREE_SECONDS_IN_MS = 3000;

describe("Central de Atendimento ao Cliente TAT", function () {
  beforeEach(() => {
    cy.visit("./src/index.html");
  });

  it("verifica o título da aplicação", function () {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT");
  });

  it("Preenche os campos obrigatórios e envia o formulário", () => {
    cy.clock();

    cy.get("#firstName").should("be.empty").type("Juliana");

    cy.get("#lastName").should("be.empty").type("Dias");

    cy.get("#email").should("be.empty").type("juliana.dias@mailnator.com");

    cy.get("#open-text-area").should("be.empty").type(longText, { delay: 0 });

    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS);

    cy.get(".success").should("be.not.visible");

    //cy.get('span[class="success"]')
    //.should('have.text', '\n      Mensagem enviada com sucesso.\n    ')
  });

  it("Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.clock();

    cy.get("#firstName").should("be.empty").type("Juliana");

    cy.get("#lastName").should("be.empty").type("Dias");

    cy.get("#email").should("be.empty").type("juliana.diasmailnator.com");

    cy.get("#open-text-area").should("be.empty").type(longText, { delay: 0 });

    cy.get('button[type="submit"]') //Propriedade button
      .click();

    cy.get(".error").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS);

    cy.get(".error").should("be.not.visible");

    //cy.get('span[class="error"]')
    //.should('have.text', '\n      Valide os campos obrigatórios!\n    ')
  });

  it("verificando campo telefone se apenas aceita números", () => {
    cy.get("#phone").type("abc").should("be.empty");
  });
  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.clock();

    cy.get("#phone-checkbox").check();

    cy.get("#firstName").should("be.empty").type("Juliana");

    cy.get("#lastName").should("be.empty").type("Dias");

    cy.get("#email").should("be.empty").type("juliana.dias@mailnator.com");

    cy.get("#open-text-area").should("be.empty").type(longText, { delay: 0 });

    cy.get('button[type="submit"]') //Propriedade
      .click();

    cy.get(".error").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS);

    cy.get(".error").should("be.not.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("Juliana")
      .should("have.value", "Juliana")
      .clear()
      .should("have.value", "");

    cy.get("#lastName")
      .type("Dias")
      .should("have.value", "Dias")
      .clear()
      .should("have.value", "");

    cy.get("#email")
      .type("juliana.dias@mailnator.com")
      .should("have.value", "juliana.dias@mailnator.com")
      .clear()
      .should("have.value", "");

    cy.get("#phone")
      .type("21987635502")
      .should("have.value", "21987635502")
      .clear()
      .should("have.value", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.", () => {
    cy.clock();

    cy.get('button[type="submit"]').click();

    cy.get(".error").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS);

    cy.get(".error").should("be.not.visible");
  });

  it("envia o formulário com sucesso usando um comando customizado", function () {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS);

    cy.get(".success").should("be.not.visible");
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();
    cy.get("select").select("youtube").should("have.value", "youtube");
    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".success").should("be.not.visible");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]') //.should('have.length', 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("have.checked")
      .last()
      .uncheck()
      .should("not.be.checked");

    cy.get('input[type="checkbox"]').first().uncheck().should("not.be.checked");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get("#file-upload")
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json")
      .then((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get("#file-upload")
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .then((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json").as("arquivoExemplo");
    cy.get("#file-upload")
      .should("not.have.value")
      .selectFile("@arquivoExemplo", { action: "drag-drop" })
      .then((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("preenche a area de texto usando o comando invoke", () => {
    const longText2 = Cypress._.repeat("0123456789", 20);

    cy.get("#open-text-area")
      .invoke("val", longText2)
      .should("have.value", longText2);
  });

  it("faz uma requisição HTTP", () => {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should(function (response) {
      const { status, statusText, body } = response;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });

  Cypress._.times(3, function () {
    it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
      cy.get("#privacy a").invoke("removeAttr", "target").click();
    });
  });

  it.only('encontra o gato escondido', () => {
    cy.get('#cat').invoke('show')
    .should('be.visible');
    cy.get('#title').invoke('text', 'CAT ATA')
    cy.get('#subtitle').invoke('text', 'Eu 💜 🐈‍⬛')
  });
});
