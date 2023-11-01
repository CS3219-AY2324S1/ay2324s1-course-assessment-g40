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
  constructor(private userService: UserService, private questionService: QuestionService) { }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.getQuestions();
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
  }

  getQuestions() {
    this.questionService.getAllQuestions().subscribe((res) => {
      this.questions = res;
      this.counter = this.questions.length;
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
}
