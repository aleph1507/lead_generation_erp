import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ClientService} from '../services/client.service';
import {Client} from '../models/Client';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';

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
  industriesBarChartOptions: ChartOptions = {
    responsive: true
  };
  industriesBarChartLabels: Label[] = [];
  industriesChartType: ChartType = 'bar';
  industriesChartLegend = false;
  industriesChartPlugins = [];
  industriesChartData: ChartDataSets[] = [];
  showIndustriesChart = false;

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
            this.setupIndustriesBarCharts();
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

  setupIndustriesBarCharts() {
    const industryKeys = Object.keys(this.industries);
    const data = [];
    const label: string[] = [];
    industryKeys.forEach(key => {
      // this.industriesBarChartLabels.push(this.industries[key].name);
      // this.industriesChartData.push(7);
      // @ts-ignore
      // data.push(this.industries[key].total);
      // label.push(this.industries[key].name);

      this.industriesChartData.push({data: [this.industries[key].total], label: this.industries[key].name});
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
    // this.industriesChartData.push({data, label});
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
