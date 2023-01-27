import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'schedule',
    loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule)
  },
  {
    path: 'create-appointment',
    loadChildren: () => import('./create-appointment/create-appointment.module').then(m => m.CreateAppointmentModule)
  },
  {
    path: 'edit-appointment',
    loadChildren: () => import('./edit-appointment/edit-appointment.module').then(m => m.EditAppointmentModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
