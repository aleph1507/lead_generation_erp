import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ClientService} from '../services/client.service';
import {Client} from '../models/Client';
import {ChartData, ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {Lead} from "../models/Lead";

class Industry {
  name: string;
  total = 0;
  constructor(name = null) {
    this.name = name;
  }
  // $table->enum('status', ['NOTCONTACTED', 'NEUTRAL', 'POSITIVE', 'NEGATIVE'])
  count = {
    NOTCONTACTED: 0,
    NEUTRAL: 0,
    POSITIVE: 0,
    NEGATIVE: 0
  };
}

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.less']
})
export class ClientsViewComponent implements OnInit, OnDestroy {

  uuid: string;
  routeSub: Subscription;
  client: Client;
  // industries: Industry[] = [];
  industries = {key: Industry};
  parsed = false;
  industriesChartOptions: ChartOptions = {
    responsive: true
  };
  industriesChartLabels: Label[] = [];
  industriesChartType: ChartType = 'pie';
  // industriesChartType: ChartType = 'bar';
  industriesChartLegend = true;
  industriesChartPlugins = [];
  // industriesChartData: ChartDataSets[] = [];
  industriesChartData = [];
  showIndustriesChart = false;

  statusChartLabels: Label[] = [];
  statusChartData = [];
  statusChartType: ChartType = 'doughnut';

  constructor(
      private route: ActivatedRoute,
      private clientService: ClientService) { }

  parseIndustries() {
    console.log('parseIndustries');
    if (this.client.leads) {
      this.client.leads.forEach(lead => {
        if (!this.industries[lead.industry.toLowerCase()]) {
          this.industries[lead.industry.toLowerCase()] = new Industry(lead.industry);
        }
        this.industries[lead.industry.toLowerCase()].count[lead.status]++;
        this.industries[lead.industry.toLowerCase()].total++;
      });
    }
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.uuid = params.uuid;
      this.clientService.getClientPublic(this.uuid)
          .subscribe(dataClient => {
            this.client = dataClient.data;
            this.parseIndustries();
            this.setupIndustriesCharts();
            this.setupStatusCharts();
            this.parsed = true;
            this.showIndustriesChart = true;
            /*
                this.industries =
                key - lowercase name {
                  count: {
                    NEGATIVE: INT,
                    NAUTRAL: INT,
                    NOTCONTACTED: INT,
                    POSITIVE: INT
                  },
                  name: real name as in Linkedin: string,
                  total: sum of counts across all categories
                }
            */
            // information technology & services: Industry
            // count:
            //      NEGATIVE: 0
            //      NEUTRAL: 0
            //      NOTCONTACTED: 1
            //      POSITIVE: 0
            // name: "Information Technology & Services"
            // total: 1

            // internet: Industry {total: 1, count: {…}, name: "Internet"}
            // key: class Industry
            // venture capital: Industry {total: 1, count: {…}, name: "Venture Capital"}
            // __proto__: Object
            console.log('this.industries', this.industries);
          });
    });
  }

  setupIndustriesCharts() {
    console.log('this.industries', this.industries);
    const industryKeys = Object.keys(this.industries).filter(k => k.toLowerCase() !== 'key'.toLowerCase());
    // const industryKeys = Object.entries(this.industries).filter(k => k !== 'key');
    console.log('industryKeys', industryKeys);
    const data = [];
    const label: string[] = [];
    industryKeys.forEach(key => {
      if (this.industries[key].name.toLowerCase() !== 'Industry'.toLowerCase()) {
        this.industriesChartLabels
            .push(this.industries[key].name);
      }
      // console.log('name', this.industries[key].name);
      // this.industriesChartLabels.push(this.industries[key].name);
      // this.industriesChartData.push(7);
      // @ts-ignore
      // data.push(this.industries[key].total);
      // label.push(this.industries[key].name);

      // this.industriesChartData.push({data: [this.industries[key].total], label: this.industries[key].name});
      // this.industriesChartData.push({data: [this.industries[key].total], label: this.industries[key].name});
      this.industriesChartData.push(this.industries[key].total);
    // public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    // public barChartType: ChartType = 'bar';
    // public barChartLegend = true;
    // public barChartPlugins = [];
    //
    // public barChartData: ChartDataSets[] = [
    //     { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    //     { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    //   ];
    });
    console.log('this.industriesChartLabels', this.industriesChartLabels);
    // console.log('this.industriesChartLabels[0].toLowerCase() === this.industriesChartLabels[0].toLowerCase()',
    //     this.industriesChartLabels[0].toLowerCase() === this.industriesChartLabels[0].toLowerCase());
    // this.industriesChartData.push({data, label});
  }

  setupStatusCharts() {
    console.log('this.industries', this.industries);
    console.log('this.client', this.client);
    this.statusChartLabels = [
        'Not Yet Contacted',
        'In progress',
        'Not Interested',
        'Lead'
    ];
    // const notContacted = [];
    // const inProgress = [];
    // const notInterested = [];
    // const lead = [];
    let notContacted = 0;
    let inProgress = 0;
    let notInterested = 0;
    let lead = 0;
    // Not Yet Contacted NOTCONTACTED
    // In progress NEUTRAL
    // Not Interested NEGATIVE
    // Lead POSITIVE
    this.client.leads.forEach((l: Lead) => {
      switch (l.status) {
        case 'NOTCONTACTED':
          notContacted++;
          break;
        case 'NEUTRAL':
          inProgress++;
          break;
        case 'NEGATIVE':
          notInterested++;
          break;
        case 'POSITIVE':
          lead++;
          break;
        default:
          break;
      }
    });
    this.statusChartData = [notContacted, inProgress,
      notInterested, lead];
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
