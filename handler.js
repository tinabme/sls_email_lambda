// handler.js

const serverless = require("serverless-http");
const AWS = require("aws-sdk");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const ses = new AWS.SES();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/", (req, res) => {

  if ( !(req.body.email && req.body.name && req.body.message && req.body.gem) ) {
    throw new Error('Missing parameters!.')
  }

  const emailParams = {
    Source: process.env.EMAIL,
    Destination: {
      ToAddresses: [process.env.TO_EMAIL]
    },
    ReplyToAddresses: [req.body.email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Message sent from email ${req.body.email} by ${req.body.name} \nPhone: ${req.body.phone} \nContent: ${req.body.message}`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "You Received a Message from jrtrees.com"
      }
    }
  };
  ses.sendEmail(emailParams, (err, data) => {
    if (err) {
      res.status(402).send(`${err} ${err.stack}`);
    }
    if (data) {
      res.send(data);
    }
  });

});

module.exports.form = serverless(app);