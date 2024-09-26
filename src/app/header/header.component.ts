// import { Component } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-header',
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css']
// })
// export class HeaderComponent {
//   isProfileModalVisible = false;

//   constructor(private router: Router) {}

//   openProfile() {
//     this.isProfileModalVisible = true; // Show the modal
//     this.router.navigate(['/list-items'])
//   }

//   closeProfileModal() {
//     this.isProfileModalVisible = false; // Hide the modal
//   }
// }

import { Component, ViewChild } from '@angular/core';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isProfileModalVisible = false;

  // openProfile() {
  //   this.isProfileModalVisible = true; // Show the modal without navigating elsewhere
  //   this.profileComponent.loadProfileData();
  // }

  @ViewChild(ProfileModalComponent) profileModalComponent!: ProfileModalComponent;

  constructor(private authService: AuthService) {}
  
  openProfile() {
    this.isProfileModalVisible = true; // Show the modal
    this.authService.getProfile().subscribe(
      (data: any) => {
        this.profileModalComponent.userDetails = data; // Set user details
      },
      (error: any) => {
        console.error('Error fetching profile data', error);
      }
    );
  }

  closeProfileModal() {
    this.isProfileModalVisible = false; // Hide the modal
  }
}
