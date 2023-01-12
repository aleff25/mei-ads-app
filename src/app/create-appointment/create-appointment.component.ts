import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ClassroomsService } from '../services/classrooms/classrooms.service';
import { CoursesService } from '../services/courses/courses.service';
import { CurricularUnitsService } from '../services/curricular-units/curricular-units.service';
import { IClassroom } from '../shared/entities/classroom.interface';
import { ICourse } from '../shared/entities/course.interface';
import { ICurricularUnit } from '../shared/entities/curricular-units.interface';

import {NgbCalendar, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { Frequency, Options, RRule } from 'rrule';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentsService } from '../services/appointments/appointments.service';

export function toNativeDate(ngbDate: NgbDate): Date {
  return new Date(Date.UTC(ngbDate.year, ngbDate.month - 1, ngbDate.day));
}

export enum Shift {
  DIURNO = 'DIURNO',
  TARDE = 'TARDE',
  POST_WORK = 'POST_WORK'
}

export const day_shecule = ['08:00', '08:30', '09:00', '09:30','10:00', '10:30','11:00', '11:30','12:00', '12:30','13:00', '13:30','14:00', '14:30','15:00', '15:30','16:00', '16:30','17:00'];
export const post_word_schedule = ['18:00', '18:30', '19:00', '19:30','20:00', '20:30', '21:00', '21:30', '22:00']

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.sass']
})
export class CreateAppointmentComponent implements OnInit {

  Frequency = Frequency;
  recurringForm!: FormGroup;
  hoveredDate: NgbDate | null = null;
  dates: Date[] = [];
  date!: NgbDate;
  frequency = Frequency.DAILY;
  frequencies = [{
      name: 'Diário',
      value: Frequency.DAILY
    },{
      name: 'Semanal',
      value: Frequency.WEEKLY
    },{
      name: 'Mensal',
      value: Frequency.MONTHLY
    }
  ];
  shift = Shift.DIURNO;
  shifts = [
    {
      name: 'Diurno',
      value: Shift.DIURNO
    },
    {
      name: 'Pós-laboral',
      value: Shift.POST_WORK
    },
  ];
  day_schedule = day_shecule;
  post_work_schedule = post_word_schedule;

  private today!: Date;
  private weekdayMap = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU];

  public classrooms: IClassroom[] = [];
  public courses: ICourse[] = [];
  public curricularUnits: ICurricularUnit[] = [];

  public classroom!: IClassroom;
  public course!: ICourse;
  public curricularUnit!: ICurricularUnit;

  private destroy$ = new Subject();

  get f(): any {
    return this.recurringForm.controls;
  }

  get weeklyForm(): FormArray {
    return this.recurringForm.controls['onWeekday'] as FormArray;
  }

  get classroomCapacity() {
    if (this.classroom) {
      return this.classroom.capacity;
    }
    return null;
  }

  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    private snackBar: MatSnackBar,
    public formatter: NgbDateParserFormatter,
    private classroomsService: ClassroomsService,
    private coursesService: CoursesService,
    private curricularUnitsService: CurricularUnitsService,
    private appointmentsService: AppointmentsService) {}

  ngOnInit() {
    this.classroomsService.getAll().subscribe( (data) => this.classrooms = data);
    this.coursesService.getAll().subscribe( (data) => this.courses = data);
    this.curricularUnitsService.getAll().subscribe( (data) => this.curricularUnits = data);
    this.today = toNativeDate(this.calendar.getToday());
    this.date = this.calendar.getToday();
    this.initRecurringForm();
    this.subscribeToFormValue();
  }

  public onSubmit() {
    this.snackBar.open('Realizando a criação do agendamento!', 'Fechar');

    const horaInicial = this.f.initial_time.value;
    const horaFinal = this.f.final_time.value;
    const { hour, minute } = this.getHourAndMinute(horaInicial);
    const startDates: Date[] = this.getDateWithHours(structuredClone(this.dates), hour, minute);
    const finalTime = this.getHourAndMinute(horaFinal);
    const  endDates: Date[] = this.getDateWithHours(structuredClone(this.dates), finalTime.hour, finalTime.minute);
    const appointment = {
      classroomId: this.f.classroom.value.id,
      capacity: this.f.capacity.value,
      courseId: this.f.course.value,
      curricularUnitId: this.f.curricularUnit.value,
      shift: this.f.shift.value,
      features: ['MASTER CLASSROOM'],
      startDates,
      endDates
    };

    this.appointmentsService.create(appointment);
  }


  private getHourAndMinute(time: string) {
    const hour = Number(time.split(':')[0]);
    const minute = time.includes('30') ? 30 : 0;

    return { hour, minute }
  }

  private getDateWithHours(dates: Date[], hour: number, minute: number) {
    return dates.map((d: Date) => {
      d.setHours(hour);
      d.setMinutes(minute);

      return d;
    });
  }

  onDateSelection(date: NgbDate): void {
    if (!this.f.startDate.value && !this.f.endDate.value) {
      this.f.startDate.setValue(date);
    } else if (this.f.startDate.value && !this.f.endDate.value && date && date.after(this.f.startDate.value)) {
      this.f.endDate.setValue(date);
    } else {
      this.f.endDate.setValue(null);
      this.f.startDate.setValue(date);
    }
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  setStartDate(value: string): void {
    this.f.startDate.setValue(this.validateInput(this.f.startDate.value, value));
  }

  setEndDate(value: string): void {
    this.f.endDate.setValue(this.validateInput(this.f.endDate.value, value));
  }

  private initRecurringForm(): void {
    this.recurringForm = this.fb.group({
        classroom: [Validators.required],
        capacity: [0, Validators.required],
        course: [Validators.required],
        curricularUnit: [Validators.required],
        startDate: [this.today, Validators.required],
        endDate: [toNativeDate(this.calendar.getNext(this.date, 'd', 7)), Validators.required],
        frequency: [Frequency.DAILY],
        onWeekday: this.fb.array(
          [false, false, false, false, false, false, false].
              map(val => this.fb.control(val))
      ),
        onMonthday: [this.today],
        shift: [Shift.DIURNO, Validators.required],
        initial_time: [day_shecule[0],Validators.required],
        final_time: [day_shecule[1],Validators.required],
    });

    // const weeklyForm = this.fb.group({
    //     mon: [null],
    //     tue: [null],
    //     wed: [null],
    //     thu: [null],
    //     fri: [null],
    //     sat: [null],
    //   }
    // );

    // this.weeklyForm.push(weeklyForm);
  }

  private subscribeToFormValue(): void {
    this.recurringForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      const options: Partial<Options> = {
        freq: value.frequency || Frequency.DAILY,
        dtstart: value.startDate || this.today,
        until: value.endDate || this.today,
        byweekday: value.frequency === Frequency.WEEKLY ?
          this.getWeekday(value.onWeekday) : null,
        bymonthday: value.frequency === Frequency.MONTHLY ?
          (value.onMonthday && value.onMonthday.day || this.date.day) : null
      };
      console.log('options', options);
      const rule = new RRule(options);
      this.dates = rule.all();
    });

    this.recurringForm.patchValue({
      startDate: this.today,
      endDate: toNativeDate(this.calendar.getNext(this.date, 'd', 7)),
      frequency: Frequency.DAILY
    });
  }

  private getWeekday(byWeekday: boolean[]): any {
    console.log(byWeekday);

    const result = byWeekday
      .map((v, i) => v && this.weekdayMap[i] || null)
      .filter(v => !!v);
    return result.length ? result : null;
  }

}
