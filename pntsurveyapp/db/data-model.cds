namespace pntsurveyappservice.db;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Option : cuid, managed {
    @title : 'Option' option_label : String;
    question                       : Association to Question;
}

entity Question : cuid, managed {
    @title : 'Question No' question_no     : Integer;
    @title : 'Question' question_label     : String;
    @title : 'Question Type' question_type : question_type;
    options                                : Composition of many Option
                                                 on options.question = $self;
}

entity SurveyForm : cuid, managed {
    @title : 'Form Name' survey_form_name       : String;
    @title : 'Form Version' survey_form_version : Integer;
    @title : 'Status' activation_status         : Boolean;
    surveyFormQuestion                          : Association to many SurveyFormQuestion
                                                      on surveyFormQuestion.surveyForm = $self;
}

entity SurveyFormQuestion : cuid, managed {
    @title : 'Sequence' sequence : Integer;
    question                     : Association to Question;
    surveyForm                   : Association to SurveyForm;
}

entity Region : cuid, managed {
    @title : 'Region' region_name : String;
    customers                     : Association to many Customer
                                        on customers.region = $self;
}

entity Customer : cuid, managed {
    @title : 'Customer No' customer_id : String;
    @title : 'Customer' customer_name  : String;
    region                             : Association to Region;
}

entity SurveyFormInstance : cuid, managed {
    @title : 'Customer Email' customer_email : String;
    @title : 'Expiry Date' expiry_date       : Date;
    @title : 'Reminder' reminder_interval    : Integer;
    @title : 'Status' filled_status          : Boolean;
    region                                   : Association to Region;
    customer                                 : Association to Customer;
    surveyForm                               : Association to SurveyForm;
}

entity Response : cuid, managed {
    answers            : Association to many Answer
                             on answers.response = $self;
    surveyFormInstance : Association to one SurveyFormInstance;
}

entity Answer : cuid, managed {
    @title : 'Answer' answer : String;
    response                 : Association to Response;
    question                 : Association to Question;
}

type question_type : Integer enum {
    Radiobutton = 1;
    Checkbox    = 2;
    Textbox     = 3;
}
