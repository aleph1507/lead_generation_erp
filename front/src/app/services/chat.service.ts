import { Injectable } from '@angular/core';
import {ServerConfigService} from './server-config.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Chat} from '../models/Chat';
import {Observable} from 'rxjs';
import {toFormData} from '../utils/formdata';
import {Message} from '../models/Message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private serverConfigService: ServerConfigService,
    private http: HttpClient
  ) { }

  getChats(): Observable<{data: Chat[]}> {
    return this.http.get<{data: Chat[]}>(this.serverConfigService.endpoints.chats);
  }

  getChatsByParticipants(clientId: number, leadId: number): Observable<{data: Chat[]}> {
    const params = new HttpParams()
      .set('client_id', String(clientId))
      .set('lead_id', String(leadId));
    return this.http.get<{data: Chat[]}>(this.serverConfigService.endpoints.chats
      + 'participants', {params});
  }

  getChat(id: number): Observable<{data: Chat}> {
    return this.http.get<{data: Chat}>(this.serverConfigService.endpoints.chats + id);
  }

  storeChat(chat: Chat, role: string = null): Observable<{data: Chat}> {
    const chatFormData = toFormData(chat);
    chatFormData.append('role', role);
    return this.http.post<{data: Chat}>(this.serverConfigService.endpoints.chats, chatFormData);
  }

  updateChat(chat: Chat): Observable<boolean> {
    return this.http.post<boolean>(this.serverConfigService.endpoints.chats + 'update/' + chat.id, toFormData(chat));
  }

  changeMessageStatus(msg: Message, newStatus: 'PENDING' |'APPROVED' | 'REJECTED' | 'ALTERED' | null)
      : Observable<{data: Message}> {
    const messageFormData = new FormData();
    messageFormData.append('message_id', msg.id.toString());
    messageFormData.append('approval_request', newStatus);
    return this.http.post<{data: Message}>(this.serverConfigService.endpoints.chats + 'change-message-status/', messageFormData);
  }

  getChatsWithAR(): Observable<{data: Chat[]}> {
    return this.http.get<{data: Chat[]}>(this.serverConfigService.endpoints.chats + 'get-pending-ar/');
  }

  deleteChat(id: number): Observable<{data: Chat}> {
    return this.http.delete<{data: Chat}>(this.serverConfigService.endpoints.chats + id);
  }
}
