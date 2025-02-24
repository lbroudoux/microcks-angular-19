/*
 * Copyright The Microcks Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NgIf } from '@angular/common';

import { ConfigService } from '../../services/config.service';
import { MetricsService } from '../../services/metrics.service';
import { ServicesService } from '../../services/services.service';
import { DailyInvocations } from '../../models/metric.model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf]
})
export class DashboardPageComponent implements OnInit {
  aDayLong: number = 1000 * 60 * 60 * 24;
  today = new Date();
  todayStr: string;

  servicesCount = 0;
  aggregatesCount = 0;

  actionsText = '';
  chartDates: any[] = ['dates'];


  repositoryDonutChartData: any[] = [
    ['REST', 0],
    ['DIRECT', 0],
    ['SOAP', 0],
    ['EVENT', 0],
    ['GRAPH', 0],
    ['GRPC', 0],
  ];

  testResultsDonutChartData: any[] = [
    ['SUCCESS', 3],
    ['FAILURE', 5],
  ];

  topInvocations: any; //DailyInvocations[];
  conformanceScores: any;

  constructor(
    private servicesSvc: ServicesService,
    private config: ConfigService,
    private metricsSvc: MetricsService,
    private ref: ChangeDetectorRef
  ) {
    this.todayStr = metricsSvc.formatDayDate(this.today);
  }

  ngOnInit() {
    this.getServicesMap();
    this.getTopInvocations();
    this.getInvocationsTrend();
    this.getAggregatedTestConformanceMetrics();
    this.getLatestTestsTrend();
  }

  isRepositoryPanelDisplayed(): boolean {
    return this.servicesCount > 1;
  }
  isTestsPanelDisplayed(): boolean {
    return this.aggregatesCount > 1;
  }

  getServicesMap(): void {
    this.servicesSvc.getServicesMap().subscribe((results) => {
      this.servicesCount = Object.keys(results).length;
      this.repositoryDonutChartData = [
        ['REST', 0],
        ['DIRECT', 0],
        ['SOAP', 0],
        ['EVENT', 0],
        ['GRPC', 0],
        ['GRAPH', 0],
      ];
      let directCount = 0;
      for (const key in results) {
        if (key === 'GENERIC_REST' || key === 'GENERIC_EVENT') {
          directCount += results[key];
          this.repositoryDonutChartData.push(['DIRECT', directCount]);
        } else if (key === 'SOAP_HTTP') {
          this.repositoryDonutChartData.push(['SOAP', results[key]]);
        } else if (key === 'GRAPHQL') {
          this.repositoryDonutChartData.push(['GRAPH', results[key]]);
        } else {
          this.repositoryDonutChartData.push([key, results[key]]);
        }
      }
      this.ref.detectChanges();
    });
  }

  getTopInvocations(day: Date = this.today): void {
    this.metricsSvc.getTopInvocations(day).subscribe((results) => {
      this.topInvocations = results.slice(0, 3);
      this.ref.detectChanges();
    });
  }

  getInvocationsTrend(limit: number = 20): void {
    this.metricsSvc.getInvocationsStatsTrend(limit).subscribe((results) => {
      /*
      this.chartData.dataAvailable = false;
      this.chartData.xData = ['dates'];
      this.chartData.yData = ['hits'];
      for (let i = limit - 1; i >= 0; i--) {
        const pastDate: Date = new Date(
          this.today.getTime() - i * this.aDayLong
        );
        this.chartData.xData.push(pastDate);
        const pastDateStr = this.metricsSvc.formatDayDate(pastDate);
        const result = results[pastDateStr];
        if (result == null || result == undefined) {
          this.chartData.yData.push(0);
        } else {
          this.chartData.yData.push(result);
        }
      }
      this.chartData.dataAvailable = true;
      */
      this.ref.detectChanges();
    });
  }

  getAggregatedTestConformanceMetrics(): void {
    this.metricsSvc
      .getAggregatedTestConformanceMetrics()
      .subscribe((results) => {
        this.aggregatesCount = results.length;
        const children = results.map(function(metric) {
          return {
            name: metric.name,
            value: metric.weight,
            score: metric.value,
          };
        });
        this.conformanceScores = {
          name: 'root',
          children: [{ name: 'domains', children, score: 1 }],
        };
        this.ref.detectChanges();
      });
  }

  getLatestTestsTrend(limit: number = 7): void {
    this.metricsSvc.getLatestTestsTrend(limit).subscribe((results) => {
      let successCount = 0;
      let failureCount = 0;
      results.forEach((result) => {
        result.success ? successCount++ : failureCount++;
      });
      const ratio = successCount / results.length;
      /*
      if (ratio > 0.66) {
        this.testResultsDonutChartConfig.colors.SUCCESS = '#7bb33d';
      } else if (ratio < 0.33) {
        this.testResultsDonutChartConfig.colors.SUCCESS = '#dd1f26';
      } else {
        this.testResultsDonutChartConfig.colors.SUCCESS = '#efaa00';
      }
      this.testResultsDonutChartData = [
        ['SUCCESS', successCount],
        ['FAILURE', failureCount],
      ];
      */
      this.ref.detectChanges();
    });
  }

  /*
  handleChartFilterSelect($event: CardFilter): void {
    this.getInvocationsTrend(+$event.value);
  }

  handleTopFilterSelect($event: CardFilter): void {
    if ($event.value === 'yesterday') {
      this.getTopInvocations(new Date(this.today.getTime() - this.aDayLong));
    } else {
      this.getTopInvocations();
    }
  }

  handleTestsFilterSelect($event: CardFilter): void {
    this.getLatestTestsTrend(+$event.value);
  }
  */

  repositoryFilterFeatureLabelKey(): string {
    return this.config.getFeatureProperty('repository-filter', 'label-key');
  }
}
