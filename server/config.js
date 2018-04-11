module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl' : 'mongodb://localhost:27017/filestream',
    'facebookAuth': {
      'clientID'      : '1321303171317674', // your App ID
      'clientSecret'  : 'ba8b090851d4844174af763794dc7a5d', // your App Secret
      'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
       enableProof: false
     },

    'googleAuth': {
    'clientID'      : '664725733593-h9f35p9eq3negqkcv435jd1b7pquli7s.apps.googleusercontent.com',
    'clientSecret'  : '6-qkeL8LZsGj-xuU0Pb_D11x',
    'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    },

}
