sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var AdditionalCustomListReportDefinition = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'pntceesurveyapp.pntceesurveyapp',
            componentId: 'SurveyFormInstancesList',
            entitySet: 'SurveyFormInstances'
        },
        AdditionalCustomListReportDefinition
    );
});