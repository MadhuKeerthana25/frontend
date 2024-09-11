import { Component, OnInit } from '@angular/core';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  alerts: any[] = [];

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.alertState.subscribe(alert => {
      if (alert) {
        this.alerts.push(alert);
        setTimeout(() => this.removeAlert(alert), 5000); // auto-hide alert after 5 seconds
      }
    });
  }

  removeAlert(alert: any) {
    this.alerts = this.alerts.filter(a => a !== alert);
  }
}
