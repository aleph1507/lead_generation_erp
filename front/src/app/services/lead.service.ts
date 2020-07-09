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

  export(options: {client_id?: number, status?: string} | null = null): Observable<any> {
    const exportFD = new FormData();
    if (options) {
      if (options.client_id) {
        exportFD.append('client_id', options.client_id.toString());
      }
      if (options.status) {
        exportFD.append('status', JSON.stringify(options.status));
      }

    }

    return this.httpClient.post(this.server.endpoints.leadsCSVexport, exportFD);
  }

  downloadFile(data: any) {

  }

  // downloadFile(data: any) {
  //   // data = data.filter(el => el.length > 0);
  //
  //   // data = data[0];
  //   const arrJson = [];
  //   data.forEach(el => {
  //     if (el.length > 0) {
  //       el.forEach(row => {
  //         arrJson.push(row);
  //       });
  //     }
  //   });
  //
  //   data = arrJson;
  //   console.log('data:', data);
  //
  //   const replacer = (key, value) => (value === null ? '' : value);
  //   const header = Object.keys(data[0]);
  //   const csv = data.map((row) =>
  //       header
  //           .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //           .join(',')
  //   );
  //   csv.unshift(header.join(','));
  //   const csvArray = csv.join('\r\n');
  //
  //   const a = document.createElement('a');
  //   const blob = new Blob([csvArray], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  //
  //   a.href = url;
  //   a.download = 'prospects.csv';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   a.remove();
  // }

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
