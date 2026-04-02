import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-root',
  imports: [ Header, Sidebar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('first');
}
