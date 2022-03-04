using {pntsurveyappservice.db as data} from '../db/data-model';

@(path : '/pntsurvey')
service SurveyService {

    entity Questions           as projection on data.Question;
    entity Options             as projection on data.Option;
    entity Answers             as projection on data.Answer;
    entity Responses           as projection on data.Response;

    @odata.draft.enabled  @cds.odata.valuelist
    entity SurveyForms         as projection on data.SurveyForm;

    entity SurveyFormInstances as projection on data.SurveyFormInstance;

    @cds.odata.valuelist
    entity Regions             as projection on data.Region;

    @cds.odata.valuelist
    entity Customers           as projection on data.Customer;

    function triggerEmail(ResponseId : type of Responses : ID, Email : type of SurveyFormInstances : customer_email, Customer : type of Customers : customer_name) returns String;
}
