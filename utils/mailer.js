const nodemailer = require('nodemailer')

const mailerUsername = process.env.MAILER_USERNAME
const mailerPassword = process.env.MAILER_PASSWORD
const mailerSendTo = process.env.MAILER_SEND_TO

module.exports.sendMail = async (subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: mailerUsername,
      pass: mailerPassword,
    }
  })

  const info = await transporter.sendMail({
    from: `"Aigul Ek 👻" <${mailerUsername}>`,
    to: mailerSendTo,
    subject: subject,
    text: text
  });

  console.log("Message sent: %s", info.messageId)
}
