sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
    "sap/m/Input",
    "sap/base/i18n/ResourceBundle"
], function (MessageBox, Dialog, DialogType, Button, ButtonType, Text, Input, ResourceBundle) {
    "use strict";

    const oI18n = new ResourceBundle.create({
        async: false,
        bundleUrl: '../i18n/i18n.properties'
    });

    var oObject = {
        /**
         * Generic error handler to extract message and display error message box
         * 
         * @param {Object} oError Error ojbect
         */
        errorHandler: function (oError) {
            var sError = oI18n.getText("unknownError");
            if (!oError || oError === undefined) return sError;

            switch (typeof oError) {
                case "object":
                    // Optimistic error text extraction
                    if (oError.hasOwnProperty("error") && typeof oError.error === "string") {
                        sError = oError.error;
                    } else if (oError.hasOwnProperty("responseJSON") && oError.responseJSON) {
                        oError = oError.responseJSON;
                        if (oError.hasOwnProperty("error") && oError.error.hasOwnProperty("message")) {
                            sError = oError.error.message;
                        } else {
                            sError = JSON.stringify(oError);
                        }
                    } else if (oError.hasOwnProperty("responseText") && typeof oError.responseText === "string") {
                        sError = oError.responseText;
                    } else if (oError.hasOwnProperty("message")) {
                        sError = oError.message;
                    } else {
                        sError = JSON.stringify(oError);
                    }
                    break;
                case "string":
                    sError = oError;
                    break;
            };

            MessageBox.error(sError);
        },


        /**
         * Generic handler for delete message box operations
         * 
         * @param {Function} oOptions.fnDeleteHandler Delete press callback 
         * @param {String} oOptions.fnDeleteHandler Delete text
         * @param {String} oOptions.sIdentifier Delete text identifier 
         */
        deleteDialog: function (oOptions) {
            var { fnDeleteHandler, sText, sIdentifier } = oOptions;

            if (Array.isArray(sIdentifier)) {
                sIdentifier = sIdentifier.join(", ");
            } else {
                sIdentifier = sIdentifier || oI18n.getText("thisItem");
            }
            sText = sText || oI18n.getText("deleteDialog", [sIdentifier]);

            var oText = new Text({ text: sText });
            oText.addStyleClass("sapUiSmallMargin");

            var oDialog = new Dialog({
                type: DialogType.Error,
                title: oI18n.getText("delete"),
                content: oText,
                beginButton: new Button({
                    type: ButtonType.Negative,
                    text: oI18n.getText("delete"),
                    press: function () {
                        oDialog.close();
                        if (fnDeleteHandler) fnDeleteHandler.apply(this);
                    }
                }),
                endButton: new Button({
                    text: oI18n.getText("cancel"),
                    press: function () {
                        oDialog.close();
                    }
                })
            });
            oDialog.open();
        },


        /**
         * Generic handler for text dialog with input
         * 
         * @param {Function} oOptions.fnCopyHandler OK press callback 
         * @param {String} oOptions.sAction Button text
         * @param {String} oOptions.sIdentifier Text identifier 
         * @param {String} oOptions.sPrefix Text input prefix
         * @param {String} oOptions.sPlaceholder Input placeholder optional 
         */
        textDialog: function (oOptions) {
            var { fnCopyHandler, sIdentifier, sAction, sPrefix, sPlaceholder = "required" } = oOptions;

            var oText = new Text({ text: sIdentifier });
            var oInput = new Input({
                placeholder: sPlaceholder,
                liveChange: function (oEvent) {
                    var sText = oEvent.getParameter("value");
                    if (sPrefix && sPrefix !== null && sPrefix !== "") {
                        var oPrfixLen = sPrefix.length;
                        if (sText.substring(0, oPrfixLen) !== sPrefix) {
                            sText = sPrefix + sText;
                        }
                        sText = sText.replace(/[^a-zA-Z0-9_]/g, "");
                        oEvent.getSource().setValue(sText);
                    }
                    oDialog.getBeginButton().setEnabled(sText.length > 0);
                }
            });

            var oDialog = new Dialog({
                type: DialogType.Message,
                title: sAction,
                content: [oText, oInput],
                beginButton: new Button({
                    type: ButtonType.Accept,
                    text: sAction,
                    press: function () {
                        if (oInput.getValue() === "") {
                            oInput.setValueState("Error");
                            return;
                        }
                        oDialog.close();
                        if (fnCopyHandler) fnCopyHandler.apply(this, [oInput.getValue()]);
                    },
                    enabled: false
                }),
                endButton: new Button({
                    text: oI18n.getText("cancel"),
                    press: function () {
                        oDialog.close();
                    }
                })
            });

            oDialog.open();
        },


        /**
         * Generic function to create a warning dialog with an ok callback
         * 
         * @param {Function} oOptions.fnOKHandler - Function to execute when OK is pressed
         * @param {String} oOptions.sIdentifier - Warning message to show, defaults to "Are you sure you want to navigate away? Unsaved data will be lost."
         */
        warningDialog: function (oOptions) {
            var { fnOKHandler, sIdentifier } = oOptions;
            sIdentifier = sIdentifier || oI18n.getText("warningNavigateAway");

            var oText = new Text({ text: sIdentifier });

            var oDialog = new Dialog({
                type: DialogType.Message,
                title: oI18n.getText("warning"),
                content: [oText],
                beginButton: new Button({
                    type: ButtonType.Attention,
                    text: oI18n.getText("ok"),
                    press: function () {
                        oDialog.close();
                        if (fnOKHandler) fnOKHandler.apply(this);
                    }
                }),
                endButton: new Button({
                    text: oI18n.getText("cancel"),
                    press: function () {
                        oDialog.close();
                    }
                })
            });

            oDialog.open();
        }
    };

    return oObject;
});