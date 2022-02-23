sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'formadminui/test/integration/pages/MainListReport' ,
        'formadminui/test/integration/pages/MainObjectPage',
        'formadminui/test/integration/OpaJourney'
    ],
    function(JourneyRunner, MainListReport, MainObjectPage, Journey) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('formadminui') + '/index.html'
        });

        
        JourneyRunner.run(
            {
                pages: { onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage }
            },
            Journey.run
        );
        
    }
);