import { Component } from '@angular/core';
import { QuestionService } from '../_services/question.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  title = 'main';
  questions: any[] = [];
  currentIndex: number = -2;
  currentQuestion: any = null;
  counter!: number;
  bottomView = true;
  selector: any;
  categories = new FormControl('')
  categoriesList: string[] = ["Algorithms", "Brain Teasers", "Hashing", "Dynamic Programming"]

  constructor(private questionService: QuestionService) {}
  
  ngOnInit(): void {
    this.getQuestions();
    if (!this.questions) {
      this.questions = [];
      this.counter = 0;
    }
  }

  getQuestions() {
    this.questionService.getAllQuestions().subscribe((res) => {
      this.questions = res;
      this.counter = this.questions.length;
    })
  }

  //to delete
  saveQuestions() {
      localStorage.setItem("qs", JSON.stringify(this.questions));
  }

  view(i: number) {
      this.currentIndex = i;
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

  addItem(formData: any) {
      let obj = Object.assign({}, formData.value);
      let dup = false
      // this is not right below
      this.questions.forEach((q) => {
        if (q["questionTitle"] == obj["questionTitle"]) {
          alert("Duplicate Question! Please try again")
          dup = true
          return
        }
      })
      if (!dup) {
        this.questionService.saveQuestion(obj).subscribe((res) => {
          obj["questionId"] = res.questionId;
        })
        this.counter++;
        this.questions?.push(obj)
        this.saveQuestions();
        formData.reset()
      }
  }

  editItem(index: number, qid: number, formData: any) {
    let obj = Object.assign({}, formData.value);
    obj["questionId"] = qid;
    console.log(obj)
    this.questionService.editQuestion(obj).subscribe((res) => {
      this.questions[index] = obj;
      document.getElementById(`close${qid}`)?.click();
      alert("Edited question successfully.");
    }, (err) => {
      alert("Duplicate Question title! Please try again")
    })
  }

  deleteItem(index: number, i: number) {
    this.questionService.deleteQuestion(i).subscribe((res) => {
      this.questions.splice(index, 1);
    })
  }
}
