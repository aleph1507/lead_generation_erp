import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ClientsComponent} from './clients/clients.component';
import {LeadsComponent} from './leads/leads.component';
import {ChatsComponent} from './chats/chats.component';
import {ClientComponent} from './client/client.component';
import {AdminComponent} from './admin/admin.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {AuthGuardService as AuthGuard} from './guards/auth-guard.service';
import {ClientsViewComponent} from './clients-view/clients-view.component';


const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'clients', component: ClientsComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'clients/:client', component: ClientComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'leads', component: LeadsComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'leads/:id', component: LeadsComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'chats', component: ChatsComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'admin', component: AdminComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent, pathMatch: 'full'},
  { path: 'register', component: RegisterComponent, pathMatch: 'full'},
  { path: 'view/client/:uuid', component: ClientsViewComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
