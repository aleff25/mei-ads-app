import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditAppointmentComponent } from './edit-appointment.component';

const routes: Routes = [
  {
    path: '',
    component: EditAppointmentComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditAppointmentRoutingModule { }
