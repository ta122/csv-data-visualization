import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ADJ_FILE, NODE_FILE} from "../constants/files-fields.constant";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) {
  }

  uploadFiles(files: File[]): Observable<{ message: string; matrix: number[][],nodes : Array<{ id: number, startDate: string, endDate: string }> }> {
    if (!files || !files.length || files.length < 2 || files.length > 2) {
      throw new Error('You should include 2 files!');
    }

    const formData = new FormData();

    const [node_list, adjacency_matrix] = files;

    formData.append(ADJ_FILE, adjacency_matrix);
    formData.append(NODE_FILE, node_list);

    return this.http.post<{ message: string; matrix: number[][],nodes:Array<{ id: number, startDate: string, endDate: string }> }>('http://localhost:3000/upload', formData);
  }
}
