import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, map } from 'rxjs';



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
  products = signal<Product[]>([]);
  categories = signal<string[]>(['All']);

  loading = signal(false);
  error = signal<string | null>(null);

  private http = inject(HttpClient);

  // Fetch from dummyjson as soon as the service is created
  private readonly apiBase = 'https://dummyjson.com';

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<{ products: any[] }>(`${this.apiBase}/products`)
      .pipe(
        map((res) => res.products ?? []),
        map((items) =>
          items.map((p) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            category: p.category,
            image: Array.isArray(p.images) && p.images.length ? p.images[0] : '#'
          }))
        ),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (products) => {
          this.products.set(products);

          // derive categories from API results
          const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
          this.categories.set(['All', ...unique]);

          // if currently selected category no longer exists, fall back to All
          const selected = this.selectedCategory();
          if (selected !== 'All' && !unique.includes(selected)) {
            this.selectedCategory.set('All');
          }
        },
        error: (err) => {
          this.error.set('Failed to load products');
          console.error(err);
        }
      });
  }



// Computed filtered products
  filteredProducts = computed(() => {
    const searchLower = this.searchText().toLowerCase();
    const category = this.selectedCategory();
    return this.products().filter(product => 
      product.name.toLowerCase().includes(searchLower) &&
      (category === 'All' || product.category === category)
    );
  });

  // UI-only: dummyjson does not support create via POST in this task.
  addProduct(productData: {name: string; price: number; category: string}): void {
    const newId = this.products().length > 0
      ? Math.max(...this.products().map(p => p.id)) + 1
      : 1;

    this.products.update(products => [
      ...products,
      { id: newId, name: productData.name, price: productData.price, category: productData.category, image: '#' }
    ]);
  }


  readonly categoriesForForm = this.categories.asReadonly();
}
