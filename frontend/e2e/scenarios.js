describe('In class End to End Exercise', function() {
	'use strict'

	beforeEach(function() {
		browser.get('/frontend')
	})

	it('should work and have header text', function() {		
		expect(element.all(by.css('h1')).first().getText()).toMatch("Welcome to join us")		
	})

	function login() {
		// grab the current "message" and validate it is "You are Not Logged In"
		// log in by sending username and password for your test account
		// click the login button
		element(by.model('vm.username')).sendKeys('hz44')
		element(by.model('vm.password')).sendKeys('hardly-nation-finger')
		element(by.id('Login')).click()
	}

	function logout() {
		// click the logout button
		// grab the current "message" and validate it is "You are Not Logged In"
		element(by.id('Logout')).click()
	}

     it('should create a new post and verify', function() {
	    login()
	    console.log(123455456767)
        var newPost="New Post Test"
        element(by.model('vm.sendPost')).sendKeys(newPost)
        element(by.id('post')).click()
        expect(element.all(by.binding('x.body')).first().getText()).toMatch(newPost)
		logout()
	})

   
	it('should update the status and verify', function() {
	    login()
        var newStatus="Test Account"
        element(by.model('vm.newStatus')).sendKeys(newStatus)
        element(by.id('updateStatus')).click()
        expect(element(by.id('os')).getText()).toMatch(newStatus)
		logout()
	})

	it('count the number of followed users', function() {
	    login()
	      var list=element.all(by.id('following'));
	      expect(list.count()).toBe(6);
		logout()
	})
    it('add follower and verify', function() {
	    login()
	      element.all(by.id('Add')).first().click()
	      var list=element.all(by.id('following'));
	      expect(list.count()).toBe(7);
		logout()
	})
	it('remove follower and verify', function() {
	    login()
	      element.all(by.id('delete')).first().click()
	      var list=element.all(by.id('following'));
	      expect(list.count()).toBe(6);
		logout()
	})
   	it('Search for post and verify', function() {
	    login()
	     var newPost="hello"+Math.random()
	     element(by.model('vm.sendPost')).sendKeys(newPost)
         element(by.id('post')).click()

         element(by.css('[placeholder="search posts"]')).sendKeys(newPost)
	     var list=element.all(by.binding('x.body'));
          expect(list.count()).toBe(1);
          expect(element(by.id('author')).getText()).toBe('hz44');
		logout()
	})
    it('it should navigate to the profile and success', function() {
	    login()
	      element(by.id('profile')).click()
	      expect(browser.getLocationAbsUrl()).toBe('/profile')
		logout()
	})
    it('it should update email and verify', function() {
	    login()
	      var newEmail="1234@1234"
	      element(by.id('profile')).click()

	      element(by.css('[placeholder="Email"]')).sendKeys(newEmail)
	      element(by.id('updateP')).click()
	      element.all(by.css('.curr')).then(function(items){
	      	 expect(items[3].getText()).toBe(newEmail)
	      })
		logout()
	})
    it('it should update zipcode and verify ', function() {
	      login()
	      var newZipcode="77223"
	      element(by.id('profile')).click()
          element(by.id('zipcode')).sendKeys(newZipcode)
	      element(by.id('updateP')).click()
	      element.all(by.css('.curr')).then(function(items){
	      expect(items[4].getText()).toBe(newZipcode)
	      })
          logout()
	})
	it('it should update password and verify', function() {
	    login()
	      var password="12345"
	      element(by.id('profile')).click()
	      element(by.id('pwd')).sendKeys(password)
	      element(by.id('rpwd')).sendKeys(password)
          element(by.id('updateP')).click()
	      element.all(by.css('.curr')).then(function(items){
	      expect(items[7].getText()).toBe("will not change")
	      })
        logout()
	})
})
