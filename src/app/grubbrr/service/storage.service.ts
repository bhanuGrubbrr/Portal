import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/core/global-constants';
import { environment } from 'src/environments/environment';
import { UserDetailsModel } from '../core/models/userdetails.model';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private httpClient: HttpClient) {}
}
