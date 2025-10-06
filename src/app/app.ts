import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar} from './components/layout/navbar/navbar';
import { Footer} from './components/layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {}
