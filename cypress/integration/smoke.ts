const faker = require('faker');

describe('smoke', () => {
  it('should handle normal app flow', () => {
    const user = {
      firstName: faker.internet.userName(),
      lastName: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      teamName: faker.company.companyName(),
    };

    const discussion = {
      title: faker.company.catchPhrase(),
      body: faker.lorem.sentence(),
    };

    // registration:
    cy.visit('http://localhost:3000/auth/register');

    cy.findByRole('textbox', {
      name: /first name/i,
    }).type(user.firstName);
    cy.findByRole('textbox', {
      name: /last name/i,
    }).type(user.lastName);
    cy.findByRole('textbox', {
      name: /email address/i,
    }).type(user.email);
    cy.findByLabelText(/password/i).type(user.password);

    cy.findByRole('textbox', {
      name: /team name/i,
    }).type(user.teamName);

    cy.findByRole('button', {
      name: /register/i,
    }).click();

    cy.findByRole('heading', {
      name: `Welcome ${user.firstName} ${user.lastName}`,
    }).should('exist');

    cy.findByRole('link', {
      name: /discussions/i,
    }).click();

    // create discussion:
    cy.findByRole('button', {
      name: /create discussion/i,
    }).click();

    cy.findByRole('dialog').within(() => {
      cy.findByRole('textbox', {
        name: /title/i,
      }).type(discussion.title);
      cy.findByRole('textbox', {
        name: /body/i,
      }).type(discussion.body);
      cy.findByRole('button', {
        name: /submit/i,
      }).click();
    });
    cy.findByRole('alert', {
      name: /discussion created/i,
    }).within(() => {
      cy.findByText(/discussion created/i).should('exist');
      cy.findByRole('button').click();
    });
    cy.findByRole('dialog').should('not.exist');

    cy.wait(200);

    // visit discussion page:
    cy.findByRole('row', {
      name: `${discussion.title} View Delete`,
    }).within(() => {
      cy.findByRole('link', {
        name: /view/i,
      }).click();
    });

    cy.findByRole('heading', {
      name: discussion.title,
    }).should('exist');

    // update

    cy.findByRole('button', {
      name: /update discussion/i,
    }).click();

    const updatedDiscussion = {
      title: faker.company.catchPhrase(),
      body: faker.lorem.sentence(),
    };

    cy.findByRole('dialog').within(() => {
      cy.findByRole('textbox', {
        name: /title/i,
      })
        .clear()
        .type(updatedDiscussion.title);
      cy.findByRole('textbox', {
        name: /body/i,
      })
        .clear()
        .type(updatedDiscussion.body);
      cy.findByRole('button', {
        name: /submit/i,
      }).click();
    });
    cy.findByRole('alert', {
      name: /discussion updated/i,
    }).within(() => {
      cy.findByText(/discussion updated/i).should('exist');
      cy.findByRole('button').click();
    });

    cy.findByRole('heading', {
      name: updatedDiscussion.title,
    }).should('exist');

    // create comment

    const comment = {
      body: faker.lorem.sentence(),
    };

    cy.findByRole('button', {
      name: /create comment/i,
    }).click();

    cy.findByRole('dialog').within(() => {
      cy.findByRole('textbox', {
        name: /body/i,
      }).type(comment.body, { force: true }); // for some reason it requires force to be set to true

      cy.findByRole('button', {
        name: /submit/i,
      }).click();
    });
    cy.findByRole('alert', {
      name: /comment created/i,
    }).within(() => {
      cy.findByText(/comment created/i).should('exist');
      cy.findByRole('button').click();
    });

    cy.findByRole('list', {
      name: 'comments',
    }).within(() => {
      cy.findByText(comment.body).should('exist');
    });

    cy.wait(200);

    // delete comment

    cy.findByRole('list', {
      name: 'comments',
    }).within(() => {
      cy.findByRole('listitem', {
        name: `comment-${comment.body}-0`,
      }).within(() => {
        cy.findByRole('button', {
          name: /delete comment/i,
        }).click();
      });
    });

    cy.findByRole('dialog').within(() => {
      cy.findByRole('button', {
        name: /delete/i,
      }).click();
    });

    cy.findByRole('alert', {
      name: /comment deleted/i,
    }).within(() => {
      cy.findByText(/comment deleted/i).should('exist');
      cy.findByRole('button').click();
    });

    cy.findByRole('list', {
      name: 'comments',
    }).within(() => {
      cy.findByText(comment.body).should('not.exist');
    });

    // go back to discussions list

    cy.findByRole('link', {
      name: /discussions/i,
    }).click();

    cy.wait(200);

    // delete discussion:
    cy.findByRole('row', {
      name: `${updatedDiscussion.title} View Delete`,
    }).within(() => {
      cy.findByRole('button', {
        name: 'Delete',
      }).click();
    });

    cy.findByRole('dialog').within(() => {
      cy.findByRole('button', {
        name: /delete/i,
      }).click();
    });

    cy.findByRole('alert', {
      name: /discussion deleted/i,
    }).within(() => {
      cy.findByText(/discussion deleted/i).should('exist');
      cy.findByRole('button').click();
    });

    cy.findByRole('row', {
      name: `${updatedDiscussion.title} View Delete`,
    }).should('not.exist');
  });
});
