sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'formsceeui/formsceeui/test/integration/pages/MainListReport' ,
        'formsceeui/formsceeui/test/integration/pages/MainObjectPage',
        'formsceeui/formsceeui/test/integration/OpaJourney'
    ],
    function(JourneyRunner, MainListReport, MainObjectPage, Journey) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('formsceeui/formsceeui') + '/index.html'
        });

        
        JourneyRunner.run(
            {
                pages: { onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage }
            },
            Journey.run
        );
        
    }
);