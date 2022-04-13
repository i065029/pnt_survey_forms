using SurveyService as service from './pntsurveyapp-service';

annotate service.Responses @(UI : {
    HeaderInfo           : {
        TypeName       : 'Survey Form',
        TypeNamePlural : 'Recommender Forms',

        Title          : {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : surveyFormInstance.filled_status.name
        },
        Description    : {
            $Type : 'UI.DataField',
            Label : 'Survey Form',
            Value : surveyFormInstance.ID
        }
    },
    SelectionFields      : [
        surveyFormInstance.region.region_name,
        surveyFormInstance.customer.customer_id,
        surveyFormInstance.customer.customer_name,
        surveyFormInstance.init_by,
        surveyFormInstance.init_name,
        surveyFormInstance.customer_email,
        surveyFormInstance.surveyForm.survey_form_name,
        surveyFormInstance.filled_status_code
    ],
    LineItem             : [
        {
            Value : surveyFormInstance_ID,
            Label : 'Form ID'
        },
        {
            Value : surveyFormInstance.region.region_name,
            Label : 'Region'
        },
        {
            Value : surveyFormInstance.customer.customer_id,
            Label : 'Customer No'
        },
        {
            Value : surveyFormInstance.customer.customer_name,
            Label : 'Customer Name'
        },
        {
            Value : surveyFormInstance.customer_email,
            Label : 'Customer Email'
        },
        {
            Value : surveyFormInstance.init_by,
            Label : 'Initiate By'
        },
        {
            Value : surveyFormInstance.init_name,
            Label : 'Initiator Name'
        },
        {
            Value : surveyFormInstance.filled_status.name,
            Label : 'Status'
        },
        {
            Value : surveyFormInstance.expiry_date,
            Label : 'Expiry Date'
        },
        {
            Value : surveyFormInstance.reminder_interval,
            Label : 'Reminder(In Days)'
        },
        {
            Value : surveyFormInstance.createdAt,
            Label : 'Initiated On'
        },
        {
            Value : surveyFormInstance.modifiedAt,
            Label : 'Last Updated'
        },
        {
            Value : surveyFormInstance.surveyForm.survey_form_name,
            Label : 'Form Template'
        },
        {
            Value : surveyFormInstance.surveyForm.survey_form_version,
            Label : 'Version'
        },
        {
            $Type : 'UI.DataFieldWithUrl',
            Label : 'Response',
            Value : ID,
            Url   : {$edmJson : {
                $Apply    : [
                    // 'https://survey-form-customer-persona-insightful-wombat-gb.cfapps.ap10.hana.ondemand.com/?id=', // DEV
                    'https://survey-form-customer-persona-courteous-gorilla-to.cfapps.ap10.hana.ondemand.com/?id=', //PRD
                    {$Path : 'ID', },
                ],
                $Function : 'odata.concat',
            }, },
        }
    ],
    Facets               : [

        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'General Details',
            Target : '@UI.FieldGroup#General',
            ID     : 'general'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Form Details',
            Target : '@UI.FieldGroup#Form',
            ID     : 'form'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Additional Details',
            Target : '@UI.FieldGroup#Addition',
            ID     : 'addition'
        }

    ],
    FieldGroup #General  : {Data : [
        {
            Value : surveyFormInstance.init_by,
            Label : 'Initiated By'
        },
        {
            Value : surveyFormInstance.init_name,
            Label : 'Initiator Name'
        },
        {
            Value : createdAt,
            Label : 'Initiated On'
        },
        {
            Value : modifiedAt,
            Label : 'Last Updated'
        }
    ]},
    FieldGroup #Form     : {Data : [
        {
            Value : surveyFormInstance.region.region_name,
            Label : 'Region'
        },
        {
            Value : surveyFormInstance.customer.customer_id,
            Label : 'Customer No'
        },
        {
            Value : surveyFormInstance.customer.customer_name,
            Label : 'Customer Name'
        },
        {
            Value : surveyFormInstance.customer_email,
            Label : 'Customer Email'
        },
        {
            Value : surveyFormInstance.expiry_date,
            Label : 'Expiry Date'
        },
        {
            Value : surveyFormInstance.reminder_interval,
            Label : 'Reminder(In Days)'
        }
    ]},
    FieldGroup #Addition : {Data : [
        {
            Value : surveyFormInstance.surveyForm.survey_form_name,
            Label : 'Form Template'
        },
        {
            Value : surveyFormInstance.surveyForm.survey_form_version,
            Label : 'Version'
        },
        {
            $Type : 'UI.DataFieldWithUrl',
            Label : 'Response',
            Value : 'View Survey Form',
            Url   : {$edmJson : {
                $Apply    : [
                    // 'https://survey-form-customer-persona-insightful-wombat-gb.cfapps.ap10.hana.ondemand.com/?id=', //DEV
                    'https://survey-form-customer-persona-courteous-gorilla-to.cfapps.ap10.hana.ondemand.com/?id=', //PRD
                    {$Path : 'ID', },
                ],
                $Function : 'odata.concat',
            }, },
        }
    ]}
});

annotate service.SurveyFormInstances with @title : 'Survey Forms' {
    ID            @title                         : 'Survey Form';
    filled_status @title                         : 'Status'  @Common.Text : filled_status.name  @Common.TextArrangement : #TextOnly;
}
