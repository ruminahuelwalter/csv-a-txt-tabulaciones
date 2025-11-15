import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import Papa from 'papaparse';

@Component({
  selector: 'app-convertir-cvs-texto-paparse',
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
  templateUrl: './convertir-cvs-texto-paparse.component.html',
  styleUrl: './convertir-cvs-texto-paparse.component.css'
})
export class ConvertirCvsTextoPaparseComponent {
  convertedText: string = '';
  fileName: string = '';
  defaultFileName: string = 'convertido';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (result) => {
        let rows: string[][] = result.data as string[][];

        // Limpieza general: trim y normalización de fechas
        rows = rows.map(cols =>
          cols.map(c => this.normalizarFechaCSV(c.trim()))
        );

        // Nombre generado desde columna 0 comenzando en fila 2
        const nombres = new Set<string>();
        rows.slice(1).forEach(r => {
          const valor = r[0]?.trim();
          if (valor) nombres.add(valor);
        });

        const nombreUnido = Array.from(nombres).join('-') || 'convertido';
        this.fileName = nombreUnido;

        // Crear texto TAB con CRLF como Excel
        this.convertedText = rows
          .map(r => r.join('\t'))
          .join('\r\n');
      }
    });
  }

  downloadTxt() {
    if (!this.convertedText) return;
    const finalName =
      (this.fileName.trim() || this.defaultFileName || 'convertido') + '.txt';

    const blob = new Blob([this.convertedText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // -----------------------------------------------------
  // Normaliza fechas exactamente como Excel
  // Ej:
  // 01/09/2025 00:00:00 → 1/9/2025 00:00
  // -----------------------------------------------------
  normalizarFechaCSV(valor: string): string {
    // Busca patrón: dd/mm/yyyy HH:MM:SS o d/m/yyyy …
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
    const m = valor.match(regex);

    if (!m) return valor; // no es fecha, no tocar
    
    let [, d, mth, y, hh, mm] = m;

    // expandir año si viene como 25
    if (y.length === 2) y = '20' + y;

    // Excel no pone ceros a la izquierda en día/mes
    const dia = Number(d).toString();
    const mes = Number(mth).toString();

    return `${dia}/${mes}/${y} ${hh}:${mm}`;
  }
}
