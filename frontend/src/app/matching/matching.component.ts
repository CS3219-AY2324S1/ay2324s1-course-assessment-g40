import { Component } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router';
import { MatchingService } from '../_services/matching.service'
import { StorageService } from '../_services/storage.service'
import { timeoutWith, throwError } from 'rxjs'

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.css']
})
export class MatchingComponent {

  match: any = undefined

  requested: boolean = false

  queueLength: number = -1

  constructor(
    private router: Router,
    private matchingService: MatchingService,
    private storageService: StorageService){}

  ngOnInit() {
    this.getQueueLength()
  }

  getMatch(userDetails: any) {
    this.matchingService.enqueue(userDetails).pipe(timeoutWith(30000, throwError(() => {
      this.matchingService.dequeue(userDetails["userid"]).subscribe((res) => {
        this.match = "Your request timed out!"
        this.requested = false
        this.getQueueLength()
      })
    }))).subscribe((res) => {
      console.log(res);
      if (res.message.includes("Matched users:")) {
        this.match = res.message
        this.getQueueLength()
        this.router.navigate(["/collab", res.roomId, res.difficulty, res.language]);
      }
    }, (err) => {
      this.match = "We encountered a problem. Please try again later."
      this.getQueueLength()
      setTimeout(() => this.requested = false, 15000);
    })
    this.getQueueLength()
  }

  cancelMatch() {
    let userid = this.storageService.getUser()["id"]
    this.matchingService.dequeue(userid).subscribe((res) => {
      this.getQueueLength()
      this.requested = false
      this.match = undefined
    })
  }

  getQueueLength() {
    this.matchingService.getQueueLength().subscribe((res) => {
      this.queueLength = res.length
    })
  }

  submitMatchingForm(form: NgForm) {
    let obj = Object.assign({}, form.value)
    obj["userid"] = this.storageService.getUser()["username"]
    this.getMatch(obj)
    this.requested = true
    if (this.match == "You're request timed out!") {
      this.match = "We're trying to match you..."
    }
  }

}
