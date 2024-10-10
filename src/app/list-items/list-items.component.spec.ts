import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule

// Mock AppHeaderComponent
@Component({
  selector: 'app-header',
  template: '<div></div>' // Provide a simple template for the mock
})
class MockAppHeaderComponent {}

import { ListItemsComponent } from './list-items.component';

describe('ListItemsComponent', () => {
  let component: ListItemsComponent;
  let fixture: ComponentFixture<ListItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListItemsComponent,
        MockAppHeaderComponent // Use the mock component
      ],
      imports: [
        HttpClientModule,
        FormsModule // Add FormsModule for form support
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
