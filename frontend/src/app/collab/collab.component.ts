import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollabService } from '../_services/collab.service';
import { QuestionService } from '../_services/question.service';

@Component({
  selector: 'app-collab',
  templateUrl: './collab.component.html',
  styleUrls: ['./collab.component.css'],
  providers: [ CollabService ]
})
export class CollabComponent implements OnInit {

  private roomId: any;
  private complexity: any;
  private language: any;
  public question: any;

  private editor: any;
  public editorOptions = { theme: 'vs-dark', language: '' };

  searchResults: any;
  questionView: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collabService: CollabService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    console.log(`Set complexity to ${this.complexity}.`);
    this.complexity = this.route.snapshot.paramMap.get('difficulty');
    console.log(`Set language to ${this.language}`);
    this.language = this.route.snapshot.paramMap.get('language');
    this.language = this.language.toLowerCase();
    this.editorOptions.language = this.language;
    console.log(`Joining room ${this.roomId}.`)
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    this.collabService.joinRoom(this.roomId);
    this.collabService.getQuestion().subscribe((question: any) => {
      console.log(`Updating question ${question}`);
      this.question = question;
    })
    this.getQuestion();
    this.getQuestions();
  }

  getQuestions() {
    this.questionService.getAllQuestions().subscribe((res) => {
      this.searchResults = res;
    })
  }

  // Expose editor interface
  onInit(editor: any) {
    this.editor = editor;
    console.log(`Initialised monaco-editor ${this.editor}.`)

    // Emit change events onDidChangeModelContent
    this.editor.onDidChangeModelContent((e: any) => {
      console.log(e.changes);
      this.collabService.emitChange(e);
    })

    // Consume and apply change events to model
    this.collabService.getChange().subscribe((change: any) => {
      if (change) {
        console.log(`Applying change ${change}`);
        this.editor.getModel().applyEdits(change.changes);
      }        
    })

    this.editor.onDidDispose((e: any) => {
      console.log(`Disposing monaco-editor ${this.editor}.`);
    })
  }

  public getQuestion() {
    this.collabService.emitRandomQuestion(this.complexity);
  }

  public leaveRoom(): void {
    this.router.navigate(["/home"])
  }

  updateSearchResults(s: string) {
    this.questionService.searchQuestions(s).subscribe(res => {
      this.searchResults = res;
    }, err => {
      console.log(err);
    })
  }

  toggleQuestionView() {
    this.questionView = !this.questionView;
  }

  pullUpQuestion(q: Object) {
    this.collabService.emitQuestion(q);
    this.toggleQuestionView();
  }
}
