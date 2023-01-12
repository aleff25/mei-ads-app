import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { IAppointment, ICreateAppointment, IGetAllAppointment } from '../../shared/entities/appointment.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  baseURL = 'http://localhost:8080';

  constructor(private http: HttpClient,
    private snackBar: MatSnackBar) { }

  getAll(): Observable<IGetAllAppointment[]> {
    const resourceURL = `${this.baseURL}/appointments`;
    return this.http.get<IGetAllAppointment[]>(resourceURL);
  }

  create(appointment: ICreateAppointment): void {
    const resourceURL = `${this.baseURL}/appointments`;
    this.http.post(resourceURL, appointment)
      .subscribe({
        next: () => console.log(),
        error: (e) => this.snackBar.open(e.message, 'Fechar', { duration: 2500}),
        complete: () => this.snackBar.open('Criação do agendamento realizada com sucesso!', 'Fechar', { duration: 2500})
      });
  }
}
