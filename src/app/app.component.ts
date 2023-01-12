import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from './services/files/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'mei-ads-app';

  constructor(private fileService: FileService,
    private snackBar: MatSnackBar,) {}

  csvInputChange(fileInputEvent: any) {
    this.fileService
      .uploadFile(fileInputEvent.target.files[0])
      .subscribe({
        next: () => console.log(),
        error: (e) => this.snackBar.open(e.message, 'Fechar', { duration: 2500}),
        complete: () => this.snackBar.open('Criação do agendamento realizada com sucesso!', 'Fechar', { duration: 2500})
      })
    }
}
