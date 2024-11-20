import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();
  private timeoutId: any;

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.loadingSubject.next(false);
    }, 100); // Reduced delay to 100ms
  }
}
