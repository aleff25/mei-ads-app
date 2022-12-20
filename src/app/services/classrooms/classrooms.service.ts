import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IClassroom } from '../../shared/entities/classroom.interface';

@Injectable({
  providedIn: 'root'
})
export class ClassroomsService {

  baseURL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<IClassroom[]> {
    const resourceURL = `${this.baseURL}/classrooms`;
    return this.http.get<IClassroom[]>(resourceURL);
  }
}
