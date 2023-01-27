import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAppointmentComponent } from './edit-appointment.component';
import { ClassroomsService } from '../services/classrooms/classrooms.service';
import { AppointmentsService } from '../services/appointments/appointments.service';
import { CurricularUnitsService } from '../services/curricular-units/curricular-units.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { EditAppointmentRoutingModule } from './edit-appointment-routing.module';



@NgModule({
  declarations: [
    EditAppointmentComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatGridListModule,
    EditAppointmentRoutingModule
  ],
  providers: [
    ClassroomsService,
    CurricularUnitsService,
    AppointmentsService,
  ]
})
export class EditAppointmentModule { }
