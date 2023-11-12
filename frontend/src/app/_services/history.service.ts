import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "./storage.service";
import { environment } from '../../environments/environment';

const api = environment.BACKEND_API + "history/"

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})

export class HistoryService {
  constructor(private http: HttpClient, private storageService: StorageService) { }

  readHistory(history: any): Observable<any> {
    let newobj = Object.assign({}, history);
    return this.http.get(
        api + "attempt/" + newobj.questionId + "/" + newobj.userId,
        httpOptions
    );
  }

  readAllHistory(): Observable<any> {
    var user = this.storageService.getUser().username;
    return this.http.get(
      api + "user/" + user,
      httpOptions
    )
  }

  saveHistory(history: any): Observable<any> {
    let newobj = Object.assign({}, history);
    return this.http.post(
        api + newobj.questionId + "/" + newobj.userId,
        newobj,
        httpOptions
    )
  }

  editHistory(history: any): Observable<any> {
    let newobj = Object.assign({}, history);
    return this.http.put(
        api + newobj.questionId.toString() + "/" + newobj.userId.toString(),
        newobj,
        httpOptions
    )
  }

  deleteHistory(id: number): Observable<any> {
    return this.http.delete(
        api + id.toString(),
        httpOptions
    )
  }
}