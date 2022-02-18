sap.ui.define([], function () {
    "use strict";

    var surveyform = {
        createsurveyforminstance: function (oData) {
            return new Promise(function (oResolve, oReject) {
                $.ajax({
                    type: "POST",
                    url: "./pntsurvey/SurveyFormInstances",
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
                $.ajax({
                    type: "POST",
                    url: "./pntsurvey/Responses",
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
                $.ajax({
                    type: "POST",
                    url: "./pntsurvey/Answers",
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
                $.ajax({
                    type: "GET",
                    url: "./pntsurvey/Regions",
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
                $.ajax({
                    type: "GET",
                    url: "./pntsurvey/Customers",
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
                $.ajax({
                    type: "GET",
                    url: "./pntsurvey/Regions/" + region_id + "/customers",
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
                $.ajax({
                    type: "GET",
                    url: "./pntsurvey/SurveyForms",
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
                $.ajax({
                    type: "GET",
                    url: "./pntsurvey/Responses/" + response_id + "?$expand=surveyFormInstance($expand=surveyForm($expand=surveyFormQuestion))",
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