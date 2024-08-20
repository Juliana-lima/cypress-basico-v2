Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () =>{
    cy.get('#firstName')
        .should('be.empty')
        .type('Juliana')

        cy.get('#lastName')
        .should('be.empty')
        .type('Dias')

        cy.get('#email')
        .should('be.empty')
        .type('juliana.dias@mailinator.com')

        cy.get('#open-text-area')
        .should('be.empty')
        .type('Texto de teste')
            ,{ delay: 0 }

        cy.get('button[type="submit"]') //Propriedade
        .click()

        cy.get('span[class="success"]')
       
    
});
