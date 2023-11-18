import { Component, OnInit } from '@angular/core';
import { CollabService } from '../../_services/collab.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  
  public message: string = '';
  public messageLog: string[] = [];

  public isCollapsed: boolean = true;

  constructor(
    private collabService: CollabService
  ) {}

  ngOnInit(): void {
    this.collabService.getMessage().subscribe((message: string) => {
      console.log(`Pushing message\n${message}`)
      this.messageLog.push(message);
      setTimeout(() => this.scrollChat(), 10);
    })
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.emitMessage();
    }
  }

  emitMessage(): void {
    if (this.message.length !== 0) {
      if (this.message.trim().length !== 0) {
        this.collabService.emitMessage(this.message);
      }
      this.message = '';
    }
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  scrollChat(): void {
    const scrollableContainer = document.getElementById("scrollable-container");
    if (scrollableContainer) {
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    }
  }
}
