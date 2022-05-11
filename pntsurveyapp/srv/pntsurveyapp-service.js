/**
* Implementation for PntSurveyAppService defined in ./pntsurveyapp-service.cds
*/
const cds = require('@sap/cds');
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer');
const path = require('path');
const LOG = cds.log('customers-service')

const MAX_TOTANGO_CALLS = 1000;
const TOTANGO_BATCH_SIZE = 250;  // 1000 is the max totango will support, however we get timeouts occasionally
const BG_JOB_INTERVAL_HOURS = 12;

const { Customers, Regions, Responses, Answers, SurveyFormInstances } = cds.entities("SurveyService");

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
 * UPSERT operation on CEEs.
 * TODO(js): This does not do an UPDATE - Does it matter? Only if CEE changes names!!
 */
const upsertRegions = async (Regions, oData, oWhereCondition) => {
    const sqlResult = await SELECT`count(*)`.from(Regions).where(oWhereCondition);
    const found = Object.values(sqlResult[0])[0] !== 0;

    if (found) {
        return;
    } else {
        if (oData.market_unit !== null) {
            var regionDataInsert = { region_name: oData.market_unit };
            await INSERT.into(Regions).entries(regionDataInsert);
        }

    }
};

/**
 * Parse the customer data from Totango and return a unique
 * list of CEEs.
 */
const getRegionsUniqueList = (oCustomersData) => {
    let oRegionRecords = [];
    for (var i = 0; i < oCustomersData.length; i++) {
        if (oCustomersData[i].market_unit) {
            let RegionRecord = {
                market_unit: oCustomersData[i].market_unit
            }
            oRegionRecords.push(RegionRecord);
        }
    }
    const uniqueValuesSet = new Set();
    const filteredArr = oRegionRecords.filter((obj) => {
        const isPresentInSet = uniqueValuesSet.has(obj.market_unit);
        uniqueValuesSet.add(obj.market_unit);
        return !isPresentInSet;
    });
    return filteredArr;
};

/**
 * Synchronise customer data from Totango
 */
const performCustomerSync = async (Customers, Regions) => {
    
    const totangoCustomersApi = await cds.connect.to('TotangoCustomersApi');
    /**
     * Call Totango API in batches to read all customers (setting the
     * deleted flag to false (because if its in Totango it not deleted).
     * Update the CEE entity with UPSERT operation.
     * Save customer data into an array for processing later.
     */
    let customers = [];
    for (let i = 0; i < MAX_TOTANGO_CALLS; i++) {
        LOG.info('TOTANGO - iteration:', i + 1, 'batch size:', TOTANGO_BATCH_SIZE);
        let result = await totangoCustomersApi.post(
            '/',
            {
                "skip": i * TOTANGO_BATCH_SIZE,
                "batch": TOTANGO_BATCH_SIZE
            }
        );

        if (Array.isArray(result) && result.length == 0) {
            LOG.info('No more Totango results. Exiting API loop.');
            break;
        } else if (!Array.isArray(result)) {
            LOG.error('Result of Totango API call is not an array. An error has occured.');
            // TODO(js): Add error handling - maybe just REJECT the request!
            req.reject(403, 'Result of Totango API call is not an array. An error has occured.');
        }

        // Upsert Regions Data
        let oRegionsData = getRegionsUniqueList(result);
        for (var j = 0; j < oRegionsData.length; j++) {
            await upsertRegions(Regions, oRegionsData[j], { region_name: oRegionsData[j].market_unit })
        }

        // Cache the customers (by using apply it flattens and pushes)
        customers.push.apply(customers, result);
    }

    /**
     * Read in all the Regions's and process an upsert operation on all the
     * customers. We do this outside of the API call loop above to avoid
     * continual lookups on the db for the Regions to match each customer.
     * Here we pass in an array of all the Regions which is faster.
     */
    const allRegions = await SELECT(Regions);
    LOG.info('All Regions read back in: ', allRegions.length);

    /**
     * Update all customers as deleted. The following upsert operation
     * will then clear this flag on real/current customers in Totango.
     * This is how we handle the situation where customers have been
     * deleted from Totango - the upsert operation can't handle it.
     */
    await UPDATE(Customers).with({ deleted: true });

    // Scan through all customers to perform an UPSERT
    // Ensure to clear the deleted flag.
    for (let i = 0; i < customers.length; i++) {
        const sqlResult = await SELECT`ID`.from(Customers).where({ account_id: customers[i].account_id });
        var customerID = null;
        if (Array.isArray(sqlResult) && sqlResult.length > 0 && sqlResult[0].ID) {
            customerID = sqlResult[0].ID;
        }
        customers[i]['deleted'] = false;
        // Get Region ID
        const regionRecord = allRegions.find(e => e.region_name == customers[i].market_unit);

        // create Local Customer Variable
        var lclCustomerData = {
            customer_id: customers[i].account_id,
            customer_name: customers[i].customer_name,
            region: regionRecord.id,
            status: customers[i].status,
            deleted: customers[i].deleted
        };

        if (customerID) {
            await UPDATE(Customers, customerID).with(lclCustomerData);
        } else {
            await INSERT.into(Customers).entries(lclCustomerData);
        }
    }
    LOG.info('ALL Customers updated');
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
        host: 'smtpauth.mail.net.sap',
        port: 587, // STARTTLS
        auth: {
            user: 'pt-customer-survey-mails',
            pass: 'SAPBTP2022#'
        }
    });

    // point to the template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/'),
    };

    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))

    var mailOptions = {
        from: 'sap.btp.customersuccess.survey@sap.com', // sender address
        to: CustomerEmail, // list of receivers
        subject: "DEV : Welcome to SAP Business Technology Platform - " + Customer, // Subject line
        // text: "Test Email - Recommender App", // plain text body
        //html: "<b>Dear Customer</b>", // html body
        template: 'freemail',
        context: {
            custName: Customer, // replace {{custName}} Customer Name
            custEmail: CustomerEmail, // replace {{custEmail}} with Customer Email
            responseId: ResponseId, // replace {{responseId}} with Response Id
            cspName: CEE, // replace {{cspName}} with CEE Name
            cspEmail: CEEEmail // replace {{cspEmail}} with CEE Email
        }
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
    // return;
};

module.exports = cds.service.impl((srv) => {
    let backgroundJob = null;
    // Register Handlers for DELETE Response
    srv.before("DELETE", "Responses", onDeleteBeforeResponses);
    // Trigger Email to customer with survey Link
    srv.on("triggerEmail", onTriggerEmail);
    /**
     * updateCustomer action handler - read customers from Totango while
     * updating the list of Regions
     */
    srv.on('updateCustomers', (req) => {
        cds.env.features.assert_integrity = false;
        LOG.info('TESTING WITH SPAWN AND UNREF AT JOB END');
        let job = cds.spawn(async _ => {
            await performCustomerSync(Customers, Regions);
        });

        job.on('succeeded', () => {
            job.timer = undefined
            LOG.info('===== Sync job successful =====');
            cds.env.features.assert_integrity = true;
        });
        job.on('failed', () => {
            job.timer.unref();
            job.timer = undefined
            LOG.info('!!!!! Sync job FAILED !!!!!');
            cds.env.features.assert_integrity = true;
        });
    });

    srv.on('startJobs', (req) => {
        LOG.info('Started job for customer sync');
        backgroundJob = cds.spawn({ every: BG_JOB_INTERVAL_HOURS * 60 * 60 * 1000 /* ms */ }, async _ => {
            LOG.info('===== Performing the customer sync in a job =====');
            cds.env.features.assert_integrity = false;
            await performCustomerSync(Customers, Regions);
            LOG.info('===== Sync job completed =====');
            cds.env.features.assert_integrity = true;
        });
    });

    srv.on('stopJobs', (req) => {
        if (backgroundJob) {
            LOG.info('Cancelling the totango sync background job');
            clearInterval(backgroundJob.timer);
            backgroundJob = null;
            req.info('Totango sync job cancelled');
        } else {
            LOG.info('No scheduled job to stop. Ignoring request');
            req.warn('No scheduled job to stop. Ignoring request');
        }
    });

});