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
      'Content-Type': 'application/json', // Set the Content-Type header to indicate JSON data
    };
    // Get the value of questionEndpoint from the input field
    const questionEndpointValue = this.questionEndpoint.trim();
  
    // Check if questionEndpointValue is empty
    if (!questionEndpointValue) {
      console.error('Question endpoint is empty');
      return;
    }
  
    // Create an object with the questionEndpoint as a property
    const requestData = { questionEndpoint: questionEndpointValue };
    console.log(requestData);

    // Send an HTTP POST request to your serverless function
    this.http
      .post('http://localhost:8888/.netlify/functions/fetchQuestions', requestData, { headers })
      .subscribe(
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
