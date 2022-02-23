using SurveyService as service from './pntsurveyapp-service';

annotate service.SurveyForms @(UI : {

   HeaderInfo       : {
        TypeName       : 'SurveyForm',
        TypeNamePlural : 'SurveyForms',
      
        Title          : {
            $Type : 'UI.DataField',
            Value :  survey_form_name
        },
     /*   Description    : {
            $Type : 'UI.DataField',
            Value : survey_form_version  //it can be a discription of the form instead
        } */
    },

    SelectionFields  : [ survey_form_name, activation_status],
    // Presentation in the List Report
    LineItem         : [

        {
            Value : survey_form_name,
            Label : 'Form Name'
        },
        {
            Value : survey_form_version,
            Label : 'Version'
        },
        {
            Value : activation_status,
            Label : 'Status'
        }
        //we can add a discription as well
    ],

    //    PresentationVariant : {Visualizations : ['@UI.LineItem', ], },

    Facets           : [
        
    {$Type  : 'UI.ReferenceFacet', Label  : 'Form Details', Target : '@UI.FieldGroup#Forms', ID: 'forms'},
    {$Type: 'UI.ReferenceFacet', Label: 'Questions', Target: 'Questions/@UI.LineItem', ID : 'questions'}
   
    ],




    FieldGroup#Forms :


    {

    Data : [
        {
            Value : survey_form_name,
            Label : 'Form Name'
        },
        {
            Value :  survey_form_version,
            Label : 'Version'
        },
        {
            Value : activation_status,
            Label : 'Status'
        }
//we can add a discription as well
    ]}

    
    });



annotate service.Questions with {
    question_type @Common : {
        Text            : question_type.name,
        TextArrangement : #TextOnly,
        ValueListWithFixedValues
}
}

annotate service.QuestionType with {
    code @Common : {
        Text            : name,
        TextArrangement : #TextOnly
    }    @title :  'Question Type'
};



annotate service.SurveyFormQuestions @(UI : {

   HeaderInfo       : {
        TypeName       : 'Question',
        TypeNamePlural : 'Questions',
      
        Title          : {
            $Type : 'UI.DataField',
            Value :  surveyForm.survey_form_name
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : question.question_label //description of the question
        }
    },

    SelectionFields  : [],

    PresentationVariant : {
        SortOrder       : [ //Default sort order
            {
                Property    : sequence, // question serial number
                Descending  : false,
            },
        ],
        Visualizations  : ['@UI.LineItem'],
    },

    // Presentation in the List Report
    LineItem         : [

        {
            $Type : 'UI.DataField',
            Value : sequence, // question serial number
            Label : 'S No.'
        },
        {
            $Type : 'UI.DataField',
            Value : question.question_label, //description of the question
            Label : 'Question'
        },
        {
            $Type : 'UI.DataField',
            Value :  question.question_type, // type of question (check box, radio button etc.)
            Label : 'Question Type'
            
        }
    ],

    //    PresentationVariant : {Visualizations : ['@UI.LineItem', ], },

    Facets           : [
        
   //     {$Type  : 'UI.ReferenceFacet', Label  : 'Forms', Target : '@UI.FieldGroup#Forms', ID: 'forms'},
          {$Type: 'UI.ReferenceFacet', Label: 'Options', Target: 'question/@UI.LineItem', ID : 'options'}
    

    ],
    });

annotate service.Options @(UI : {

   HeaderInfo       : {
        TypeName       : 'Option',
        TypeNamePlural : 'Options',
      
        Title          : {
            $Type : 'UI.DataField',
            Value :  'Form Name'
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : question.question_label
        }
    },

    SelectionFields  : [],
    // Presentation in the List Report
    LineItem         : [

        {
            Value : option_label, // option string
            Label : 'Options'
        }
    ],

    Facets           : [  ],
    });

annotate service.Questions @(UI : {

   HeaderInfo       : {
        TypeName       : 'Question',
        TypeNamePlural : 'Questions',
      
        Title          : {
            $Type : 'UI.DataField',
            Value :  question_no
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : question_label
        }
    },

    SelectionFields  : [],

    PresentationVariant : {
        SortOrder       : [ //Default sort order
            {
                Property    : question_no, // question serial number
                Descending  : false,
            },
        ],
        Visualizations  : ['@UI.LineItem'],
    },

    // Presentation in the List Report
    LineItem         : [

        {
            $Type : 'UI.DataField',
            Value : question_no, // question serial number
            Label : 'Sequence No.'
        },
        {
            $Type : 'UI.DataField',
            Value : question_label, //description of the question
            Label : 'Question'
        },
        {
            $Type : 'UI.DataField',
            Value :  question_type_code, // type of question (check box, radio button etc.)
            Label : 'Question Type'
            
        }
    ],

    Facets           : [
         {$Type: 'UI.ReferenceFacet', Label: 'Options', Target: 'options/@UI.LineItem', ID : 'options'}    
    ],

    });
