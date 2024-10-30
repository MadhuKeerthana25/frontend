import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AlertComponent } from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component'; // Import LoaderComponent
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AlertComponent,
        LoaderComponent // Declare the LoaderComponent
      ],
      imports: [RouterTestingModule] // Add RouterTestingModule here
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title as empty', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toBe(''); // Expect the h1 to have an empty string
  });
  
});
