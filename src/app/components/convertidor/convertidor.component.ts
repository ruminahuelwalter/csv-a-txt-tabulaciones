import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-convertidor',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
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

      // 🔹 Elegí la celda que querés usar como nombre del archivo:
      // Ejemplo: segunda columna de la primera fila
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
