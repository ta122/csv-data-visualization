import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-upload-section',
  templateUrl: './upload-section.component.html',
  styleUrls: ['./upload-section.component.scss']
})
export class UploadSectionComponent {
  @Input() title: string = 'Drag \'n drop or click here to upload';
  @Input() inputId: string = 'file-input';

  @Output() onNewFile: EventEmitter<File> = new EventEmitter<File>();

  file: File | null = null;

  onFileDropped(event: any) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (!files.length) {
      return;
    }

    this.file = files[0];

    this.onNewFile.emit(files[0]);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  openFileSelector() {
    document.getElementById(this.inputId)?.click();
  }

  onInputFileChange(event: any) {
    const files = event.target.files;

    if (!files.length) {
      return;
    }

    this.file = files[0];

    this.onNewFile.emit(files[0]);
  }
}
