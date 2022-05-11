sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'formsmanage/formsmanage/test/integration/pages/MainListReport' ,
        'formsmanage/formsmanage/test/integration/pages/MainObjectPage',
        'formsmanage/formsmanage/test/integration/OpaJourney'
    ],
    function(JourneyRunner, MainListReport, MainObjectPage, Journey) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('formsmanage/formsmanage') + '/index.html'
        });

        JourneyRunner.run(
            {
                pages: { onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage }
            },
            Journey.run
        );
    }
);