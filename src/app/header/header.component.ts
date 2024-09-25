import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isProfileModalVisible = false;

  constructor(private router: Router) {}

  openProfile() {
    this.isProfileModalVisible = true; // Show the modal
  }

  closeProfileModal() {
    this.isProfileModalVisible = false; // Hide the modal
  }
}
