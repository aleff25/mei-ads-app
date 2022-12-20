import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICurricularUnit } from '../../shared/entities/curricular-units.interface';

@Injectable()
export class CurricularUnitsService {

  baseURL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ICurricularUnit[]> {
    const resourceURL = `${this.baseURL}/curricular-units`;
    return this.http.get<ICurricularUnit[]>(resourceURL);
  }
}
