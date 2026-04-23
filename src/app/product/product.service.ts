import { Injectable, computed, signal } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // State signals (writable for two-way binding)
  searchText = signal('');
  selectedCategory = signal('All');

  // Data signals
  products = signal<Product[]>([
    { id: 1, name: 'iPhone 14', price: 80000, category: 'Mobile', image: '#' },
    { id: 2, name: 'Nike Shoes', price: 5000, category: 'Footwear', image: '#' },
    { id: 3, name: 'Laptop', price: 60000, category: 'Electronics', image: '#' },
    { id: 4, name: 'T-Shirt', price: 1000, category: 'Clothing', image: '#' }
  ]);

  categories = signal(['All', 'Mobile', 'Footwear', 'Electronics', 'Clothing']);

// Computed filtered products
  filteredProducts = computed(() => {
    const searchLower = this.searchText().toLowerCase();
    const category = this.selectedCategory();
    return this.products().filter(product => 
      product.name.toLowerCase().includes(searchLower) &&
      (category === 'All' || product.category === category)
    );
  });

  // Add new product
  addProduct(productData: {name: string; price: number; category: string}): void {
    const newId = this.products().length > 0 
      ? Math.max(...this.products().map(p => p.id)) + 1 
      : 1;
    this.products.update(products => [...products, { id: newId, image: '#', ...productData }]);
  }

  readonly categoriesForForm = this.categories.asReadonly();
}
