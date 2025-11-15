import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-comparador-txt',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './comparador-txt.component.html',
  styleUrl: './comparador-txt.component.css'
})
export class ComparadorTxtComponent {
  archivoA = '';
archivoB = '';
resultado = '';

cargarArchivo(event: any, tipo: 'a' | 'b') {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (tipo === 'a') this.archivoA = reader.result as string;
    if (tipo === 'b') this.archivoB = reader.result as string;
  };
  reader.readAsText(file);
}

comparar() {
  if (!this.archivoA || !this.archivoB) {
    this.resultado = 'Falta cargar un archivo.';
    return;
  }

  const lineasA = this.archivoA.split(/\r?\n/);
  const lineasB = this.archivoB.split(/\r?\n/);

  let salida = '';

  const max = Math.max(lineasA.length, lineasB.length);

  for (let i = 0; i < max; i++) {
    const a = (lineasA[i] || '').trim();
    const b = (lineasB[i] || '').trim();

    if (a !== b) {
      salida += `Línea ${i + 1} distinta:\n  A → "${a}"\n  B → "${b}"\n\n`;
    }
  }

  this.resultado = salida || '✔ Ambos archivos son idénticos.';
}

}
