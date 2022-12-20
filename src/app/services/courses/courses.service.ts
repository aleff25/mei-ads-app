import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICourse } from '../../shared/entities/course.interface';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  baseURL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ICourse[]> {
    const resourceURL = `${this.baseURL}/courses`;
    return this.http.get<ICourse[]>(resourceURL);
  }
}
