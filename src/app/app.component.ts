import { Component } from '@angular/core';
import { ConvertirCvsTextoPaparseComponent } from './components/convertir-cvs-texto-paparse/convertir-cvs-texto-paparse.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConvertirCvsTextoPaparseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'temetraComercial';
}
