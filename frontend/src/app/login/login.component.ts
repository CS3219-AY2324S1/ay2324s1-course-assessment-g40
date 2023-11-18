import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  form:any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  err: any;


  constructor(private authService: AuthService, private storageService: StorageService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedin()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      this.err = params['err'];
    });
  }

  onSubmit(): void {
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe({
      next:data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.errorMessage = "";
        this.err = "";
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }
  reloadPage(): void {
    window.location.reload();
  }
}
