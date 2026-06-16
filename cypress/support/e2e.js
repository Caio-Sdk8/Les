// Suporte global dos testes E2E do front.
// Os cenários usam cy.intercept() para validar a interface sem depender do backend.
import {slowCypressDown} from 'cypress-slow-down';

slowCypressDown(200);