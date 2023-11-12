import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';

const API_URL = environment.BACKEND_API + "matching/"

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
    providedIn: 'root'
  })
  
  export class MatchingService {
    
    matchId = ""

    constructor(private http: HttpClient){}

    enqueue(obj: any): Observable<any> {
        return this.http.post(API_URL + "enqueue", obj, httpOptions)
    }

    dequeue(id: any): Observable<any> {
        return this.http.post(API_URL + "dequeue", {userid: id}, httpOptions)
    }

    getQueueLength(): Observable<any> {
        return this.http.get(API_URL + "getLength", httpOptions)
    }

    updateMatchId(id: string) {
        this.matchId = id
    }

    getMatchId(id: string) {
        this.matchId = id
    }
  }