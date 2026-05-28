import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from './product.service';



@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductComponent {
  public productService = inject(ProductService);
  fb = inject(FormBuilder);
  form = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required]
  });
  showForm = signal(false);

  onToggleForm() {
    this.showForm.update(show => !show);
  }

  addProduct() {
    if (this.form.valid) {
      const value = this.form.value;
      this.productService.addProduct({
        name: value.name!,
        price: value.price!,
        category: value.category!
      });
      this.form.reset({ name: '', price: 0, category: '' });
      this.showForm.set(false);
    }
  }
}

