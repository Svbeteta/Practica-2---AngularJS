import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OrdersService, Order } from '../../core/orders';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './seguimiento.html',
  styleUrl: './seguimiento.scss'
})
export class Seguimiento{
  private fb = inject(FormBuilder);
  private ordersSvc = inject(OrdersService);

  form = this.fb.group({
    identifier: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{12}$/)]]
  });

  found: Order | null = null;
  historyAsc: { fecha: Date; estado: string; comentario: string; responsable: string }[] = [];
  errorMsg = '';

  onSearch() {
    this.errorMsg = '';
    this.found = null;
    this.historyAsc = [];

    const id = this.form.value.identifier?.toString() ?? '';
    const order = this.ordersSvc.getByIdentifier(id);

    if (!order) {
      this.errorMsg = 'No se encontró una orden con ese identificador.';
      return;
    }

    this.found = order;

    this.historyAsc = [...order.historial].sort((a, b) =>
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  }
}
