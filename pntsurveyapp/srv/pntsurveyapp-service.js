/**
* Implementation for PntSurveyAppService defined in ./pntsurveyapp-service.cds
*/
const cds = require('@sap/cds');
const nodemailer = require('nodemailer');

const { Responses, Answers, SurveyFormInstances } = cds.entities("SurveyService");

/**
 * DELETE Response (Before)
 * 
 * @param {Object} req Standard CDS request object 
 */
const onDeleteBeforeResponses = async (req) => {
    const { ID } = req.data;
    const tx = cds.transaction(req);

    // Check if a Response exists
    const dbResponses = await tx.run(SELECT.from(Responses).where({ ID }));
    if (!dbResponses) {
        return req.error(400, `Response ${ID} not found.`);
    }

    // Delete Answers
    let checkAnswerDel = await tx.run(DELETE.from(Answers).where({ response_ID: ID }));
    // Delete sanity check
    if (checkAnswerDel < 1) {
        tx.rollback();
        return req.error(400, `Response ${ID} Deletion Failed (a).`);
    }

    // Delete Survey Form Instances
    let checkSFIDel = await tx.run(DELETE.from(SurveyFormInstances).where({ ID: dbResponses[0].surveyFormInstance_ID }));
    // Delete sanity check
    if (checkSFIDel !== 1) {
        tx.rollback();
        return req.error(400, `Response ${ID} Deletion Failed (sf).`);
    }

    return dbResponses;

};

/**
 * Trigger Email
 * 
 * @param {Object} req Standard CDS request object 
 */
let onTriggerEmail = async (req) => {
    const { ResponseId, CustomerEmail, Customer, CEE, CEEEmail } = req.data;

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'gmail',
        port: 587,
        auth: {
            user: 'demosapcp@gmail.com',
            pass: 'vcxc3668'
        }
    });

    var mailOptions = {
        from: 'demosapcp@gmail.com', // sender address
        to: CustomerEmail, // list of receivers
        subject: "Welcome to SAP Business Technology Platform - " + Customer, // Subject line
        // text: "Test Email - Recommender App", // plain text body
        html: "<b>Dear Customer</b>", // html body
    };

    // send mail with defined transport object
    let result = await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    return JSON.stringify(result);

    // // use sendmail as you should use it in nodemailer
    // const result = await transporter.sendMail({
    //     to: 'rajiv.shivdev.pandey@sap.com',
    //     subject: `This is the mail subject`,
    //     text: `body of the email`
    //   });

};

module.exports = cds.service.impl((srv) => {
    // Register Handlers for DELETE Response
    srv.before("DELETE", "Responses", onDeleteBeforeResponses);
    // Trigger Email to customer with survey Link
    srv.on("triggerEmail", onTriggerEmail);

});