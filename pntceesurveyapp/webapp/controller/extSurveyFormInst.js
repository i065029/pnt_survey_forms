sap.ui.define([
    "pntceesurveyapp/pntceesurveyapp/service/surveyform",
    "pntceesurveyapp/pntceesurveyapp/lib/ServiceUtil",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
], function (surveyform, ServiceUtil, JSONModel, MessageToast) {
    return {

        manageSurveyFormInst: function () {
            var that = this;
            this._surveyFormCreationDialog = function (bisOpen) {
                // Logic to Manage & Create Projects
                if (!this._oDialog) {
                    sap.ui.core.Fragment.load({
                        name: "pntceesurveyapp.pntceesurveyapp.fragment.SurveyFormInstCreate",
                        type: "XML",
                        controller: this
                    }).then(function (_oDialog) {
                        this._oDialog = _oDialog;
                        this._oDialog.setModel(new JSONModel(), "surveyforminstances");

                        // Update Region Value List
                        surveyform.getRegions().then(function (oData) {
                            var selControlRegion = that._oDialog.getContent()[0].getContent()[1];
                            for (var region = 0; region < oData.value.length; region++) {
                                var newItemPso = new sap.ui.core.ListItem({
                                    key: oData.value[region].ID,
                                    text: oData.value[region].region_name,
                                    icon: "sap-icon://activity-individual"
                                });
                                selControlRegion.addItem(newItemPso);
                            }
                        }).catch(ServiceUtil.errorHandler);

                        // Update Surveyform Value List
                        surveyform.getSurveyForms().then(function (oData) {
                            var selControlSurveyForms = that._oDialog.getContent()[0].getContent()[5];
                            for (var surveyform = 0; surveyform < oData.value.length; surveyform++) {
                                var newItemPso = new sap.ui.core.ListItem({
                                    key: oData.value[surveyform].ID,
                                    text: oData.value[surveyform].survey_form_name,
                                    additionalText: oData.value[surveyform].survey_form_version,
                                    icon: "sap-icon://activity-individual"
                                });
                                selControlSurveyForms.addItem(newItemPso);
                            }
                        }).catch(ServiceUtil.errorHandler);

                        this._view.addDependent(_oDialog);
                        _oDialog.open();
                    }.bind(this));
                } else {
                    if (bisOpen) {
                        this._oDialog.setModel(new JSONModel(), "project");
                        this._oDialog.open();
                    } else {
                        this._oDialog.close();
                    }
                }
            }

            this.onChangeRegion = function (oEvent) {
                var selectedRegion = oEvent.getParameters().selectedItem.getProperty("key");
                var selectCustomer = that._oDialog.getContent()[0].getContent()[3];
                selectCustomer.setSelectedKey(undefined);
                selectableItems = selectCustomer.getSelectableItems();
                for (var si = 0; si < selectableItems.length; si++) {
                    if (selectableItems[si].getProperty("key") !== 'Blank') {
                        selectableItems[si].destroy();
                    }
                }
                // Update Customer Value List
                surveyform.getCustomerBasedOnReason(selectedRegion).then(function (oData) {
                    var selControlCustomer = that._oDialog.getContent()[0].getContent()[3];
                    for (var customer = 0; customer < oData.value.length; customer++) {
                        var newItemPso = new sap.ui.core.ListItem({
                            key: oData.value[customer].ID,
                            text: oData.value[customer].customer_name,
                            additionalText: oData.value[customer].customer_id,
                            icon: "sap-icon://activity-individual"
                        });
                        selControlCustomer.addItem(newItemPso);
                    }
                }).catch(ServiceUtil.errorHandler);
            }

            this.onChangeCustomerEmail = function (oEvent) {
                var textEmail = oEvent.getParameters().newValue;
                var newTextEmail = textEmail.replace(",", ";");
                oEvent.getSource().setValue(newTextEmail);
            }

            this.onCreateSurveyFormInst = function () {
                var oData = this._oDialog.getModel("surveyforminstances").getData();
                // Validation for required field
                var bValid = true;
                if (!this._oDialog.getModel("surveyforminstances").getData()['region']) { bValid = false; }
                if (!this._oDialog.getModel("surveyforminstances").getData()['customer']) { bValid = false; }
                if (!this._oDialog.getModel("surveyforminstances").getData()['surveyForm']) { bValid = false; }
                if (!this._oDialog.getModel("surveyforminstances").getData()['customer_email']) { bValid = false; }
                if (!this._oDialog.getModel("surveyforminstances").getData()['expiry_date']) { bValid = false; }

                if (bValid = false) {
                    return;
                }

                var customerEmailArray = this._oDialog.getModel("surveyforminstances").getData()['customer_email'].split(";");
                var customerEmail = [];
                for (var cea = 0; cea < customerEmailArray.length; cea++) {
                    var emailText = customerEmailArray[cea].replace(/^\s+|\s+$/gm, '');
                    if (emailText !== '') {
                        customerEmail.push(emailText);
                    }
                }

                var expiry_date = this._oDialog.getModel("surveyforminstances").getData()['expiry_date'];
                var expiryDate = expiry_date.toLocaleDateString().split("/")[2] + "-" +
                    expiry_date.toLocaleDateString().split("/")[1] + "-" +
                    expiry_date.toLocaleDateString().split("/")[0];
                var reminder_interval = 0;
                reminder_interval = parseInt(this._oDialog.getModel("surveyforminstances").getData()['reminder_interval']);
                if (reminder_interval === NaN) { reminder_interval = 0 }

                for (var ce = 0; ce < customerEmail.length; ce++) {
                    // Prepare POST Payload for Survey Form Instence
                    var postDataSurveyFormInstance = {
                        "customer_email": customerEmail[ce],
                        "expiry_date": expiryDate,
                        "reminder_interval": reminder_interval,
                        "filled_status": false,
                        "region_ID": this._oDialog.getModel("surveyforminstances").getData()['region'],
                        "customer_ID": this._oDialog.getModel("surveyforminstances").getData()['customer'],
                        "surveyForm_ID": this._oDialog.getModel("surveyforminstances").getData()['surveyForm']
                    };

                    // Create Survey Form Instance for customer contact email
                    surveyform.createsurveyforminstance(postDataSurveyFormInstance).then(function (oData) {
                        var lclSurveyFormInstance = oData.ID;
                        var successMessage = 'Survey Form Instance: ' + lclSurveyFormInstance + ' Triggered';
                        // Prepare POST Payload for Response
                        var postResponse = {
                            "surveyFormInstance_ID": lclSurveyFormInstance
                        };
                        // Create Response
                        surveyform.createresponse(postResponse).then(function (oData) {
                            var lclResponseId = oData.ID;
                            // Get Survey form Questionnaire
                            surveyform.getSurveyFormQuestionsBasedOnResponse(lclResponseId).then(function (oData) {
                                var lclResponse_Id = oData.ID;
                                var Questions = oData.surveyFormInstance.surveyForm.Questions;
                                for (var q = 0; q < Questions.length; q++) {
                                    var qId = oData.surveyFormInstance.surveyForm.Questions[q].ID;
                                    // Prepare POST Payload for Answer
                                    var postAnswer = {
                                        "response_ID": lclResponse_Id,
                                        "question_ID": qId
                                    };
                                    // Create Answer
                                    surveyform.createanswer(postAnswer).then(function (oData) {
                                        var answerId = oData.ID;
                                    }).catch(ServiceUtil.errorHandler);
                                }
                                // Refresh Table Model
                                sap.ui.getCore().byId("pntceesurveyapp.pntceesurveyapp::SurveyFormInstancesList--fe::table::Responses::LineItem").getModel().refresh()
                            }).catch(ServiceUtil.errorHandler);
                        }).catch(ServiceUtil.errorHandler);

                        MessageToast.show(successMessage);
                    }).catch(ServiceUtil.errorHandler);

                }
                that._surveyFormCreationDialog(false);
            }

            this.onDialogClose = function () {
                that._surveyFormCreationDialog(false);
            }

            this._surveyFormCreationDialog(true);
        },

    }
})