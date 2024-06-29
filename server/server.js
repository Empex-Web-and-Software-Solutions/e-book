const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..'))); 

const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.co.uk',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.get('/', (req, res) => {
    res.send('E-book backend is running');
});

/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});*/

app.post('/send-email', (req, res) => {
    const userEmail = req.body.email;
    const ebookLink = 'https://storage.googleapis.com/e-book-bucket/Website%20Magic%20for%20Business%20Growth.pdf'; 

    const mailOptionsUser = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Your FREE E-book!',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; text-align: center;">
                <h2>Thank you for requesting our FREE e-book!</h2>
                <p>We hope you find it valuable for your business growth. Click the button below to download your e-book.</p>
                <a href="${ebookLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Download E-book</a>
                <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                <p><a href="${ebookLink}">${ebookLink}</a></p>
                <p>Best regards,<br>Vaidas Simkus</p>
            </div>
        `
    };

    const mailOptionsAdmin = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New E-book Download Request',
        text: `A new user has requested the e-book. Email: ${userEmail}`
    };

    transporter.sendMail(mailOptionsUser, (error, info) => {
        if (error) {
            console.error('Error sending email to user:', error);
            return res.status(500).send('Error sending email to user');
        }
        transporter.sendMail(mailOptionsAdmin, (error, info) => {
            if (error) {
                console.error('Error sending email to admin:', error);
                return res.status(500).send('Error sending email to admin');
            }
            res.status(200).send('Emails sent successfully');
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
