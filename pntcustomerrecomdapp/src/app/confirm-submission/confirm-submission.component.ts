import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-submission',
  templateUrl: './confirm-submission.component.html',
  styleUrls: ['./confirm-submission.component.css']
})
export class ConfirmSubmissionComponent implements OnInit {

  customerName:any = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap.get('name'));
    this.customerName = this.route.snapshot.paramMap.get('name');
  }

}
