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
  /* convertedText : string = '';
  fileName : string = '';
  defaultFileName : string = 'convertido'; // valor por defecto

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csv = e.target.result as string;


      const lines = csv.trim().split(/\r?\n/);


      // const rows = lines.map(line => line.split(',')); // Version anterior

      // Procesar filas/campos removiendo comillas como Excel
      const rows = lines.map(line => {
        const cols = line.split(',').map(campo => {
          const trimmed = campo.trim();
          if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
            return trimmed.slice(1, -1); // quitar comillas exteriores
          }
          return trimmed;
        });
        return cols;
      });

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
    a.download = `${finalName}.txt`;

    a.click();
    window.URL.revokeObjectURL(url);
  } */

  convertedText: string = '';
  fileName: string = '';
  defaultFileName: string = 'convertido';

  // Opciones de limpieza
  removeInnerTabs = true;           // convertir tabs internas en espacio
  collapseMultipleSpaces = true;   // colapsar varios espacios seguidos
  //expandTwoDigitYear = false;      // si true: 01/01/25 -> 01/01/2025 (asume 2000+)

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csv = e.target.result as string;

      // 1) Separar líneas de forma segura
      const lines = csv.split(/\r?\n/);

      // 2) Parsear CSV respetando comillas (similar a RFC 4180)
      const rows = lines
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => this.parseCsvLine(line))
        .map(fields => fields.map(f => this.cleanField(f)));

      // 3) Generar nombre de archivo desde columna 0 (puedes cambiar índice)
      const nombres = new Set<string>();
      rows.slice(1).forEach(cols => {
        const val = (cols[0] || '').trim();
        if (val) nombres.add(val);
      });
      const nombreUnido = Array.from(nombres).join('-') || 'convertido';
      //this.defaultFileName = nombreUnido;
      this.fileName = nombreUnido;

      this.convertedText = rows.map(cols => {
          console.log('entro a normalizar')
          const normalizados = cols.map(c => (c.trim()));
          return normalizados.join('\t');
        })
        .join('\r\n');
    };

    reader.readAsText(file);
  }

  // Descarga
  downloadTxt() {
    if (!this.convertedText) return;
    const finalName = (this.fileName.trim() || this.defaultFileName || 'convertido') + '.txt';
    const blob = new Blob([this.convertedText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // ---------- Helpers ----------
  // Parser de una línea CSV que respeta comillas y "" escapadas
  parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const next = line[i + 1];

      if (ch === '"' && next === '"') {
        // doble comilla -> literal "
        cur += '"';
        i++; // saltar la segunda comilla
        continue;
      }

      if (ch === '"') {
        inQuotes = !inQuotes;
        continue; // no agregamos la comilla al campo
      }

      if (ch === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
        continue;
      }

      // cualquier otro caracter lo agregamos
      cur += ch;
    }

    // push ultima columna
    result.push(cur);
    return result;
  }

  // Limpieza de campo para imitar Excel: quitar comillas externas ya manejadas,
  // reemplazar tabs internas, colapsar espacios repetidos
  cleanField(raw: string): string {
    let s = raw.trim();

    if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
      s = s.slice(1, -1);
    }

    if (this.removeInnerTabs) {
      s = s.replace(/\t+/g, ' ');
    }

    if (this.collapseMultipleSpaces) {
      s = s.replace(/ {2,}/g, ' ');
    }

    return s;
  }

}
