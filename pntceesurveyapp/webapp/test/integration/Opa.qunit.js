sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'pntceesurveyapp/pntceesurveyapp/test/integration/pages/MainListReport' ,
        'pntceesurveyapp/pntceesurveyapp/test/integration/pages/MainObjectPage',
        'pntceesurveyapp/pntceesurveyapp/test/integration/OpaJourney'
    ],
    function(JourneyRunner, MainListReport, MainObjectPage, Journey) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('pntceesurveyapp/pntceesurveyapp') + '/index.html'
        });

        
        JourneyRunner.run(
            {
                pages: { onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage }
            },
            Journey.run
        );
        
    }
);