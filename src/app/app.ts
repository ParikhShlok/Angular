import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { Footer } from "./footer/footer";

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
imports: [Header, Sidebar, Footer, RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('first');
}
