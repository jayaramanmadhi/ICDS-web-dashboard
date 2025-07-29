import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MatSort } from '@angular/material/sort';
import { CoursesService } from '../shared/services/courses/courses.service'
import { switchMap } from 'rxjs/operators';
interface DashboardData {
  awcsObserved: number;
  awcsNotObserved: number;
  observationTrends: Array<{ month: string, value: number }>;
  notVisitedTrends: Array<{ month: string, value: number }>;
  observationsByBlock: Array<{ block: string, count: number }>;
  observationsByCadre: Array<{ cadre: string, count: number }>;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  showChart = true;
  isLoading = false;


  districtData: any[] = [];
  

  @ViewChild('chartCanvas') chartCanvas;

  @ViewChild(MatSort) sort: MatSort;
  sortDirection: 'asc' | 'desc' = 'asc';

  toggleView() {
    this.showChart = !this.showChart;
  }


  dashboardStatusData = {
    completed: 194,
    inProgress: 45,
    notCompleted: 21
  };

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
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
          label: function (context) {
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
        data: [1200, 1300, 2500, 2600, 2700, 2300, 700, 1200, 1300, 2500,
          2600, 2700, 2300, 1100, 2300, 1100, 1200, 1300, 2500, 1300,
          2700, 2300, 1100, 1200, 1300, 2500, 2600, 2700, 2300, 1100,
          1200, 1300, 2500, 1300, 2500, 2600, 200, 2300],
        backgroundColor: [
          '#5d87ff', '#5d87ff', '#5d87ff',
          '#5d87ff', '#5d87ff', '#5d87ff', '#FF6384' // example: last bar highlighted
        ],
        borderRadius: 6,
        barPercentage: 0.8
      }
    ]


  };

  displayedColumns = ['slNo', 'district', 'available', 'observed'];
  dataSource = new MatTableDataSource([
    { district: 'Chennai', available: 1200, observed: 1100 },
    { district: 'Madurai', available: 1000, observed: 850 },
    { district: 'Coimbatore', available: 950, observed: 920 },
    { district: 'Salem', available: 800, observed: 700 },
    { district: 'Erode', available: 650, observed: 620 },
    { district: 'Trichy', available: 1200, observed: 1150 },
    { district: 'Thanjavur', available: 900, observed: 870 }
  ]);

  selectedYear = '2025';
  selectedMonth = 'July';
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

  downloadExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workbook = { Sheets: { 'AWC Data': worksheet }, SheetNames: ['AWC Data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    FileSaver.saveAs(new Blob([excelBuffer]), 'awc-observation.xlsx');
  }

  downloadChart() {
    const chartEl = document.getElementById('chartCanvas') as HTMLCanvasElement;
    if (chartEl) {
      const url = chartEl.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'awc-observation-chart.png';
      link.click();
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sort.active = 'observed';
    this.sort.direction = this.sortDirection;
    this.sort.sortChange.emit({ active: 'observed', direction: this.sortDirection });
  }

  constructor(private service: CoursesService) {}

  ngOnInit(): void {
    console.log('test');
    console.log('test');

    this.service.loginWithEmail().pipe(
      switchMap((loginRes) => {
        console.log('Login Success:', loginRes);
        return this.service.fetchUser(); // call fetchUser only after login
      })
    ).subscribe({
      next: (userRes) => {
        console.log('User Fetched:', userRes);
        this.loadDashboardData();
        this.loadDistrictData()
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
    
  }

  loadDashboardData(): void {
   // Load state Api 
   this.isLoading = true;
   this.service.getStatewiseData().subscribe({
    next: (res) => {
      this.isLoading = false;
      console.log(res,'dashboard data ');
      
     },
    error: (err) => console.error('Statewise API Error:', err),
  });
  }

  loadDistrictData(): void {
    // Load state Api 
    this.isLoading = true;
    this.service.postDistrictData().subscribe({
     next: (res) => {
      this.isLoading = false;
      console.log(res,'district Data ');
      
     },
     error: (err) => console.error('Statewise API Error:', err),
   });
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