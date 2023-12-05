import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ImageUploadResponseModel,
  ImageUrlsResponse,
} from '../core/models/ImageUploadResponseModel';
import { LoggingService } from './logging.service';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private httpClient: HttpClient) {}

  uploadImages(
    locationId: string,
    formData: FormData
  ): Observable<ImageUploadResponseModel> {
    return this.httpClient.post<ImageUploadResponseModel>(
      `${API_URL}/location/${locationId}/image/upload`,
      formData
    );
  }

  uploadCompanyImages(
    companyId: string,
    formData: FormData
  ): Observable<ImageUploadResponseModel> {
    return this.httpClient.post<ImageUploadResponseModel>(
      `${API_URL}/company/${companyId}/image/upload`,
      formData
    );
  }

  uploadUrl(locationId: string, url: string): Observable<ImageUrlsResponse> {
    return this.httpClient.post<ImageUrlsResponse>(
      `${API_URL}/location/${locationId}/image/url`,
      { url }
    );
  }

  removeImage(
    locationId: string,
    storagePath: string
  ): Promise<ImageUrlsResponse> {
    const body = { url: storagePath };
    return firstValueFrom(
      this.httpClient.post<ImageUrlsResponse>(
        `${API_URL}/location/${locationId}/image/delete`,
        body
      )
    );
  }

  async upload(
    locationId: string,
    fileName: string,
    file: File,
    progressUpdate?: (loaded: number, total: number) => void
  ): Promise<ImageUrlsResponse> {
    const token = localStorage.getItem('access_token');
    const request = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      request.onreadystatechange = (e) => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject(request);
        }
      };

      request.open(
        'POST',
        `${environment.apiUrl}/location/${locationId}/image/${fileName}`
      );
      request.setRequestHeader('authorization', `Bearer ${token}`);
      request.responseType = 'json';

      if (progressUpdate)
        request.upload.addEventListener(
          'progress',
          (ev: ProgressEvent<EventTarget>) =>
            progressUpdate(ev.loaded, ev.total)
        );

      request.send(file);
    });
  }
}
