import { Component, OnInit, ViewChild } from '@angular/core';
import { SurveydataService } from '../services/surveydata.service';
import { ResponsePayload } from '../response-payload';
import { FilledStatus } from '../filled-status-payload';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-questions',
  templateUrl: './survey-questions.component.html',
  styleUrls: ['./survey-questions.component.css']
})
export class SurveyQuestionsComponent implements OnInit {

  expiryText: boolean = false;
  answers: any[][] = [];
  sortedQuestions: any[] = [];
  submitButtonDisable: boolean = true;
  questions: any;
  payload: { questionId: any, responseId: any, answerValue: any, customerId: any }[] = [];
  surveyFormInstance: any;
  resetFlag:boolean = false;

  constructor(private surveyData: SurveydataService, public datePipe: DatePipe, private router: Router) {
    // this.resetFlag = true;
    surveyData.questionData().subscribe((data) => {
      console.log(data);
      this.questions = data;
      console.log(this.questions);

      this.sortedQuestions = this.questions.surveyFormInstance.surveyForm.Questions;

      this.sortedQuestions.sort(function (a, b) {

        a.options.sort(function (x: any, y: any) {
          return (x.option_no - y.option_no);
        });

        b.options.sort(function (m: any, n: any) {
          return (m.option_no - n.option_no);
        });

        return (a.question_no - b.question_no);

      });

      console.log(this.sortedQuestions);

      type payloadObj = {
        questionId: any,
        responseId: any,
        answerValue: any,
        customerId: any
      };

      if (this.questions.surveyFormInstance.filled_status_code == 1) {

        for (let i = 0; i < this.sortedQuestions.length; i++) {
          for (let j = 0; j < this.questions.answers.length; j++) {
            if ((this.sortedQuestions[i].question_label == this.questions.answers[j].question.question_label) && (this.sortedQuestions[i].question_type_code != 2)) {
              this.answers[i] = [this.questions.answers[j].answer];
            }
            else if ((this.sortedQuestions[i].question_label == this.questions.answers[j].question.question_label) && (this.sortedQuestions[i].question_type_code == 2)) {
              let checkboxAns = this.questions.answers[j].answer.split(' , ');
              this.answers[i] = checkboxAns;

              for(let k = 0; k < checkboxAns.length; k++) {
                let pload = {} as payloadObj;
                pload.questionId = this.sortedQuestions[i].ID;
                pload.responseId = this.questions.answers[0].response_ID;
                pload.answerValue = checkboxAns[k];
                pload.customerId = this.questions.surveyFormInstance.customer.ID;

                this.payload.push(pload);
              }

              console.log(this.payload);
            }
          }
        }
        console.log(this.answers);
      }
    });
  }

  ngOnInit(): void {
    let latest_date: any = this.datePipe.transform((new Date), 'yyyy-MM-dd');
    this.surveyData.getSurveyFormInstanceDetails().subscribe((data) => {
      this.surveyFormInstance = data;
      console.log(latest_date);
      if (latest_date > this.surveyFormInstance.expiry_date) {
        this.expiryText = true;
      }
      if ((latest_date > this.surveyFormInstance.expiry_date) || (this.payload.length == 0)) {
        this.submitButtonDisable = true;
      }
      console.log(this.submitButtonDisable);
      console.log(this.surveyData.responseId);
    });
  }

  setChecked(questionIndex: any, optionLabel: any): boolean {
  
    if ((this.questions.surveyFormInstance.filled_status_code == 1) || (this.resetFlag == false)) {
      if(this.answers[questionIndex]) {
        if (this.answers[questionIndex][0] == optionLabel) {
          return true;
        }
        else {
          return false;
        }
      }
    }
    
    return false;

    // if(this.questions.surveyFormInstance.filled_status_code == 0) {
    //   if(this.resetFlag == true) {
    //     if(this.answers[questionIndex]) {
    //       if (this.answers[questionIndex][0] == optionLabel) {
    //         return false;
    //       }
    //     }
    //   }
    // }
    // else {
    //   if(this.resetFlag == false) {
    //     if(this.answers[questionIndex]) {
    //       if (this.answers[questionIndex][0] == optionLabel) {
    //         return true;
    //       }
    //       else {
    //         return false;
    //       }
    //     }
    //   }
    //   else {
    //     return false;
    //   }
    // }
  }

  setCheckboxChecked(questionIndex: any, optionLabel: any): boolean {
    console.log("hi");
    if ((this.questions.surveyFormInstance.filled_status_code == 1) || (this.resetFlag == false)) {
      if(this.answers[questionIndex]) {

        console.log(this.answers[questionIndex].length);

        for(let i = 0; i < this.answers[questionIndex].length; i++) {
          if (this.answers[questionIndex][i] == optionLabel) {
            return true;
          }
        }
      }
    }
    return false;
  }

  setValue(questionIndex: any): any {
    if ((this.questions.surveyFormInstance.filled_status_code == 1) || (this.resetFlag == false)) {
      if (this.answers[questionIndex]) {
        return this.answers[questionIndex][0]
      }
    }
    return "";
  }

  resetForm() {
    this.resetFlag = true;
    this.answers = [];
    console.log("hi");
    this.payload = [];
  }

  populatePayload(index:any, questionId: any, responseId: any, answerValue: any, customerId: any, questionType: any, e: any) {

    let answer = [];

    this.resetFlag = false;

    console.log(e.checked);

    if (questionType != 2) {
      this.answers[index] = [answerValue];
    }
    else if ((questionType == 2) && (e.checked == true)) {

      if(this.answers[index] == undefined) {
        this.answers[index] = [answerValue];
      }
      else {
        for(let a of this.answers[index]) {
          answer.push(a);
        }
        answer.push(answerValue);
        this.answers[index] = answer;
      }
    }
    else if ((questionType == 2) && (e.checked == false)) {
      for(let i = 0; i < this.answers[index].length; i++) {
        if(this.answers[index][i] == answerValue) {
          this.answers[index].splice(i,1);
        }
      }
    }

    console.log(this.answers);

    let latest_date: any = this.datePipe.transform((new Date), 'yyyy-MM-dd');

    let payloadObj = {
      "questionId": questionId,
      "responseId": responseId,
      "answerValue": answerValue,
      "customerId": customerId
    };

    if (this.questions.surveyFormInstance.filled_status_code == 0) {
      if (questionType == 1) {
        if (this.payload.length == 0) {
          this.payload.push(payloadObj);
          console.log(this.payload);
        }
        else {
          for (let i = 0; i < this.payload.length; i++) {
            if ((this.payload[i].customerId == customerId) && (this.payload[i].questionId == questionId)) {
              this.payload.splice(i, 1);
            }
          }
          this.payload.push(payloadObj);
          console.log(this.payload);
        }
      }
      else if (questionType == 2) {
        let flag = 0;
        if (this.payload.length == 0) {
          this.payload.push(payloadObj);
          console.log(this.payload);
        }
        else {
          for (let i = 0; i < this.payload.length; i++) {
            if ((this.payload[i].customerId == customerId) && (this.payload[i].questionId == questionId) && (this.payload[i].answerValue == answerValue) && (e.checked == false)) {
              this.payload.splice(i, 1);
              flag = 1;
            }
          }
          if (flag == 0) {
            this.payload.push(payloadObj);
          }
          console.log(this.payload);
        }
      }
      else if (questionType == 3) {
        if (this.payload.length == 0) {
          this.payload.push(payloadObj);
          console.log(this.payload);
        }
        else {
          for (let i = 0; i < this.payload.length; i++) {
            if ((this.payload[i].customerId == customerId) && (this.payload[i].questionId == questionId)) {
              this.payload.splice(i, 1);
            }
          }
          if (answerValue != "") {
            this.payload.push(payloadObj);
          }
          console.log(this.payload);
        }
      }
    }
    else {
      if (questionType == 1) {
        if (this.payload.length == 0) {
          this.payload.push(payloadObj);
          console.log(this.payload);
        }
        else {
          for (let i = 0; i < this.payload.length; i++) {
            if ((this.payload[i].customerId == customerId) && (this.payload[i].questionId == questionId)) {
              this.payload.splice(i, 1);
            }
          }
          this.payload.push(payloadObj);
          console.log(this.payload);
        }
      }
      else if (questionType == 2) {
        let flag = 0;
        if ((this.payload.length == 0) && (e.checked == true)) {
          this.payload.push(payloadObj);
          console.log(this.payload);
        }
        else {
          if (e.checked == false) {
            for (let i = 0; i < this.payload.length; i++) {
              if ((this.payload[i].customerId == customerId) && (this.payload[i].questionId == questionId) && (this.payload[i].answerValue == answerValue) && (e.checked == false)) {
                this.payload.splice(i, 1);
                flag = 1;
              }
            }
          }
          if ((flag == 0) && (e.checked == true)) {
            this.payload.push(payloadObj);
          }
          console.log(this.payload);
        }
      }
      else if (questionType == 3) {
        if (this.payload.length == 0) {
          this.payload.push(payloadObj);
          console.log(this.payload);
        }
        else {
          for (let i = 0; i < this.payload.length; i++) {
            if ((this.payload[i].customerId == customerId) && (this.payload[i].questionId == questionId)) {
              this.payload.splice(i, 1);
            }
          }
          if (answerValue != "") {
            this.payload.push(payloadObj);
          }
          console.log(this.payload);
        }
      }
    }

    if ((this.payload.length != 0) && (latest_date <= this.surveyFormInstance.expiry_date)) {
      this.submitButtonDisable = false;
    }
    else {
      this.submitButtonDisable = true;
    }
  }

  submitForm() {
    let status = {} as FilledStatus;
    let flag: boolean;
    let rp = {} as ResponsePayload;
    let checkboxResponse: ResponsePayload[] = [];

    for (let i = 0; i < this.payload.length; i++) {
      flag = false;
      for (let j = 0; j < this.questions.answers.length; j++) {
        if ((this.payload[i].responseId == this.questions.answers[j].response_ID) && (this.payload[i].questionId == this.questions.answers[j].question_ID)) {
          if (this.questions.answers[j].question.question_type_code == 2) {
            rp = {} as ResponsePayload;
            if (checkboxResponse.length == 0) {
              rp.ID = this.questions.answers[j].ID;
              rp.answer = this.payload[i].answerValue;
              rp.response_ID = this.payload[i].responseId;
              rp.question_ID = this.payload[i].questionId;
              checkboxResponse.push(rp);
              console.log(checkboxResponse);
            }
            else {
              for (let k = 0; k < checkboxResponse.length; k++) {
                if ((checkboxResponse[k].question_ID == this.payload[i].questionId) && (checkboxResponse[k].response_ID == this.payload[i].responseId)) {
                  checkboxResponse[k].answer = checkboxResponse[k].answer + " , " + this.payload[i].answerValue;
                  flag = true;
                  console.log(checkboxResponse);
                  break;
                }
              }
              if (flag == false) {
                rp.ID = this.questions.answers[j].ID;
                rp.answer = this.payload[i].answerValue;
                rp.response_ID = this.payload[i].responseId;
                rp.question_ID = this.payload[i].questionId;
                checkboxResponse.push(rp);
                console.log(checkboxResponse);
              }
            }
          }
          else {
            rp = {} as ResponsePayload;
            rp.ID = this.questions.answers[j].ID;
            rp.answer = this.payload[i].answerValue;
            rp.response_ID = this.payload[i].responseId;
            rp.question_ID = this.payload[i].questionId;

            this.surveyData.updateResponse(rp).subscribe((result) => {
              console.log(result);
            });
            console.log(rp);
          }
        }
      }
    }
    console.log(checkboxResponse);
    for (let cr of checkboxResponse) {
      this.surveyData.updateResponse(cr).subscribe((result) => {
        console.log(result);
      });
    }
    status.filled_status_code = "1";
    this.surveyData.updateFilledStatus(status).subscribe((result) => {
      console.log(result);
    });
    this.router.navigate(['/submit', this.questions.surveyFormInstance.customer.customer_name]);
  }
}
