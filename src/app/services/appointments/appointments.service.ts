import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAppointment, ICreateAppointment, IGetAllAppointment } from '../../shared/entities/appointment.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  baseURL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<IGetAllAppointment[]> {
    const resourceURL = `${this.baseURL}/appointments`;
    return this.http.get<IGetAllAppointment[]>(resourceURL);
  }

  create(appointment: ICreateAppointment): void {
    const resourceURL = `${this.baseURL}/appointments`;
    this.http.post(resourceURL, appointment)
      .subscribe((res) => console.log(res));
  }
}
