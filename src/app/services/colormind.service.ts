import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestColormindColors } from '../models/request-colormind-colors';
import { ResponseColormindColors } from '../models/response-colormind-colors';

@Injectable({
  providedIn: 'root',
})
export class ColormindService {
  private baseUrl = 'http://colormind.io/api/';
  constructor(private httpClient: HttpClient) {}

  getColors(request: RequestColormindColors): Observable<any> {
    return this.httpClient.post<ResponseColormindColors>(this.baseUrl, JSON.stringify(request));
  }
}
