namespace pntsurveyappservice.db;

using {
    cuid,
    managed,
    sap.common
} from '@sap/cds/common';

entity Option : cuid, managed {
    @title : 'Option' option_label : String;
    @title : 'Option No' option_no : Integer;
    question                       : Association to Question;
}

entity Question : managed {
    key ID                                     : UUID @(Core.Computed : true);
        @title : 'Question No' question_no     : Integer;
        @title : 'Question' question_label     : String;
        @title : 'Question Type' question_type : Association to QuestionType;
        options                                : Composition of many Option
                                                     on options.question = $self;
        surveyForm                             : Association to SurveyForm;
}

entity SurveyForm : managed {
    key ID                                          : UUID @(Core.Computed : true);
        @title : 'Form Name' survey_form_name       : String;
        @title : 'Form Version' survey_form_version : Integer;
        @title : 'Status' activation_status         : Association to ActivationStatusType;
        Questions                                   : Composition of many Question
                                                          on Questions.surveyForm = $self;
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
    @title : 'Status' filled_status          : Association to FilledStatusType;
    @title : 'Initiated By' init_by          : String;
    @title : 'Initiator Name' init_name      : String;
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

entity CommonCodeList : common.CodeList {
    key code : String(20);
}

entity QuestionType : CommonCodeList {}
entity FilledStatusType : CommonCodeList {}
entity ActivationStatusType : CommonCodeList {}
