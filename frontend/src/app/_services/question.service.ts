import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = "http://127.0.0.1:8002/question/"
const AUTH_API_URL = "http://127.0.0.1:8080/question/auth/"

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  constructor(private http: HttpClient) { }

  getAllQuestions(): Observable<any> {
    return this.http.get(
      API_URL + 'all', 
      httpOptions
    );
  }

  getRandomQuestionWithComplexity(questionComplexity: string): Observable<any> {
    return this.http.get(
      API_URL + 'random/' + questionComplexity, 
      httpOptions
    );
  }

  saveQuestion(question: any): Observable<any> {
    let newobj = Object.assign({}, question);
    return this.http.post(
        API_URL,
        newobj,
        httpOptions
    )
  }

  editQuestion(question: any): Observable<any> {
    let newobj = Object.assign({}, question);
    return this.http.put(
        API_URL + newobj.questionId.toString(),
        newobj,
        httpOptions
    )
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(
        API_URL + id.toString(),
        httpOptions
    )
  }

  searchQuestions(s: string): Observable<any> {
    return this.http.get(
      API_URL + "search/" + s,
      httpOptions
    )
  }

}