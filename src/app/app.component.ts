import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConvertidorComponent } from "./components/convertidor/convertidor.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConvertidorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'temetraComercial';
}
