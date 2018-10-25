const Contact = require('../../models/Contact');
const nodeMailer = require('nodemailer');


// send email to Admin

exports.contact_sendEmail = (req, res) => {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'yashcompusoft@gmail.com',
            pass: 'Yash@123'
        }
    });
    let mailOptions = {
        from: req.body.name + "<" + req.body.email + '>', // sender address
        to: '"Yash Compusoft" <yashcompusoft@gmail.com>', //req.body.email, // list of receivers
        subject: 'Contact US', // Subject line
        text: req.body.message, // plain text body
        //html: req.body.message // html body
    };
    var contactData = req.body;
    var contact = new Contact(contactData)
    contact.save((err, newContact) => {
        if (err) {
            return res.status(500).send({
                message: 'Error sending Email'
            })
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error sending Email'
                })
            }
            return res.status(200).send({
                statusCode: 200,
                message: 'Email send successfully'
            })
        });


    })
}