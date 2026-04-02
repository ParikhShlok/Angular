import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  menu :Array<string> = ["Home", "About", "Contact"];
  onButtonClick() {
    console.log('Button was clicked!');
  }
  styles: string[] = [
    'Western',
    'Classic',
    'Wedding',
    'Casual',
    'Formal'
  ];

  selectedStyle: string = '';

  onSelect(event: any) {
    this.selectedStyle = event.target.value;
    console.log("Selected:", this.selectedStyle);
  }
}

