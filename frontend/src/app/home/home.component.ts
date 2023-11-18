import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { QuestionService } from '../_services/question.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  content?: string;
  questions: any;
  counter: any;
  bottomView: boolean = false;
  currentIndex: number = -1;
  currentQuestion: any;
  fullQuestionSet: any;
  constructor(private userService: UserService, private questionService: QuestionService) { }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        if (!this.questions) {
          this.questions = [];
          this.counter = 0;
    }
      },
      error: err => {
        console.log(err)
        if(err.error) {
          this.content = JSON.parse(err.error).message;
        } else {
          this.content = "Error:" + err.status;
        }
      }
    });
    this.getQuestions();
  }

  getQuestions() {
    this.questionService.getAllQuestions().subscribe((res) => {
    this.questions = res;
    this.counter = this.questions.length;
    this.fullQuestionSet = this.questions;
    })
  }

  toggleView(i: any) {
    // to improve
    this.bottomView = !this.bottomView;
    if (i >= 0) {
      this.currentIndex = i;
      this.currentQuestion = this.questions[i]
    } else {
      this.currentIndex = -1
      this.currentQuestion = null;
    }
  }

  updateSearchResults(s: string) {
    if (s.length == 0) {
      this.questions = this.fullQuestionSet;
      return;
    }
    this.questionService.searchQuestions(s).subscribe(res => {
      this.questions = res;
    }, err => {
      console.log(err);
    })
  }
}
