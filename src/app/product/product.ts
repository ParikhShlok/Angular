import { Component } from '@angular/core';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  products = [
    {
      name: 'iPhone 14',
      price: 80000,
      category: 'Mobile',
      image: '#'
    },
    {
      name: 'Nike Shoes',
      price: 5000,
      category: 'Footwear',
      image: '#'
    },
    {
      name: 'Laptop',
      price: 60000,
      category: 'Electronics',
      image: '#'
    }
  ];
}
