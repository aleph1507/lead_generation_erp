import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerConfigService} from './server-config.service';
import {Observable} from 'rxjs';
import {toFormData} from '../utils/formdata';
import {Lead} from '../models/Lead';
import {Client} from '../models/Client';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  constructor(
    private httpClient: HttpClient,
    private server: ServerConfigService
  ) { }

  parseClient(lead: Lead) {
    let clientResult = 'N/A';
    if (lead.client && lead.client.length) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < lead.client.length; i++) {
        if (clientResult === 'N/A') {
          clientResult = '';
        }
        clientResult += lead.client[i].name;
        if (i < lead.client.length - 1) {
          clientResult += ', ';
        }
      }
    }

    return clientResult;
  }

  getLeads(): Observable<{data: Lead[]}> {
    return this.httpClient.get<{data: Lead[]}>(this.server.endpoints.leads);
  }

  getLead(id: number): Observable<{data: Lead}> {
    return this.httpClient.get<{data: Lead}>(this.server.endpoints.leads + id);
  }

  storeLead(lead: Lead): Observable<{data: Lead}> {
    const leadFormData = toFormData(lead);
    return this.httpClient.post<{data: Lead}>(this.server.endpoints.leads, leadFormData);
  }

  sendCSVLeads(CSVFile: File, client: Client = null) {
    const CSVFormData = new FormData();
    CSVFormData.append('csv_file', CSVFile);
    if (client) {
      CSVFormData.append('client_id', client.id.toString());
    }
    return this.httpClient.post<any>(this.server.endpoints.leads + 'csv/', CSVFormData);
  }

  updateLead(lead: Lead): Observable<boolean> {
    const leadFormData = toFormData(lead);
    return this.httpClient.post<boolean>(this.server.endpoints.leads + 'update/' + lead.id, leadFormData);
  }

  searchLeads(query: string, client: Client = null): Observable<{data: Lead[]}> {
    const queryFormData = new FormData();
    queryFormData.append('query', query);
    if (client) {
      queryFormData.append('client', client.id.toString());
    }
    return this.httpClient
      .post<{data: Lead[]}>(this.server.endpoints.leads + 'search/', queryFormData);
  }

  getTrashed(): Observable<{data: Lead[]}> {
    return this.httpClient.get<{data: Lead[]}>(this.server.endpoints.leads + 'trashed');
  }

  deleteLead(id: number): Observable<{data: Lead}> {
    return this.httpClient.delete<{data: Lead}>(this.server.endpoints.leads + id);
  }

  restore(lead: Lead): Observable<{data: Lead}> {
    return this.httpClient.post<{data: Lead}>(this.server.endpoints.leads + 'restore/', {id: lead.id});
  }

  shredLead(lead: Lead): Observable<{data: Lead}> {
    return this.httpClient.post<{data: Lead}>(this.server.endpoints.leads + 'shred/', {id: lead.id});
  }

  massStatusUpdate(leads: Lead[], newStatus): Observable<Lead[]> {
    const fd = new FormData();
    fd.append('leadsRequested', JSON.stringify(leads.map(lead => lead.id)));
    fd.append('new_status', newStatus);
    return this.httpClient.post<Lead[]>(this.server.endpoints.leads + 'mass-status-update/', fd);
  }
}
