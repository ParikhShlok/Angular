import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductComponent {

  searchText = signal('');
  selectedCategory = signal('All');

  products = signal<Product[]>([
    { id: 1, name: 'iPhone 14', price: 80000, category: 'Mobile', image: '#' },
    { id: 2, name: 'Nike Shoes', price: 5000, category: 'Footwear', image: '#' },
    { id: 3, name: 'Laptop', price: 60000, category: 'Electronics', image: '#' },
    { id: 4, name: 'T-Shirt', price: 1000, category: 'Clothing', image: '#' }
  ]);

  categories = signal(['All', 'Mobile', 'Footwear', 'Electronics', 'Clothing']);

  filteredProducts = computed(() => {
    const searchLower = this.searchText().toLowerCase();
    const category = this.selectedCategory();
    return this.products().filter(product => 
      product.name.toLowerCase().includes(searchLower) &&
      (category === 'All' || product.category === category)
    );
  });
}
