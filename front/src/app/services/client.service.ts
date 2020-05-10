import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Client} from '../models/Client';
import {ServerConfigService} from './server-config.service';
import {toFormData} from '../utils/formdata';
import {Lead} from '../models/Lead';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private httpClient: HttpClient,
    private server: ServerConfigService
  ) { }

  getClients(): Observable<{data: Client[]}> {
    return this.httpClient.get<{data: Client[]}>(this.server.endpoints.clients);
  }

  getClient(id: number): Observable<{data: Client}> {
    return this.httpClient.get<{data: Client}>(this.server.endpoints.clients + id);
  }

  getClientPublic(uuid: string): Observable<{data: Client}> {
    return this.httpClient.get<{data: Client}>(this.server.endpoints.clients + 'public?' + 'uuid=' + uuid);
  }

  storeClient(client: Client): Observable<{data: Client}> {
    const clientFormData = toFormData(client);
    return this.httpClient.post<{data: Client}>(this.server.endpoints.clients, clientFormData);
  }

  updateClient(client: Client): Observable<boolean> {
    const clientFormData = toFormData(client);
    return this.httpClient.post<boolean>(this.server.endpoints.clients + 'update/' + client.id, clientFormData);
  }

  searchClients(query: string, lead: Lead = null): Observable<{data: Client[]}> {
    const queryFormData = new FormData();
    console.log('query: ', query, ' lead: ', lead);
    queryFormData.append('query', query);
    if (lead) {
      queryFormData.append('lead', lead.id.toString());
      console.log('append lead.id: ', );
    }
    return this.httpClient.post<{data: Client[]}>(this.server.endpoints.clients + 'search/', queryFormData);
  }

  getClientLeads(client: Client): Observable<{data: Lead[]}> {
    console.log('client.id: ', client.id);
    return this.httpClient.get<{data: Lead[]}>(this.server.endpoints.clients + 'leads/' + client.id);
  }

  getClientLeadsByDate(client: Client): Observable<{data: Lead[]} | any> {
    // get('/clients/leads/date/{client}
    return this.httpClient.get<{data: Lead[]} | any>(this.server.endpoints.clients + 'leads/date/' + client.id);
  }

  deleteClient(id: number): Observable<{data: Client}> {
    return this.httpClient.delete<{data: Client}>(this.server.endpoints.clients + id);
  }

  getTrashed(): Observable<{data: Client[]}> {
    return this.httpClient.get<{data: Client[]}>(this.server.endpoints.clients + 'trashed');
  }

  restore(client: Client): Observable<{data: Client}> {
    return this.httpClient.post<{data: Client}>(this.server.endpoints.clients + 'restore/', {id: client.id});
  }

  shredLead(client: Client): Observable<{data: Client}> {
    return this.httpClient.post<{data: Client}>(this.server.endpoints.clients + 'shred/', {id: client.id});
  }
}
