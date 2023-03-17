import { Component } from '@angular/core';
import {UploadService} from "../services/upload.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'csv_visual';

  files: File[] = [];


  matrix: number[][] = [];
  nodes : Array<{ id: number, startDate: string, endDate: string }> = [];

  constructor(private uploadService: UploadService) {
  }

  handleFileChange(event: File, index = 0) {
    if (!event) {
      return;
    }

    this.files[index] = event;
  }

  async uploadFiles() {
    try {
      const res = await firstValueFrom(this.uploadService.uploadFiles(this.files));

      this.matrix = res.matrix;
      this.nodes = res.nodes;
    } catch (e) {
      console.error(e)
    }
  }
}
