import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  template: `
    <div class="welcome-container">
      <h1>Welcome to the Item Management System</h1>
      <button (click)="navigateToItems()" class="start-button">Get Started</button>
    </div>
  `,
  styles: [`
    .welcome-container {
      text-align: center;
      margin-top: 50px;
    }
    .start-button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .start-button:hover {
      background-color: #45a049;
    }
  `]
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  navigateToItems() {
    this.router.navigate(['/list-items']);
  }
}
