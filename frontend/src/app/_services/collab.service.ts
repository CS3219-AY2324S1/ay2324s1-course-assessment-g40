import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import { io } from 'socket.io-client';
import { QuestionService } from "./question.service";
import { environment } from '../../environments/environment';

@Injectable()

export class CollabService implements OnInit, OnDestroy {

  private socket = io(environment.BACKEND_API, { path: '/collab' });

  public isLocalEvent$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public change$: Subject<any> = new Subject();
  public message$: Subject<any> = new Subject();
  public question$: Subject<any> = new Subject();
  public request$: Subject<any> = new Subject();
  public leave$: Subject<any> = new Subject();

  ngOnInit(): void {
    this.socket.on("connect", () => {
      console.log(`${this.socket.id} connected`);
    })
  }

  ngOnDestroy(): void {
    this.leaveRoom()
  }

  public leaveRoom(): void {
    this.emitMessage("Your partner has left the room.");
    this.socket.emit("leave", "leave");
    console.log("Leaving room.");
    this.socket.disconnect();
  }
  
  constructor(
    private questionService: QuestionService
  ) {}

  public joinRoom(roomId: string) {
    console.log(`Joining room ${roomId}.`);
    this.socket.emit("join", roomId);
  }

  public emitRandomQuestion(complexity: string) {
    this.questionService.getRandomQuestionWithComplexity(complexity).subscribe((res) => {
      console.log(`Emitting random question:\n${res}`);
      this.socket.emit("question", res);
    })
  }
  
  public async getRandomQuestion(complexity: string): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.questionService.getRandomQuestionWithComplexity(complexity).subscribe((res) => {
          console.log(`Consuming random question:\n${res.questionTitle}`);
          resolve(res);
        }, (err) => {
          console.log(`Error getting random question:\n${err}`);
          reject(err);
        }
      );
    });
  }

  public emitQuestion(question: Object) {
    this.socket.emit("question", question);
  }

  public getQuestion = () => {
    this.socket.on("question", (question) => {
      console.log(`Consuming question:\n${question.questionTitle}`);
      this.question$.next(question);
    })

    return this.question$.asObservable();
  }

  public emitChange(change: any) {
    if (this.isLocalEvent$.value) {
      console.log(`Emitting change:\n${change}`);
      this.socket.emit("change", change);
    } else {
      // Stop supressing emission of change event
      console.log("Suprressed reemission of change event");
      this.isLocalEvent$.next(true);
    }
  }

  public getChange = () => {
    this.socket.on("change", (change) => {
      console.log(`Consuming change:\n${change}`);
      // Supress emission of change event to prevent loops
      this.isLocalEvent$.next(false);
      this.change$.next(change);
    })

    return this.change$.asObservable();
  }

  public emitMessage(message: string) {
    console.log(`Emitting message:\n${message}`);
    this.socket.emit("message", message);
    this.message$.next([0, message]);
  }

  public getMessage = () => {
    this.socket.on("message", (message) => {
      console.log(`Consuming message:\n${message}`);
      this.message$.next([1, message]);
    })

    return this.message$.asObservable();
  }

  public requestChangeOfQuestion(question: Object) {
    this.socket.emit("request", question);
  }

  public getRequest = () => {
    this.socket.on("request", (question) => {
      this.request$.next(question);
    })
    
    return this.request$.asObservable();
  }

}