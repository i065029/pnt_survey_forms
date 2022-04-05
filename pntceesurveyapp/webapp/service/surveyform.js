sap.ui.define([], function () {
    "use strict";

    var surveyform = {

        getUser: function (oData) {
            return new Promise(function (oResolve, oReject) {
                var sPath = "./user-api/currentUser";
                $.ajax({
                    type: "GET",
                    url: sPath,
                    data: JSON.stringify(oData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: oResolve,
                    error: oReject
                });
            });
        },

        createsurveyforminstance: function (oData) {
            return new Promise(function (oResolve, oReject) {
                var sPath = "./pntsurvey/SurveyFormInstances";
                $.ajax({
                    type: "POST",
                    url: sPath,
                    data: JSON.stringify(oData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: oResolve,
                    error: oReject
                });
            });
        },

        createresponse: function (oData) {
            return new Promise(function (oResolve, oReject) {
                var sPath = "./pntsurvey/Responses";
                $.ajax({
                    type: "POST",
                    url: sPath,
                    data: JSON.stringify(oData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: oResolve,
                    error: oReject
                });
            });
        },

        createanswer: function (oData) {
            return new Promise(function (oResolve, oReject) {
                var sPath = "./pntsurvey/Answers";
                $.ajax({
                    type: "POST",
                    url: sPath,
                    data: JSON.stringify(oData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: oResolve,
                    error: oReject
                });
            });
        },

        getRegions: function (oData) {
            return new Promise(function (oResolve, oReject) {
                var sPath = "./pntsurvey/Regions";
                $.ajax({
                    type: "GET",
                    url: sPath,
                    data: JSON.stringify(oData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: oResolve,
                    error: oReject
                });
            });
        },

        getCustomers: function (oData) {
            return new Promise(function (oResolve, oReject) {
                var sPath = "./pntsurvey/Customers";
                $.ajax({
                    type: "GET",
                    url: sPath,
                    data: JSON.stringify(oData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: oResolve,
                    error: oReject
                });
            });
        },

        getCustomerBasedOnReason: function (region_id, oData) {
            return new Promise(function (oResolve, oReject) {
                var sPath = "./pntsurvey/Regions/" + region_id + "/customers";
                $.ajax({
                    type: "GET",
                    url: sPath,
                    data: JSON.stringify(oData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: oResolve,
                    error: oReject
                });
            });
        },

        getSurveyForms: function (oData) {
            return new Promise(function (oResolve, oReject) {
                var sPath = "./pntsurvey/SurveyForms?filter=activation_status_code eq '0'";
                $.ajax({
                    type: "GET",
                    url: sPath,
                    data: JSON.stringify(oData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: oResolve,
                    error: oReject
                });
            });
        },

        getSurveyFormQuestionsBasedOnResponse: function (response_id, oData) {
            return new Promise(function (oResolve, oReject) {
                var sPath = "./pntsurvey/Responses/" + response_id + "?$expand=surveyFormInstance($expand=surveyForm($expand=Questions))";
                $.ajax({
                    type: "GET",
                    url: sPath,
                    data: JSON.stringify(oData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: oResolve,
                    error: oReject
                });
            });
        },

        UIToDB: function (oData) {
            return oData;
        },

        DBToUI: function (oData) {
            return oData;
        }

    };
    return surveyform;
});