import { Component } from '@angular/core';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = "frontend"
  private roles: string[] = [];
  isLoggedIn = false;
  showModeratorBoard = false;
  username?: string;

  constructor(private storageService: StorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedin();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;

      this.username = user.username;
    }
  }

  signout(): void {
    this.authService.signout().subscribe({
      next: res => {
        this.storageService.clean();
        this.isLoggedIn = false;
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
