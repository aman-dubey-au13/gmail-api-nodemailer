const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const CLIENT_ID = '300601526859-l4eit7qut2d7gijhu1ffcqq72pec1hrn.apps.googleusercontent.com'

const CLIENT_SECRET = 'NeUg70jgyIpJOagUHj7dDh38'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'

const REFRESH_TOKEN = '1//04kvZUeE6JEVhCgYIARAAGAQSNwF-L9Ir-QNO7o3j-RNa3AH35XFFsgfrNd3MEx07F8xCHmYz5eoBHmjS4STGDjrfhbzktMlyBFw'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI,)

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail (){
   try {
       const accessToken = await oAuth2Client.getAccessToken()
       const transport = nodemailer.createTransport({
           service:"gmail",
           auth:{
               type:'OAuth2',
               user:'amandubey9871@gmail.com',
               clientId : CLIENT_ID,
               clientSecret:CLIENT_SECRET,
               refreshToken:REFRESH_TOKEN,
               accessToken:accessToken
           }
       })

       const mailOptions = {
           from:'amandubey9871@gmail.com',
           to:'coustomer',
           subject: "you are register",
           text:'you are register',
           html:'<h1>you are register</h1>'
       };
       const result = transport.sendMail(mailOptions)
       return result

   } catch (error) {
       return error

   }
}

sendMail().then(result=> console.log("email send....",result))
.catch(error=>console.log(error.message))










