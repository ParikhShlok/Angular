import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, of } from 'rxjs';

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
  // UI state
  searchText = signal('');
  selectedCategory = signal('All');

  // Data
  products = signal<Product[]>([]);
  searchResults = signal<Product[]>([]);
  categories = signal<string[]>(['All']);

  loading = signal(false);
  error = signal<string | null>(null);

  // Searching (API)
  searching = signal(false);
  searchError = signal<string | null>(null);

  private http = inject(HttpClient);
  private readonly apiBase = 'https://dummyjson.com';

  constructor() {
    this.loadProducts();

    // Simple API search behavior is triggered from the component.
    // (Call this.searchFromApi() on ngModelChange.)
  }


  /** Call the API search once (debounce is intentionally removed for simplicity). */
  searchFromApi(): void {
    const q = (this.searchText() ?? '').trim();

    if (!q) {
      this.searchResults.set([]);
      return;
    }

    this.searching.set(true);
    this.searchError.set(null);

    this.http
      .get<any>(`${this.apiBase}/products/search?q=${encodeURIComponent(q)}`)
      .pipe(
        map((res) => res?.products ?? []),
        map((items) => (items as any[]).map((p) => this.toProduct(p))),
        catchError((err) => {
          this.searchError.set('Failed to search products');
          console.error(err);
          return of([] as Product[]);
        }),
        finalize(() => this.searching.set(false))
      )
      .subscribe((results) => {
        this.searchResults.set(results);
      });
  }

  private toProduct(p: any): Product {
    return {
      id: p.id,
      name: p.title,
      price: p.price,
      category: p.category,
      image: Array.isArray(p.images) && p.images.length ? p.images[0] : '#'
    };
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<{ products: any[] }>(`${this.apiBase}/products`)
      .pipe(
        map((res) => res.products ?? []),
        map((items) => items.map((p) => this.toProduct(p))),
        finalize(() => this.loading.set(false)),
        catchError((err) => {
          this.error.set('Failed to load products');
          console.error(err);
          return of([] as Product[]);
        })
      )
      .subscribe((products) => {
        this.products.set(products);

        const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
        this.categories.set(['All', ...unique]);

        const selected = this.selectedCategory();
        if (selected !== 'All' && !unique.includes(selected)) {
          this.selectedCategory.set('All');
        }
      });
  }

  // Uses API results when searchText is present; otherwise uses all loaded products.
  filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const q = (this.searchText() ?? '').trim();

    const base = q ? this.searchResults() : this.products();
    return base.filter((product) => category === 'All' || product.category === category);
  });

  addProduct(productData: { name: string; price: number; category: string }): void {
    this.loading.set(true);
    this.error.set(null);

    const body = {
      title: productData.name,
      price: productData.price,
      category: productData.category
    };

    this.http
      .post<any>(`${this.apiBase}/products/add`, body)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError((err) => {
          this.error.set('Failed to add product');
          console.error(err);
          return of(null);
        })
      )
      .subscribe(() => {
        this.loadProducts();
      });
  }

  readonly categoriesForForm = this.categories.asReadonly();
}


