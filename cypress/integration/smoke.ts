import {
  userGenerator,
  discussionGenerator,
  commentGenerator,
} from '../../src/test/data-generators';

describe('smoke', () => {
  it('should handle normal app flow', () => {
    const user = userGenerator();

    const discussion = discussionGenerator();

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

    // log out:
    cy.findByRole('button', {
      name: /open user menu/i,
    }).click();

    cy.findByRole('menuitem', {
      name: /sign out/i,
    }).click();

    // log in:
    cy.visit('http://localhost:3000/auth/login');

    cy.findByRole('textbox', {
      name: /email address/i,
    }).type(user.email);
    cy.findByLabelText(/password/i).type(user.password);

    cy.findByRole('button', {
      name: /log in/i,
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

    cy.checkAndDismissNotification(/discussion created/i);

    cy.findByRole('dialog').should('not.exist');

    cy.wait(200);

    // visit discussion page:
    cy.findByRole('link', {
      name: /view/i,
    }).click();

    cy.findByRole('heading', {
      name: discussion.title,
    }).should('exist');

    // update discussion:
    cy.findByRole('button', {
      name: /update discussion/i,
    }).click();

    const updatedDiscussion = discussionGenerator();

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

    cy.checkAndDismissNotification(/discussion updated/i);

    cy.findByRole('heading', {
      name: updatedDiscussion.title,
    }).should('exist');

    // create comment:
    const comment = commentGenerator();

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

    cy.checkAndDismissNotification(/comment created/i);

    cy.findByRole('list', {
      name: 'comments',
    }).within(() => {
      cy.findByText(comment.body).should('exist');
    });

    cy.wait(200);

    // delete comment:
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
        name: /delete comment/i,
      }).click();
    });

    cy.wait(200);

    cy.checkAndDismissNotification(/comment deleted/i);

    cy.findByRole('list', {
      name: 'comments',
    }).within(() => {
      cy.findByText(comment.body).should('not.exist');
    });

    // go back to discussions list:
    cy.findByRole('link', {
      name: /discussions/i,
    }).click();

    cy.wait(200);

    // delete discussion:
    cy.findByRole('button', {
      name: /delete discussion/i,
    }).click();

    cy.findByRole('dialog').within(() => {
      cy.findByRole('button', {
        name: /delete discussion/i,
      }).click();
    });

    cy.checkAndDismissNotification(/discussion deleted/i);

    cy.wait(200);

    cy.findByRole('cell', {
      name: updatedDiscussion.title,
    }).should('not.exist');
  });
});
