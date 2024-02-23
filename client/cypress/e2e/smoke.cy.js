describe('Page Titles', () => {
  it('Home page shows "Home" text', () => {
    cy.visit('/');
    cy.contains('Home');
  });
  it('My Courses page shows "My Courses" text', () => {
    cy.visit('/mycourses');
    cy.contains('My Courses');
  });
  it('My Profile page shows "My Profile" text', () => {
    cy.visit('/myprofile');
    cy.contains('My Profile');
  });
});
