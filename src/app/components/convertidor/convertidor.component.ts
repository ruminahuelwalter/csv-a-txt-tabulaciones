import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-convertidor',
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  
  ],
  templateUrl: './convertidor.component.html',
  styleUrl: './convertidor.component.css'
})
export class ConvertidorComponent {
  convertedText : string = '';
  fileName : string = '';
  defaultFileName : string = 'convertido'; // valor por defecto

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csv = e.target.result as string;
      const lines = csv.trim().split('\n');
      const rows = lines.map(line => line.split(','));

      // Seleccionar la celda a usar como nombre del archivo:
      // Primera columna de la segunda fila
      let nameFromCsv = 'convertido';
      if (rows.length > 0 && rows[0].length > 1) {
        nameFromCsv = rows[1][0].trim() || 'convertido';
      }
       // Guardamos el nombre detectado y lo mostramos editable
      this.defaultFileName = nameFromCsv;
      this.fileName = nameFromCsv;

      // Convertir a texto delimitado por tabulaciones
      this.convertedText = rows.map(cols => cols.join('\t')).join('\n');
    };

    reader.readAsText(file);
  }

  downloadTxt() {
    if (!this.convertedText) return;

    const finalName = this.fileName.trim() || this.defaultFileName || 'convertido';
    const blob = new Blob([this.convertedText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Guardar con el nombre extraído
    a.download = `${this.fileName}.txt`;

    a.click();
    window.URL.revokeObjectURL(url);
  }
}
