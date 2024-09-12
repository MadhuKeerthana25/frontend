import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemComponent } from './add-item/add-item.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'add-item', component: AddItemComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'list-items', component: ListItemsComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'USER'] } },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Lazy loading with AuthGuard protection
  {
    path: 'employee',
    loadChildren: () =>
      import('./add-item/add-item.module').then(m => m.AddItemModule),
    canLoad: [AuthGuard] 
  },
  {
    path: 'dsm',
    loadChildren: () =>
      import('./list-items/list-item.module').then(m => m.ListItemsModule),
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
