/// <reference types="Cypress" />
import '../support/commands.js'
const longText = 'Amor é fogo que arde sem se ver, é ferida que dói, e não se sente; é um contentamento descontente, é dor que desatina sem doer.';


describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(() => {
        cy.visit('./src/index.html')
    });

    it('verifica o título da aplicação', function() {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    })

    it('Preenche os campos obrigatórios e envia o formulário', () => {

        cy.get('#firstName')
        .should('be.empty')
        .type('Juliana')

        cy.get('#lastName')
        .should('be.empty')
        .type('Dias')

        cy.get('#email')
        .should('be.empty')
        .type('juliana.dias@mailnator.com')

        cy.get('#open-text-area')
        .should('be.empty')
        .type(longText
            ,{ delay: 0 })

        cy.contains('button', 'Enviar')
        .click()

        cy.get('span[class="success"]')
        .should('have.text', '\n      Mensagem enviada com sucesso.\n    ')
    });

    it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName')
        .should('be.empty')
        .type('Juliana')

        cy.get('#lastName')
        .should('be.empty')
        .type('Dias')

        cy.get('#email')
        .should('be.empty')
        .type('juliana.diasmailnator.com')

        cy.get('#open-text-area')
        .should('be.empty')
        .type(longText
            ,{ delay: 0 })

        cy.get('button[type="submit"]') //Propriedade button
        .click()

        cy.get('span[class="error"]')
        .should('have.text', '\n      Valide os campos obrigatórios!\n    ')
    });

    it('verificando campo telefone se apenas aceita números', () => {
        cy.get('#phone')
        .type('abc')
        .should('be.empty')
    });
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#phone-checkbox')
        .check()
        
        cy.get('#firstName')
        .should('be.empty')
        .type('Juliana')

        cy.get('#lastName')
        .should('be.empty')
        .type('Dias')

        cy.get('#email')
        .should('be.empty')
        .type('juliana.dias@mailnator.com')

        cy.get('#open-text-area')
        .should('be.empty')
        .type(longText
            ,{ delay: 0 })

        cy.get('button[type="submit"]') //Propriedade
        .click()

        cy.get('.error') //clase error
        .should('be.visible')
    });

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName')
        .type('Juliana')
        .should('have.value', 'Juliana')
        .clear()
        .should('have.value', '')

        cy.get('#lastName')
        .type('Dias')
        .should('have.value', 'Dias')
        .clear()
        .should('have.value', '')

        cy.get('#email')
        .type('juliana.dias@mailnator.com')
        .should('have.value', 'juliana.dias@mailnator.com')
        .clear()
        .should('have.value', '')

        cy.get('#phone')
        .type('21987635502')
        .should('have.value', '21987635502')
        .clear()
        .should('have.value', '')
    });

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.', () => {
        cy.get('button[type="submit"]') //Propriedade
        .click()

        cy.get('.error') //clase error
        .should('be.visible')
    });

    it('envia o formulário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success')
        .should('be.visible')
        
    });

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('select').select('youtube').should('have.value','youtube')
        cy.get('.success')
        .should('be.visible')
    });

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product')
        .select('mentoria')
        .should('have.value','mentoria')
    });

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product')
        .select(1)
        .should('have.value','blog')

    });

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]').check()
        .should('have.value', 'feedback')
    });

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')                  //.should('have.length', 3)
        .each(($radio) => {
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    });

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
        .check()
        .should('have.checked')
        .last()
        .uncheck().should('not.be.checked')

        cy.get('input[type="checkbox"]')
        .first()
        .uncheck().should('not.be.checked')
          
    });

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload').should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .then(input => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    });

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload').should('not.have.value')
        .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
        .then(input => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    });

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('arquivoExemplo')
        cy.get('#file-upload').should('not.have.value')
        .selectFile('@arquivoExemplo', { action: 'drag-drop' })
        .then(input => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    });

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a')
        .should('have.attr', 'target', '_blank')
    });

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
    });

  })
  
