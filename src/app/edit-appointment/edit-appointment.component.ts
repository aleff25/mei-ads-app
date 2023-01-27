import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AppointmentsService } from '../services/appointments/appointments.service';
import { ClassroomsService } from '../services/classrooms/classrooms.service';
import { CurricularUnitsService } from '../services/curricular-units/curricular-units.service';
import { IAppointment, IGetAllAppointment } from '../shared/entities/appointment.interface';
import { IClassroom } from '../shared/entities/classroom.interface';
import { ICurricularUnit } from '../shared/entities/curricular-units.interface';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.sass']
})
export class EditAppointmentComponent implements OnInit {

  heroes$!: Observable<IAppointment>;
  selectedId!: string;

  classrooms: IClassroom[] = [];
  curricularUnits: ICurricularUnit[] = [];

  appointment!: IGetAllAppointment;
  classroom!: IClassroom;
  curricularUnit!: ICurricularUnit;

  classroomsName: any;
  curricularUnitsName: any;

  form={
    classroom:"",
    curricularUnit:""
  }

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentsService,
    private classroomsService: ClassroomsService,
    private curricularUnitsService: CurricularUnitsService) {}


  ngOnInit() {
    this.classroomsService.getAll().subscribe((data) => {
      this.classrooms = data;
      let classroomName = []
      for(let classroom of this.classrooms){
        classroomName.push(classroom.name);
      }
      this.classroomsName = [...new Set(classroomName)];

    });
    this.curricularUnitsService.getAll().subscribe( (data) => {
      this.curricularUnits = data
      let curricularUnitsName = []
      for(let curricularUnit of this.curricularUnits){
        curricularUnitsName.push(curricularUnit.name);
      }
      this.curricularUnitsName = [...new Set(curricularUnitsName)];
    });

    this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = params.get('id')!;
        return this.appointmentService.getById(this.selectedId);
      })
    ).subscribe((data: IGetAllAppointment) => {
      this.appointment = data;

      this.form.classroom = this.classrooms
        .filter(cl => cl.name === data.classroomEntity.name)[0].name;
      this.form.curricularUnit = this.curricularUnits
        .filter(cl => cl.name === data.curricularUnitEntity.name)[0].name;
    });
  }

  public onSubmit() {
    console.log('Editando');

    this.classroom = this.classrooms
        .filter(cl => cl.name === this.form.classroom)[0];
    this.curricularUnit = this.curricularUnits
        .filter(cl => cl.name === this.form.curricularUnit)[0];

    this.appointment = {
      ...this.appointment,
      classroom: this.classroom.id,
      curricularUnit: this.curricularUnit.id,
    };

    this.appointmentService.update(this.appointment)

  }

}
