import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {

  public serverUrl = 'http://127.0.0.1:8000/';
  public endpoints = {
    clients: this.serverUrl + 'api/clients/',
    leads: this.serverUrl + 'api/leads/',
    chats: this.serverUrl + 'api/chats/',
    messages: this.serverUrl + 'api/messages/',
    responses: this.serverUrl + 'api/responses/',
    login: this.serverUrl + 'api/login/',
    register: this.serverUrl + 'api/register/',
    register_first: this.serverUrl + 'api/register_first/',
    change_password: this.serverUrl + 'api/change_password/',
    users: this.serverUrl + 'api/users/',
    user: this.serverUrl + 'api/user/',
    user_delete: this.serverUrl + 'api/user/delete/',
    user_shred: this.serverUrl + 'api/user/shred/',
    user_restore: this.serverUrl + 'api/user/restore/',
    leadsCSVexport: this.serverUrl + 'api/leads/export'
  };

  public allowed401s = [
      this.serverUrl + 'api/chats/get-pending-ar/'
  ];

constructor() { }
}
