import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../_services/history.service';
import { QuestionService } from '../_services/question.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  attempts: any;
  err: any;
  questions: any;
  constructor(public historyService: HistoryService, public questionService: QuestionService){}

  async ngOnInit() {
    this.questions = {};
    await this.completeUserHistory();
    this.questionService.getAllQuestions().subscribe(res => {
      res.forEach((element: { questionId: string | number; }) => {
        this.questions[element.questionId] = element;
      });
      for (let attempt of this.attempts) {
        if (this.questions[attempt.questionId] == undefined) {
          this.questions[attempt.questionId] = { 
            questionTitle: "Deleted Question", 
            questionCategory: "Deleted Question", 
            questionComplexity: "Deleted Question"
          };
        }
      }
    })
  }

  completeUserHistory() {
    return new Promise((resolve, reject) => {
      this.historyService.readAllHistory().subscribe(res => {
        this.attempts = res;
        resolve(true);
      }, err => {
        this.err = err.error?.message;
        reject(err);
      });
    });
  }

}
