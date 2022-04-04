import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmSubmissionComponent } from './confirm-submission/confirm-submission.component';
import { SurveyQuestionsComponent } from './survey-questions/survey-questions.component';

const routes: Routes = [
  {
    path: '',
    component: SurveyQuestionsComponent
  },
  {
    path: 'submit/:name',
    component: ConfirmSubmissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
