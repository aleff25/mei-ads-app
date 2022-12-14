import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import { ScheduleRoutingModule } from './schedule-routing.module';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentsService } from '../services/appointments/appointments.service';
import { HttpClientModule } from '@angular/common/http';
import { ClassroomsService } from '../services/classrooms/classrooms.service';
import { CoursesService } from '../services/courses/courses.service';
import { CurricularUnitsService } from '../services/curricular-units/curricular-units.service';

@NgModule({
  declarations: [
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ScheduleRoutingModule
  ],
  providers: [
    ClassroomsService,
    CoursesService,
    CurricularUnitsService,
    AppointmentsService,
  ]
})
export class ScheduleModule { }
