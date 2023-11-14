describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'xiaolisheng',
      username: 'xls',
      password: '123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('log in').click()
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('xls')
      cy.get('#password').type('123')
      cy.get('#login-button').click()

      cy.contains('xiaolisheng logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('xls')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'xls', password: '123' });
    })

    it('A blog can be created', function () {
      cy.createBlog({
        title: 'a blog created by cypress',
        author: 'cypress',
        url: 'www.cypress.com',
        likes: 1
      })
      cy.contains('a blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'a blog created by cypress',
          author: 'cypress',
          url: 'www.cypress.com',
          likes: 1
        })
      })
      it('it can be liked', function () {
        cy.contains('view').click()
        cy.get('.like').click()
        cy.contains('likes 2')
      })
      it('it can be deleted', function () {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'a blog created by cypress')
      })
    })

    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'a blog created by cypress1',
          author: 'author1',
          url: 'www.cypress1.com',
          likes: 1
        })
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'author2',
          url: 'www.cypress2.com',
          likes: 2
        })
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'author3',
          url: 'www.cypress3.com',
          likes: 3
        })
      })
      it('the blog with the most likes is at the top', function () {
        cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
      })
    })
  })

})