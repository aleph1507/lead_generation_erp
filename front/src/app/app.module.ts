import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ServerConfigService} from './services/server-config.service';
import { ClientsComponent } from './clients/clients.component';
import {MatModule} from './mat.module';
import { SingleClientComponent } from './dialogs/single-client/single-client.component';
import {ReactiveFormsModule} from '@angular/forms';
import { DeleteClientComponent } from './dialogs/single-client/delete-client/delete-client.component';
import { LeadsComponent } from './leads/leads.component';
import { SingleLeadComponent } from './dialogs/single-lead/single-lead.component';
import { DeleteLeadComponent } from './dialogs/single-lead/delete-lead/delete-lead.component';
import { LeadsCsvComponent } from './dialogs/leads-csv/leads-csv.component';
import { ClientLeadsComponent } from './dialogs/client-leads/client-leads.component';
import { LeadsByClientComponent } from './dialogs/leads-by-client/leads-by-client.component';
import { ChatsComponent } from './chats/chats.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ApprovalRequestsComponent } from './dialogs/approval-requests/approval-requests.component';
import { ClientComponent } from './client/client.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import { ChangePasswordComponent } from './dialogs/change-password/change-password.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './dialogs/user/user.component';
import { DeleteUserComponent } from './dialogs/delete-user/delete-user.component';
import { RegisterFormComponent } from './auth/register-form/register-form.component';
import {MatSelectModule} from "@angular/material/select";
import { ClientsViewComponent } from './clients-view/clients-view.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ClientsComponent,
    SingleClientComponent,
    DeleteClientComponent,
    LeadsComponent,
    SingleLeadComponent,
    DeleteLeadComponent,
    LeadsCsvComponent,
    ClientLeadsComponent,
    LeadsByClientComponent,
    ChatsComponent,
    ChatWindowComponent,
    ApprovalRequestsComponent,
    ClientComponent,
    AdminComponent,
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    UsersComponent,
    UserComponent,
    DeleteUserComponent,
    RegisterFormComponent,
    ClientsViewComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatModule,
        MatSelectModule
    ],
  providers: [
    ServerConfigService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [SingleClientComponent, DeleteClientComponent,
                    SingleLeadComponent, DeleteLeadComponent,
                    LeadsCsvComponent, ClientLeadsComponent, LeadsByClientComponent,
                    ApprovalRequestsComponent, ChangePasswordComponent, UserComponent,
                    DeleteUserComponent]
})
export class AppModule { }
