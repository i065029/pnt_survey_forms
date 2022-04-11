using {pntsurveyappservice.db as data} from '../db/data-model';

@(path : '/pntsurvey')
service SurveyService {

    entity Questions           as projection on data.Question excluding {
        createdBy,
        modifiedBy
    };

    entity Options             as projection on data.Option excluding {
        createdBy,
        modifiedBy
    };

    entity Answers             as projection on data.Answer excluding {
        createdBy,
        modifiedBy
    };

    entity Responses           as projection on data.Response;

    @odata.draft.enabled  @cds.odata.valuelist
    entity SurveyForms         as projection on data.SurveyForm excluding {
        createdBy,
        modifiedBy
    };

    entity SurveyFormInstances as projection on data.SurveyFormInstance excluding {
        createdBy,
        modifiedBy
    };

    @cds.odata.valuelist
    entity Regions             as projection on data.Region excluding {
        createdBy,
        modifiedBy
    };

    @cds.odata.valuelist
    entity Customers           as projection on data.Customer excluding {
        createdBy,
        modifiedBy
    };

    function triggerEmail(
        ResponseId : type of Responses : ID, 
        CustomerEmail : type of SurveyFormInstances : customer_email, 
        Customer : type of Customers : customer_name, 
        CEE : type of SurveyFormInstances : init_name, 
        CEEEmail : type of SurveyFormInstances : init_by
    ) returns String;
}
