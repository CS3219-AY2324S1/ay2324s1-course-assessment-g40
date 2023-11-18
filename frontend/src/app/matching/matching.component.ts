import { Component, OnDestroy, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router';
import { MatchingService } from '../_services/matching.service'
import { StorageService } from '../_services/storage.service'
import { timeoutWith, throwError, count, interval, range, timer, takeWhile, scan } from 'rxjs'

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.css']
})
export class MatchingComponent implements OnInit, OnDestroy {

  match: any = undefined

  requested: boolean = false

  queueLength: number = -1

  currUser = this.storageService.getUser().username

  timer = {s: 0};

  countDown: any = undefined

  enqueueSubscription: any = undefined

  constructor(
    private router: Router,
    private matchingService: MatchingService,
    private storageService: StorageService){}

  ngOnInit() {
  }

  ngOnDestroy(): void {
      this.cancelMatch()
  }

  getMatch(userDetails: any) {
    if (this.countDown) {
      this.countDown.unsubscribe();
    }
    this.countDown = timer(0, 1000).pipe(
      scan(i => --i, 31),
      takeWhile(i => i >= 0 && this.requested)
    ).subscribe((i: number) => {
      this.timer.s = 30 - i;
      if (this.requested) {
        document.getElementById("bar")!.style.width = (this.timer.s/30)*100+"%";
        document.getElementById("bar")!.innerHTML = this.timer.s + "s";
      }
    });
    this.enqueueSubscription = this.matchingService.enqueue(userDetails)
    .pipe(timeoutWith(30000, throwError(() => {
      this.matchingService.dequeue(this.currUser).subscribe((res) => {
        this.match = "Your request timed out!"
        setTimeout(() => this.requested = false, 5000);
      })
    }))).subscribe((res) => {
      if (res.message.includes("Matched users:")) {
        this.match = res.message
        this.matchingService.updateMatchId(res.match);
        this.router.navigate(["/collab"], {
          state: {
            roomId: res.roomId,
            difficulty: res.difficulty,
            language: res.language 
          }
        });
      } 
    }, (err) => {
      if (err) {
        this.match = "We encountered a problem. Please try again later."
        this.cancelMatch()
      }
    })
  }

  cancelMatch() {
    if (this.enqueueSubscription) {
      this.enqueueSubscription.unsubscribe()
    }
    this.matchingService.dequeue(this.currUser).subscribe((res) => {
      this.requested = false
      this.match = undefined
    })
  }

  submitMatchingForm(form: NgForm) {
    let obj = Object.assign({}, form.value)
    obj["userid"] = this.currUser
    this.getMatch(obj)
    this.requested = true
    this.match = "We're trying to match you..."
  }

  goToSolo(userDetails: any) {
    this.cancelMatch()
    var details = userDetails.value;
        this.router.navigate(["/collab"], {
          state: {
            roomId: this.currUser,
            difficulty: details.difficulty,
            language: details.language 
          }
        });  }

}
