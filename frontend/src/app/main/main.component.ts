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
  tags = new FormControl('')
  categories = new FormControl('')
  categoriesList: string[] = ["Algorithms", "Brain Teasers", "Hashing", "Dynamic Programming", "Strings",
  "Data Structures", "Bit Manipulation", "Recursion", "Databases", "Arrays"]
  tagsList: string[] = ['Popular', 'NeetCode 150', 'Top 50', 'Top 10', 'Top 100']
  successMessage: string = ""
  errorMessage: string = ""

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
          this.counter++;
          this.questions?.push(obj)
          this.saveQuestions();
          this.clearErrorMessage()
          this.successMessage = "Successfully added your question as question " + res.questionId
          formData.reset()
        }, (err) => {
          var errMessage = "An error occurred while adding your question!"
          if (err.error) {
            if (err.error.message.includes("duplicate key error")) {
              errMessage = errMessage + " Error: " + err.error.message
            }
          }
          this.clearSuccessMessage()
          this.errorMessage = errMessage
        })

      }
  }

  editItem(index: number, qid: number, formData: any) {
    let obj = Object.assign({}, formData.value);
    obj["questionId"] = qid;
    this.questionService.editQuestion(obj).subscribe((res) => {
      this.clearErrorMessage()
      this.successMessage = "Successfully edited question " + qid
      console.log(obj)
      this.questions[index] = obj;
    }, (err) => {
      var errMessage = "An error occurred while editing question " + qid + "!"
      if (err.error) {
        if (err.error.message.includes("duplicate key error")) {
          errMessage = errMessage + " Error: " + "You inputted a duplicate question title"
        }
      }
      this.clearSuccessMessage()
      this.errorMessage = errMessage
      var cq = this.questions[index]
      formData.reset(cq)
    })
  }

  deleteItem(index: number, i: number) {
    this.questions.splice(index, 1);
    this.questionService.deleteQuestion(i).subscribe((res) => {
      this.clearErrorMessage()
      this.successMessage = "Successfully deleted question " + i
    }, (err) => {
      var errMessage = "An error occurred while deleting question " + i + "!"
      if (err.error) {
        errMessage = errMessage + " Error: " + err.error.message
      }
      this.clearSuccessMessage()
      this.errorMessage = errMessage
    })
  }

  addTag(s: string) {
    this.tagsList.push(s);
  }

  clearSuccessMessage() {
    this.successMessage = ""
  }

  clearErrorMessage() {
    this.errorMessage = ""
  }
  
}
