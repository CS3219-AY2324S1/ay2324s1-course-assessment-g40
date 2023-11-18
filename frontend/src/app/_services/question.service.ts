import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.BACKEND_API + "question/"
const AUTH_API_URL = environment.BACKEND_API + "question/auth/"

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
        AUTH_API_URL,
        newobj,
        httpOptions
    )
  }

  editQuestion(question: any): Observable<any> {
    let newobj = Object.assign({}, question);
    return this.http.put(
        AUTH_API_URL + newobj.questionId.toString(),
        newobj,
        httpOptions
    )
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(
        AUTH_API_URL + id.toString(),
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