import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<any>();

  // Observable stream
  alertState = this.subject.asObservable();

  // Emit alert message
  success(message: string) {
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string) {
    this.subject.next({ type: 'error', text: message });
  }

  clear() {
    this.subject.next(null);
  }
}
