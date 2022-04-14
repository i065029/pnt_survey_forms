import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SurveydataService {

  responseId: any;

  // Dev URL
  // baseUrl = "https://sap-cp-apj-customersuccessteam-cspindev-btpapps-pntsurv5507ee5d.cfapps.ap10.hana.ondemand.com/pntsurvey/Responses/";
  // PROD URL
  baseUrl = "https://btpcsp-prod-pntsurveyapp-srv.cfapps.ap10.hana.ondemand.com/pntsurvey/Responses/";


  constructor(private http: HttpClient) {
    console.log(window.location.search);
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get('id'));
    this.responseId = urlParams.get('id');
  }

  questionData() {
    return this.http.get(this.baseUrl+this.responseId+"?$expand=answers($expand=question($expand=options)),surveyFormInstance($expand=customer($expand=region),surveyForm($expand=Questions($expand=options)))");
  }

  updateResponse(response:any) {
    return this.http.patch(this.baseUrl+this.responseId+"/answers"+"("+response.ID+")", response);
  }

  updateFilledStatus(response:any) {
    return this.http.patch(this.baseUrl+this.responseId+"/surveyFormInstance", response);
  }

  getSurveyFormInstanceDetails() {
    return this.http.get(this.baseUrl+this.responseId+"/surveyFormInstance");
  }
}
