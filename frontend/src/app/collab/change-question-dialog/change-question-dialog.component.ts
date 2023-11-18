import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from "@angular/material/dialog"

@Component({
  selector: 'app-change-question-dialog',
  templateUrl: './change-question-dialog.component.html',
  styleUrls: ['./change-question-dialog.component.css']
})
export class ChangeQuestionDialogComponent {

  constructor(public dialogRef: MatDialogRef<ChangeQuestionDialogComponent>) {}
  confirmMessage: any;

}
