import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  baseURL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  uploadFile(file: any): Observable<any> {
    const resourceURL = `${this.baseURL}/files/excel/upload`;

    const formData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post(resourceURL, formData);
  }
}
