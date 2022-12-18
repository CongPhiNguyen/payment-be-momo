require('dotenv').config()
const nodemailer = require('nodemailer')
const { OAuth2Client } =  require('google-auth-library')


const myOAuth2Client = new OAuth2Client(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET
)

myOAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
})


exports.sendMail = async (req, res) => {
    try {
        if (!req.body.recivers || !req.body.subject || !req.body.content) 
            throw new Error('Please provide recivers, subject and content!')
            
        const myAccessTokenObject = await myOAuth2Client.getAccessToken()
        const myAccessToken = myAccessTokenObject?.token

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: process.env.MAIL_USERNAME,
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: myAccessToken
            }
        });

        let receivers = ''
        // console.log(req.body)
        req.body.recivers.forEach((reciver, idx) => {
            if (idx == 0){
                receivers += reciver
            }
            else {
                receivers += (',' + reciver)
            }
        })
        req.body.attachments.forEach( (attachment) =>{
            attachment.path = __dirname + '../../../assets/' + attachment.path
        })  

        const mailOptions = {
            to: receivers,
            subject: req.body.subject,
            text: req.body.content,
            attachments: req.body.attachments
        }; 
        
        await transporter.sendMail(mailOptions)

        res.status(200).json({ message: 'Email sent successfully.' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ errors: error.message })
    }
}

