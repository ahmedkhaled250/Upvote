import nodemailer from 'nodemailer'
export async function nodeEmail(dest, subject, message, attachments) {
  if (!attachments) {
    attachments = [];
  }
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.nodeMailerEmail,
      pass: process.env.nodeMailerPassword,
    },
  });
  let info = await transporter.sendMail({
    from: `"Ahmed Khaled" <${process.env.nodeMailerEmail}>`,
    to: dest,
    subject,
    html: message,
    attachments,
  });
  console.log(info);
}
