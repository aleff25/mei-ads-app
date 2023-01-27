import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppointmentsService } from '../services/appointments/appointments.service';
import { ClassroomsService } from '../services/classrooms/classrooms.service';
import { CoursesService } from '../services/courses/courses.service';
import { CurricularUnitsService } from '../services/curricular-units/curricular-units.service';
import { IGetAllAppointment } from '../shared/entities/appointment.interface';
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

  private sort!: MatSort;

  @ViewChild(MatSort, {
    static: false
  }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  displayedColumns: string[] = [
    'courseEntity.name',
    'curricularUnitEntity.name',
    'courseEntity.shift',
    'startDate',
    'classroomEntity.name',
    'classroomEntity.capacity',
    'caracteristic',
    'capacityRequired',
    'action'
  ];

  editAddCompanyDetailsTable : boolean[] = [];
  workingCopy?: IGetAllAppointment;

  form={
    course:"",
    classroom:"",
    curricularUnit:""
  }

  classrooms: IClassroom[] = [];
  courses: ICourse[] = [];
  curricularUnits: ICurricularUnit[] = [];

  classroom!: IClassroom;
  course!: ICourse;
  curricularUnit!: ICurricularUnit;

  appointments: IGetAllAppointment[] = [];
  dataSource: MatTableDataSource<IGetAllAppointment> = new MatTableDataSource(this.appointments);
  coursesName: any;
  classroomsName:any;
  curricularUnitsName:any;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private classroomsService: ClassroomsService,
    private coursesService: CoursesService,
    private curricularUnitsService: CurricularUnitsService,
    private appointmentsService: AppointmentsService) {}

  ngOnInit() {
    this.classroomsService.getAll().subscribe((data) => {
      this.classrooms = data;
      let classroomName = []
      for(let classroom of this.classrooms){
        classroomName.push(classroom.name);
      }
      this.classroomsName = [...new Set(classroomName)];

    });
    this.coursesService.getAll().subscribe( (data) => {
      this.courses = data
      let coursesName = []
      for(let course of this.courses){
        coursesName.push(course.name);
      }
      this.coursesName = [...new Set(coursesName)];

    });
    this.curricularUnitsService.getAll().subscribe( (data) => {
      this.curricularUnits = data
      let curricularUnitsName = []
      for(let curricularUnit of this.curricularUnits){
        curricularUnitsName.push(curricularUnit.name);
      }
      this.curricularUnitsName = [...new Set(curricularUnitsName)];

    });
    this.appointmentsService.getAll().subscribe({
      error: (e) => this.snackBar.open(e.message, 'Fechar', { duration: 2500}),
      next: (data: IGetAllAppointment[]) => {
        this.appointments = data;
        this.dataSource = new MatTableDataSource(this.appointments);

        setTimeout(() => {
          this.dataSource.sort = this.sort;

          this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: any) => {
            return this.getPropertyByPath(data, sortHeaderId);
          };
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit(): void {
    this.dataSource.filterPredicate = function(data, filter) {

      let filterArray = filter.split("|");

      // 1 selected
      if((filterArray[0].length>0 && filterArray[1].length == 0 && filterArray[2].length == 0)||
      (filterArray[0].length==0 && filterArray[1].length >0 && filterArray[2].length==0)||
      (filterArray[0].length==0 && filterArray[1].length ==0 && filterArray[2].length>0))
      return  data.classroomEntity.name === filterArray[0]
      || data.courseEntity.name === filterArray[1]
      || data.curricularUnitEntity.name === filterArray[2]

      //2 selected
      if(filterArray[0].length>0 && filterArray[1].length>0 && filterArray[2].length==0)
      return  data.classroomEntity.name === filterArray[0]
      && data.courseEntity.name === filterArray[1]

      else if(filterArray[0].length>0 && filterArray[1].length==0 && filterArray[2].length>0)
      return  data.classroomEntity.name === filterArray[0]
      && data.curricularUnitEntity.name === filterArray[2]

      else if(filterArray[0].length==0 && filterArray[1].length>0 && filterArray[2].length>0)
      return  data.courseEntity.name === filterArray[1]
      && data.curricularUnitEntity.name === filterArray[2]
      //3 selected
      else
      return  data.classroomEntity.name === filterArray[0]
      && data.courseEntity.name === filterArray[1]
      && data.curricularUnitEntity.name === filterArray[2]

    };
      /*
      && data.courseEntity.name === filter
      && data.curricularUnitEntity.name === filter
      */
    if(this.form.classroom )
    this.dataSource.filter=this.form.classroom+"|"+this.form.course+"|"+this.form.curricularUnit


  }

  getPropertyByPath(obj: Object, pathString: string): any {
    return pathString.split('.').reduce((o, i) => (o as any)[i], obj);
  }

  editSchedule(element: any) {
    console.log(element);

    this.router.navigate(['edit-appointment', {id: element.id}]);
  }

}
