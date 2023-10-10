import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  content?: string;
  questionEndpoint: string = '';
  constructor(private userService: UserService, private http: HttpClient) { }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        console.log(err)
        if(err.error) {
          this.content = JSON.parse(err.error).message;
        } else {
          this.content = "Error:" + err.status;
        }
      }
    });
  }

  onSubmit(): void {
    const headers = {
      'Content-Type': 'application/json',
    };
    // Send an HTTP GET request to your serverless function with the input as a parameter
    this.http.get('http://localhost:8888/.netlify/functions/fetchQuestions', { headers }).subscribe(
      (data: any) => {
        // Handle the response from the serverless function here
        console.log(data);
      },
      (error) => {
        // Handle any errors here
        console.error(error);
      }
    );
  }
}
