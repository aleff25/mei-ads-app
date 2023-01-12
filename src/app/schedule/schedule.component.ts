import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentsService } from '../services/appointments/appointments.service';
import { ClassroomsService } from '../services/classrooms/classrooms.service';
import { CoursesService } from '../services/courses/courses.service';
import { CurricularUnitsService } from '../services/curricular-units/curricular-units.service';
import { IAppointment, IGetAllAppointment } from '../shared/entities/appointment.interface';
import { IClassroom } from '../shared/entities/classroom.interface';
import { ICourse } from '../shared/entities/course.interface';
import { ICurricularUnit } from '../shared/entities/curricular-units.interface';
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.sass'],
})
export class ScheduleComponent {

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['courses',
    'curricularUnit',
    'shift',
    'date',
    'classroom',
    'capacityClassroom',
    'crowded',
    'capacity',
  ];


  selectedValue!: string;
  selectedCar!: string;

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  classrooms: IClassroom[] = [];
  courses: ICourse[] = [];
  curricularUnits: ICurricularUnit[] = [];

  classroom!: IClassroom;
  course!: ICourse;
  curricularUnit!: ICurricularUnit;

  appointments: IGetAllAppointment[] = [];
  dataSource: MatTableDataSource<IGetAllAppointment> = new MatTableDataSource(this.appointments);

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar: MatSnackBar,
    private classroomsService: ClassroomsService,
    private coursesService: CoursesService,
    private curricularUnitsService: CurricularUnitsService,
    private appointmentsService: AppointmentsService) {}

  ngOnInit() {
    this.classroomsService.getAll().subscribe( (data) => this.classrooms = data);
    this.coursesService.getAll().subscribe( (data) => this.courses = data);
    this.curricularUnitsService.getAll().subscribe( (data) => this.curricularUnits = data);
    this.appointmentsService.getAll().subscribe({
      error: (e) => this.snackBar.open(e.message, 'Fechar', { duration: 2500}),
      next: (data: IGetAllAppointment[]) => {
        this.appointments = data;
        this.dataSource = new MatTableDataSource(this.appointments);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit(): void {
    // Process checkout data here
    console.warn('Your order has been submitted');
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
