import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertCollectionComponent } from './alert-collection/alert-collection.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { HistoryChecksComponent } from './history-checks/history-checks.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { UsersComponent } from './users/users.component';

const routes: Routes = 
[
  {path: '', redirectTo: "/login", pathMatch: 'full'},
  {path: 'home-page', component: HomePageComponent, canActivate: [AuthGuard], data: AuthGuard},
  {path: 'upload-files', component: UploadFilesComponent, canActivate: [AuthGuard], data: AuthGuard},
  {path: 'alert-collection', component: AlertCollectionComponent, canActivate: [AuthGuard], data: AuthGuard},
  {path: 'history-checks', component: HistoryChecksComponent, canActivate: [AuthGuard], data: AuthGuard},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard], data: AuthGuard},
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuard], data: AuthGuard},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: AuthGuard}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
