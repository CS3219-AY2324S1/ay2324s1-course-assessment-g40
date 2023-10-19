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

  fetchQuestion(): void {
    const headers = {
      'Content-Type': 'application/json', // Set the Content-Type header to indicate JSON data
    };

    let counter = 0;

    let requestData = {
      counter: counter,
    }

    // Send an HTTP POST request to your serverless function
    this.http
      .post('http://localhost:8888/.netlify/functions/fetchQuestions', requestData, { headers })
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: Error) => {
          console.error(error);
        }
      );

    for (let i = 1; i < 30; i++) {
      let counter = 10 * i;

      let requestData = {
        counter: counter,
      }

      this.http
      .post('http://localhost:8888/.netlify/functions/fetchQuestions', requestData, { headers })
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: Error) => {
          console.error(error);
        }
      );
    }
  }
}
