const keys = require("../config/keys");

function sendMail(templateParams) {
  console.log("attempting to send email");

  const mailjet = require("node-mailjet").connect(keys.MAILJET_API_KEY, keys.MAILJET_SECRET_KEY);

  return new Promise(function (resolve, reject) {
    const request = mailjet.post("send", { "version": "v3.1" }).request({
      "Messages": [
        {
          "From": {
            "Email": "mike.kandino@mokancode.com",
            "Name": "Quiza",
          },
          "To": [
            {
              "Email": templateParams.recipient_email,
              "Name": templateParams.recipient_name,
            },
          ],
          "TemplateID": templateParams.templateID,
          "TemplateLanguage": true,
          "Subject": templateParams.subject,

          Variables: templateParams,
          // Variables: {
          //     app_name: templateParams.app_name,
          //     recipient_name: templateParams.recipient_name,
          //     activationURL: templateParams.activationURL
          // }
        },
      ],
    });
    request
      .then((result) => {
        console.log("email sent");
        // console.log(result.body)
        resolve("email sent");
      })
      .catch((err) => {
        console.log(err);
        reject("error");
      });
  });
}

module.exports = sendMail;
