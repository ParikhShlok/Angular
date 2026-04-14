import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { Footer } from "./footer/footer";
import { ProductComponent as Product } from "./product/product";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
imports: [Header, Sidebar, Footer, Product, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('first');
}
