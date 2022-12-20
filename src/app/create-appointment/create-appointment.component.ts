import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassroomsService } from '../services/classrooms/classrooms.service';
import { CoursesService } from '../services/courses/courses.service';
import { CurricularUnitsService } from '../services/curricular-units/curricular-units.service';
import { IClassroom } from '../shared/entities/classroom.interface';
import { ICourse } from '../shared/entities/course.interface';
import { ICurricularUnit } from '../shared/entities/curricular-units.interface';

import {NgbCalendar, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { Frequency, Options, RRule } from 'rrule';
import { Subject, takeUntil } from 'rxjs';

export function toNativeDate(ngbDate: NgbDate): Date {
  return new Date(Date.UTC(ngbDate.year, ngbDate.month - 1, ngbDate.day));
}

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
  frequency!: string;
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

  private today!: Date;
  private weekdayMap = [
    RRule.MO,
    RRule.TU,
    RRule.WE,
    RRule.TH,
    RRule.FR,
    RRule.SA,
    RRule.SU
  ];

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

  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private classroomsService: ClassroomsService,
    private coursesService: CoursesService,
    private curricularUnitsService: CurricularUnitsService) {}

  ngOnInit() {
    this.today = toNativeDate(this.calendar.getToday());
    this.date = this.calendar.getToday();
    this.initRecurringForm();
    this.subscribeToFormValue();
    // this.classroomsService.getAll().subscribe( (data) => this.classrooms = data)
    // this.coursesService.getAll().subscribe( (data) => this.courses = data)
    // this.curricularUnitsService.getAll().subscribe( (data) => this.curricularUnits = data)
  }

  public onSubmit() {
    console.log();

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
        startDate: [this.today, Validators.required],
        endDate: [toNativeDate(this.calendar.getNext(this.date, 'd', 7)), Validators.required],
        frequency: [Frequency.DAILY],
        onWeekday: this.fb.array(
          [false, false, false, false, false, false, false].
              map(val => this.fb.control(val))
      ),
        onMonthday: [this.today]
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
