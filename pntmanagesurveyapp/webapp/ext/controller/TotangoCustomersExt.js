/**
 * Custom global action handler.
 * 
 * We are using the (editflow api)[https://ui5.sap.com/#/api/sap.fe.core.controllerextensions.EditFlow]
 * to handle the global actions, instead of directly calling `$.ajax()`.
 * This api takes care of CSRF tokens which are required if the app is running
 * within the Launchpad.
 * 
 */
sap.ui.define([
    "formsmanage/formsmanage/ext/lib/ServiceUtil",
    "sap/m/MessageToast",
], function (ServiceUtil, MessageToast) {
    return {
        /**
         * Call the OData service updateCustomers() action.
         */
        syncTotangoCustomers: function () {
            let actionName = "updateCustomers";
            // context is required for bound action only
            let parameters = {
			    //contexts: oEvent.getSource().getBindingContext(),
				model: this.getModel(),
			};
			this.editFlow.invokeAction(actionName, parameters)
                .then(function (result) {
                    MessageToast.show("Customers update running in background...");
                })
                .catch(function (error) {
                    MessageToast.show("Error: " + error);
                });
        },

        /**
         * Enable the customer sync button.
         */
        enableTotangoCustomers: function (oBindingContext, aSelectedContexts) {
            return true;
        },

        /**
         * Start a background job in the CAP service to routinely
         * sync the Totango customer data.
         */
        startJobs: function () {
            let actionName = "startJobs";
            // context is required for bound action only
            let parameters = {
			    //contexts: oEvent.getSource().getBindingContext(),
				model: this.getModel(),
			};
			this.editFlow.invokeAction(actionName, parameters)
                .then(function (result) {
                    MessageToast.show("Customers update job scheduled");
                })
                .catch(function (error) {
                    MessageToast.show("Error: " + error);
                });
        },

        /**
         * Enable the jobs button.
         */
        enableJobsButton: function (oBindingContext, aSelectedContexts) {
            return true;
        },

        /**
         * Stop any running background job.
         */
        stopJobs: function () {
            let actionName = "stopJobs";
            // context is required for bound action only
            let parameters = {
			    //contexts: oEvent.getSource().getBindingContext(),
				model: this.getModel(),
			};
			this.editFlow.invokeAction(actionName, parameters)
                .then(function (result) {
                    MessageToast.show("Customers update job cancelled");
                })
                .catch(function (error) {
                    MessageToast.show("Error: " + error);
                });
        },

        /**
         * Enable the stop jobs button.
         *
         */
        enableStopJobsButton: function (oBindingContext, aSelectedContexts) {
            return true;
        }
    }
})