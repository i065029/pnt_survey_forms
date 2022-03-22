/**
* Implementation for PntSurveyAppService defined in ./pntsurveyapp-service.cds
*/
const cds = require('@sap/cds');
// const SapCfMailer = require('sap-cf-mailer').default;
// const transporter = new SapCfMailer("mailtrap");


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
    const { ResponseId, Email, Customer, CEE } = req.data;

    // // use sendmail as you should use it in nodemailer
    // const result = await transporter.sendMail({
    //     to: 'rajiv.shivdev.pandey@sap.com',
    //     subject: `This is the mail subject`,
    //     text: `body of the email`
    //   });
    //   return JSON.stringify(result);
};

module.exports = cds.service.impl((srv) => {
    // Register Handlers for DELETE Response
    srv.before("DELETE", "Responses", onDeleteBeforeResponses);
    // Trigger Email to customer with survey Link
    srv.on("triggerEmail", onTriggerEmail);

});