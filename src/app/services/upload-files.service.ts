import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  baseApiUrl = "https://localhost:5001/api/";
  apiUrlPost = this.baseApiUrl + "upload";
  apiUrlGet = this.baseApiUrl + "download";

  constructor(private httpClient : HttpClient) { }

  public sendParametersToCheckDecoder(formData : FormData) : Observable<Object>
  {
    return this.httpClient.post(this.apiUrlPost, formData);
  }

  public downloadFile(file: string): Observable<HttpEvent<Blob>> {
    //return this.httpClient.get<HttpEvent<Blob>(this.apiUrlGet, {params:file});
    return this.httpClient.request(new HttpRequest(
      'GET',
      `${this.apiUrlGet}?file=${file}`,
      null,
      {
        reportProgress: false,
        responseType: 'blob'
      }));
  }
}
