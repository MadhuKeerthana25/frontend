// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { AlertComponent } from './alert.component';
// import { AlertService } from '../alert.service';
// import { Subject } from 'rxjs';

// describe('AlertComponent', () => {
//   let component: AlertComponent;
//   let fixture: ComponentFixture<AlertComponent>;
//   let mockAlertService: any;
//   let alertSubject: Subject<any>;

//   beforeEach(async () => {
//     // Create a mock AlertService with a Subject to control the emitted alerts
//     alertSubject = new Subject();
//     mockAlertService = jasmine.createSpyObj('AlertService', ['alertState']);
//     mockAlertService.alertState = alertSubject.asObservable(); // Mock the observable

//     await TestBed.configureTestingModule({
//       declarations: [AlertComponent],
//       providers: [
//         { provide: AlertService, useValue: mockAlertService } // Use mock service
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(AlertComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should subscribe to alertState and add an alert', fakeAsync(() => {
//     // Arrange: create a mock alert
//     const mockAlert = { text: 'Test Alert', type: 'success' };

//     // Act: Emit an alert using the mock service
//     alertSubject.next(mockAlert);
//     fixture.detectChanges();

//     // Assert: Check if the alert is added to the component's alerts array
//     expect(component.alerts.length).toBe(1);
//     expect(component.alerts[0]).toEqual(mockAlert);

//     // Simulate the passage of 5 seconds
//     tick(5000);

//     // After 5 seconds, the alert should be removed
//     fixture.detectChanges();
//     expect(component.alerts.length).toBe(0);
//   }));

//   it('should not remove the alert before 5 seconds', fakeAsync(() => {
//     // Arrange: create a mock alert
//     const mockAlert = { text: 'Test Alert', type: 'success' };

//     // Act: Emit an alert using the mock service
//     alertSubject.next(mockAlert);
//     fixture.detectChanges();

//     // Assert: Check that the alert is added to the component's alerts array
//     expect(component.alerts.length).toBe(1);
//     expect(component.alerts[0]).toEqual(mockAlert);

//     // Simulate the passage of 3 seconds
//     tick(3000);

//     // Assert: The alert should still be there after 3 seconds
//     expect(component.alerts.length).toBe(1);

//     // Simulate the passage of another 2 seconds (total 5 seconds)
//     tick(2000);

//     // After 5 seconds, the alert should be removed
//     fixture.detectChanges();
//     expect(component.alerts.length).toBe(0);
//   }));

//   it('should call removeAlert and remove the correct alert', fakeAsync(() => {
//     // Arrange: create two mock alerts
//     const alert1 = { text: 'First Alert', type: 'success' };
//     const alert2 = { text: 'Second Alert', type: 'error' };

//     // Act: Emit the alerts using the mock service
//     alertSubject.next(alert1);
//     alertSubject.next(alert2);
//     fixture.detectChanges();

//     // Assert: Both alerts should be added
//     expect(component.alerts.length).toBe(2);
//     expect(component.alerts[0]).toEqual(alert1);
//     expect(component.alerts[1]).toEqual(alert2);

//     // Simulate the passage of 5 seconds
//     tick(5000);

//     // Assert: After 5 seconds, both alerts should be removed
//     fixture.detectChanges();
//     expect(component.alerts.length).toBe(0);
//   }));
// });


import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertService } from '../alert.service';
import { Subject, Observable } from 'rxjs';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let alertService: AlertService;
  let alertSubject: Subject<any>;

  beforeEach(async () => {
    // Create a Subject to simulate the alertState observable
    alertSubject = new Subject<any>();

    // Mock implementation of the AlertService
    const mockAlertService = {
      alertState: alertSubject.asObservable(), // Mock alertState as an observable
      success: jasmine.createSpy('success'), // Mock methods like success, error, etc.
      error: jasmine.createSpy('error'),
      subject: alertSubject, // Include subject if it's needed elsewhere
    };

    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [
        { provide: AlertService, useValue: mockAlertService } // Provide mock AlertService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit()
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to alertState and add alerts to the list', fakeAsync(() => {
    const alertData = { text: 'Sample Alert', type: 'success' };

    // Emit an alert using the mock alertState
    alertSubject.next(alertData);
    fixture.detectChanges();

    // Assert: Check if the alert is added to the alerts array
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0]).toEqual(alertData);

    // Assert that the alert still exists before 5 seconds
    tick(4000);
    fixture.detectChanges();
    expect(component.alerts.length).toBe(1); // Alert should still exist

    // Move time forward to 5 seconds
    tick(1000);
    fixture.detectChanges();

    // Assert: After 5 seconds, the alert should be removed
    expect(component.alerts.length).toBe(0);
  }));

  it('should handle multiple alerts and remove them after 5 seconds', fakeAsync(() => {
    const alert1 = { text: 'First Alert', type: 'success' };
    const alert2 = { text: 'Second Alert', type: 'error' };

    // Emit two alerts
    alertSubject.next(alert1);
    alertSubject.next(alert2);
    fixture.detectChanges();

    // Assert: Both alerts should be added
    expect(component.alerts.length).toBe(2);
    expect(component.alerts[0]).toEqual(alert1);
    expect(component.alerts[1]).toEqual(alert2);

    // Move time forward to 5 seconds
    tick(5000);
    fixture.detectChanges();

    // Assert: Both alerts should be removed after 5 seconds
    expect(component.alerts.length).toBe(0);
  }));

  it('should only remove alerts after their respective 5 seconds', fakeAsync(() => {
    const alert1 = { text: 'First Alert', type: 'success' };
    const alert2 = { text: 'Second Alert', type: 'error' };

    // Emit the first alert
    alertSubject.next(alert1);
    tick(1000); // Wait for 1 second

    // Emit the second alert after 1 second
    alertSubject.next(alert2);
    fixture.detectChanges();

    // Assert: Both alerts should exist
    expect(component.alerts.length).toBe(2);

    // Fast-forward 4 more seconds (total 5 seconds for alert1)
    tick(4000);
    fixture.detectChanges();

    // Assert: First alert should be removed, second should remain
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0]).toEqual(alert2);

    // Fast-forward 1 more second (total 5 seconds for alert2)
    tick(1000);
    fixture.detectChanges();

    // Assert: Now both alerts should be removed
    expect(component.alerts.length).toBe(0);
  }));
});
