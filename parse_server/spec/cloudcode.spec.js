let Parse = require('parse/node');

describe('Cloud Code' , () => {
    beforeAll(async () => {
        const {
            APP_ID,
            JAVASCRIPT_KEY,
            SERVER_URL
          } = process.env;
        try {
            let auth = Parse.initialize(APP_ID, JAVASCRIPT_KEY);
            Parse.serverURL = SERVER_URL
        } catch(error) {
            console.log(error)
        }
    })

    it('Should successfully sign up', async () => {
        let user = {
            "email": "felipeballesteros4@gmail.com",
            "password": "123456"
        }

        let response = await Parse.Cloud.run("signup", user);
        expect(response.isSuccess).toBe(true)
    })
})
