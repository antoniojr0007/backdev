require('dotenv/config');
const mailer = require('nodemailer');
const hbs = require('nodemailer-handlebars');

const config = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },

  tls: { rejectUnauthorized: false },
};

const transport = mailer.createTransport(config);

const handlebarOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: './src/views/',
    layoutsDir: './src/views/',
    defaultLayout: '',
  },
  viewPath: './src/views/',
  extName: '.html',
};

transport.use('compile', hbs(handlebarOptions));

module.exports = transport;
