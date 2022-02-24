sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'formsadminui/test/integration/pages/MainListReport' ,
        'formsadminui/test/integration/pages/MainObjectPage',
        'formsadminui/test/integration/OpaJourney'
    ],
    function(JourneyRunner, MainListReport, MainObjectPage, Journey) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('formsadminui') + '/index.html'
        });

        
        JourneyRunner.run(
            {
                pages: { onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage }
            },
            Journey.run
        );
        
    }
);