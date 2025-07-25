import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ChartOptions, ChartType, ChartData } from 'chart.js';

interface DashboardData {
  awcsObserved: number;
  awcsNotObserved: number;
  observationTrends: Array<{month: string, value: number}>;
  notVisitedTrends: Array<{month: string, value: number}>;
  observationsByBlock: Array<{block: string, count: number}>;
  observationsByCadre: Array<{cadre: string, count: number}>;
}




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

// Line chart

public observationTrendData: ChartData<'line'> = {
  labels: ['Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [150, 180, 320],
      label: 'Observed',
      fill: false,
      tension: 0.4,
      borderColor: '#1976d2',
      pointBackgroundColor: '#1976d2',
      backgroundColor: '#1976d2'
    }
  ]
};

// Not Visited Trend Line Chart
public notVisitedTrendData: ChartData<'line'> = {
  labels: ['Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [220, 180, 120],
      label: 'Not Visited',
      fill: false,
      tension: 0.4,
      borderColor: '#f57c00',
      pointBackgroundColor: '#f57c00',
      backgroundColor: '#f57c00'
    }
  ]
};

// Line Chart Options
public lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: true }
  }
};

// Observations by Cadre Horizontal Bar Chart
public cadreChartData: ChartData<'bar'> = {
  labels: ['Supervisor', 'Sector Officer', 'CDPO'],
  datasets: [
    {
      label: 'Observations',
      data: [120, 80, 60],
      backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726'],
      borderRadius: 6,
      barPercentage: 0.6
    }
  ]
};

public horizontalBarOptions: ChartOptions<'bar'> = {
  indexAxis: 'y',
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { beginAtZero: true }
  }
};



  /// Bar Chart  

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label || ''}: ${context.parsed.y} AWCs`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { font: { size: 12 }, maxRotation: 90, minRotation: 45 },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'AWC Count' }
      }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: [
      'ARIYALUR',
      'CHENGALPATTU',
      'CHENNAI',
      'COIMBATORE',
      'CUDDALORE',
      'DHARMAPURI',
      'DINDIGUL',
      'ERODE',
      'KALLAKURICHI',
      'KANCHIPURAM',
      'KANYAKUMARI',
      'KARUR',
      'KRISHNAGIRI',
      'TIRUPPUR',
      'MADURAI',
      'NAGAPATTINAM',
      'NAMAKKAL',
      'NILGIRIS',
      'PERAMBALUR',
      'PUDUKKOTTAI',
      'RAMANATHAPURAM',
      'RANIPET',
      'SALEM',
      'SIVAGANGA',
      'TENKASI',
      'THANJAVUR',
      'THENI',
      'THOOTHUKUDI',
      'TIRUCHIRAPPALLI',
      'TIRUNELVELI',
      'TIRUPATTUR',
      'TIRUVALLUR',
      'TIRUVANNAMALAI',
      'TIRUVARUR',
      'VELLORE',
      'VILUPPURAM',
      'VIRUDHUNAGAR',
      'MAYILADUTHURAI'
    ],
    datasets: [
      {
        label: 'AWC Count',
        data: [1200, 1300, 2500, 2600, 2700, 2300, 700,1200, 1300, 2500,
               2600, 2700, 2300, 1100, 2300, 1100,1200, 1300, 2500,1300,
               2700, 2300, 1100,1200, 1300, 2500, 2600, 2700, 2300, 1100,
               1200, 1300, 2500,1300, 2500,2600, 200, 2300],
        backgroundColor: [
          '#5d87ff', '#5d87ff', '#5d87ff',
          '#5d87ff', '#5d87ff', '#5d87ff', '#FF6384' // example: last bar highlighted
        ],
        borderRadius: 6,
        barPercentage: 0.8
      }
    ]
  };




  
  selectedYear = '2024';
  selectedMonth = 'June';
  selectedBlock = 'All Blocks';
  selectedSector = 'All Sectors';
  
  dashboardData: DashboardData = {
    awcsObserved: 1200,
    awcsNotObserved: 800,
    observationTrends: [
      { month: 'Apr', value: 900 },
      { month: 'May', value: 400 },
      { month: 'Jun', value: 1200 }
    ],
    notVisitedTrends: [
      { month: 'Apr', value: 3 },
      { month: 'May', value: 8 },
      { month: 'Jun', value: 16 }
    ],
    observationsByBlock: [
      { block: 'Andimadam', count: 150 },
      { block: 'Ariyalur', count: 140 },
      { block: 'Jayankondam', count: 160 },
      { block: 'Sendurai', count: 200 },
      { block: 'T.Palur', count: 180 },
      { block: 'Thirumanur', count: 170 },
      { block: 'District Average', count: 165 }
    ],
    observationsByCadre: [
      { cadre: 'DPO', count: 80 },
      { cadre: 'CDPO', count: 192 },
      { cadre: 'Supervisors', count: 928 }
    ]
  };

  sideMenuOpen = true;
  activeMenuItem = 'overview';


  selectedDistrict: string = '';




  districtList = [
    { key: 'ARIYALUR', value: 'Ariyalur' },
    { key: 'CHENGALPATTU', value: 'Chengalpattu' },
    { key: 'CHENNAI', value: 'Chennai' },
    { key: 'COIMBATORE', value: 'Coimbatore' },
    { key: 'CUDDALORE', value: 'Cuddalore' },
    { key: 'DHARMAPURI', value: 'Dharmapuri' },
    { key: 'DINDIGUL', value: 'Dindigul' },
    { key: 'ERODE', value: 'Erode' },
    { key: 'KALLAKURICHI', value: 'Kallakurichi' },
    { key: 'KANCHIPURAM', value: 'Kanchipuram' },
    { key: 'KANYAKUMARI', value: 'Kanyakumari' },
    { key: 'KARUR', value: 'Karur' },
    { key: 'KRISHNAGIRI', value: 'Krishnagiri' },
    { key: 'TIRUPPUR', value: 'Tiruppur' },
    { key: 'MADURAI', value: 'Madurai' },
    { key: 'NAGAPATTINAM', value: 'Nagapattinam' },
    { key: 'NAMAKKAL', value: 'Namakkal' },
    { key: 'NILGIRIS', value: 'Nilgiris' },
    { key: 'PERAMBALUR', value: 'Perambalur' },
    { key: 'PUDUKKOTTAI', value: 'Pudukkottai' },
    { key: 'RAMANATHAPURAM', value: 'Ramanathapuram' },
    { key: 'RANIPET', value: 'Ranipet' },
    { key: 'SALEM', value: 'Salem' },
    { key: 'SIVAGANGA', value: 'Sivaganga' },
    { key: 'TENKASI', value: 'Tenkasi' },
    { key: 'THANJAVUR', value: 'Thanjavur' },
    { key: 'THENI', value: 'Theni' },
    { key: 'THOOTHUKUDI', value: 'Thoothukudi' },
    { key: 'TIRUCHIRAPPALLI', value: 'Tiruchirappalli' },
    { key: 'TIRUNELVELI', value: 'Tirunelveli' },
    { key: 'TIRUPATTUR', value: 'Tirupattur' },
    { key: 'TIRUVALLUR', value: 'Tiruvallur' },
    { key: 'TIRUVANNAMALAI', value: 'Tiruvannamalai' },
    { key: 'TIRUVARUR', value: 'Tiruvarur' },
    { key: 'VELLORE', value: 'Vellore' },
    { key: 'VILUPPURAM', value: 'Viluppuram' },
    { key: 'VIRUDHUNAGAR', value: 'Virudhunagar' },
    { key: 'MAYILADUTHURAI', value: 'Mayiladuthurai' }
  ];
  constructor(private http: HttpClient) {

   

   
  
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Replace with your actual API endpoint
    // this.http.get<DashboardData>('/api/dashboard-data').subscribe(
    //   data => {
    //     this.dashboardData = data;
    //   },
    //   error => {
    //     console.error('Error loading dashboard data:', error);
    //   }
    // );
  }

  toggleSideMenu(): void {
    this.sideMenuOpen = !this.sideMenuOpen;
  }

  setActiveMenuItem(item: string): void {
    this.activeMenuItem = item;
    
  }

  onFilterChange(): void {
    // Implement filter logic here
    this.loadDashboardData();
  }

  getObservationPercentage(): number {
    const total = this.dashboardData.awcsObserved + this.dashboardData.awcsNotObserved;
    return Math.round((this.dashboardData.awcsObserved / total) * 100);
  }

  getMaxBlockValue(): number {
    return Math.max(...this.dashboardData.observationsByBlock.map(b => b.count));
  }

  getMaxTrendValue(): number {
    return Math.max(...this.dashboardData.observationTrends.map(t => t.value));
  }

  getMaxNotVisitedValue(): number {
    return Math.max(...this.dashboardData.notVisitedTrends.map(t => t.value));
  }

  getMaxCadreValue(): number {
    return Math.max(...this.dashboardData.observationsByCadre.map(c => c.count));
  }
}