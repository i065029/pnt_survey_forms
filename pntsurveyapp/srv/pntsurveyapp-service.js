/**
* Implementation for PntSurveyAppService defined in ./pntsurveyapp-service.cds
*/
const cds = require('@sap/cds')

/**
 * DELETE Response (Before)
 * 
 * @param {Object} req Standard CDS request object 
 */
let onDeleteBeforeResponses = async (req) => {
    const { ID } = req.data;
    const tx = cds.transaction(req);

    // Check if a Response exists
    let dbSResponses = await tx.run(SELECT.one.from(Response).where({ ID }));
    if (!dbSResponses) {
        return req.error(400, `Response ${ID} not found.`);
    }

    // Delete Answers
    let checkAnswerDel = await tx.run(DELETE.from(Answer).where({ response: ID }));
    // Delete sanity check
    if (checkAnswerDel !== 1) {
        tx.rollback();
        return req.error(400, "Answer Deletion Failed");
    }

    // Delete Survey Form Instances
    let checkSFIDel = await tx.run(DELETE.from(SurveyFormInstance).where({ ID: dbSResponses.surveyFormInstance }));
    // Delete sanity check
    if (checkSFIDel !== 1) {
        tx.rollback();
        return req.error(400, "Survey Form Deletion Failed");
    }
};

module.exports = cds.service.impl((srv) => {

    // Register Handlers for DELETE Response
    srv.before("DELETE", "Responses", onDeleteBeforeResponses);
    
});