import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemComponent } from './add-item/add-item.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'add-item', component: AddItemComponent, canActivate: [AuthGuard] },
  { path: 'list-items', component: ListItemsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: "employee",
    loadChildren: () =>
      import("./add-item/add-item.module").then(m => m.AddItemModule),
  },
  {
    path: "dsm",
    loadChildren: () =>
      import("./list-items/list-item.module").then(m => m.ListItemsModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
