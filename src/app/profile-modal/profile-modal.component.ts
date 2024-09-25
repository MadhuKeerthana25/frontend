import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent {
  @Input() isVisible: boolean = false;
  userDetails: any;

  constructor(private authService: AuthService) {
    this.authService.getProfile().subscribe(
      (data: any) => {
        this.userDetails = data;
      },
      (error: any) => {
        console.error('Error fetching profile data', error);
      }
    );
  }

  closeModal() {
    this.isVisible = false;
  }
}
