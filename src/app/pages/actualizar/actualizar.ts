import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OrdersService, Order, OrderStatus } from '../../core/orders';

@Component({
  selector: 'app-actualizar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actualizar.html',
  styleUrl: './actualizar.scss'
})
export class Actualizar {
  private fb = inject(FormBuilder);
  private ordersSvc = inject(OrdersService);

  // Buscar
  searchForm = this.fb.group({
    packageNumber: ['', [Validators.required]]
  });

  // Actualizar (con validadores)
  updateForm = this.fb.group({
    nextStatus: ['', [Validators.required]],
    comentario: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(40)]],
    responsable: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)]]
  });

  // Getters para template
  get uf() { return this.updateForm.controls; }
  get canSave(): boolean {
    return !!this.nextList.length && this.updateForm.valid;
  }

  // Contador de comentario
  readonly minComment = 20;
  readonly maxComment = 40;
  get commentLen(): number { return ((this.updateForm.value.comentario ?? '') as string).length; }
  get commentLeft(): number { return Math.max(this.minComment - this.commentLen, 0); }

  // Estado UI
  found: Order | null = null;
  current: OrderStatus | null = null;
  nextList: OrderStatus[] = [];
  errorMsg = '';

  // Datos del modal
  modalTitle = 'Actualización realizada';
  modalPkg = '';
  modalFrom: OrderStatus | '' = '';
  modalTo: OrderStatus | '' = '';

  onSearch() {
    this.errorMsg = '';
    this.found = null;
    this.current = null;
    this.nextList = [];

    const pkg = this.searchForm.value.packageNumber?.trim() || '';
    const order = this.ordersSvc.getByPackageNumber(pkg);

    if (!order) {
      this.errorMsg = 'No se encontró una orden con ese número de paquete.';
      return;
    }

    this.found = order;
    this.current = this.ordersSvc.currentStatus(order);
    this.nextList = this.ordersSvc.nextStatuses(this.current);
    this.updateForm.reset();
    if (this.nextList.length) this.updateForm.patchValue({ nextStatus: this.nextList[0] });
  }

  onUpdate() {
    this.errorMsg = '';
    if (!this.found || !this.current) return;

    // Bloquea si el form es inválido o no hay siguientes estados
    if (this.updateForm.invalid || !this.nextList.length) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const to = this.updateForm.value.nextStatus as OrderStatus;
    const comentario = (this.updateForm.value.comentario ?? '').toString();
    const responsable = (this.updateForm.value.responsable ?? '').toString();

    try {
      // Persistir cambio
      this.ordersSvc.updateStatus(this.found.packageNumber, to, comentario, responsable);

      // Datos para el modal
      this.modalPkg = this.found.packageNumber;
      this.modalFrom = this.current!;
      this.modalTo = to;

      // Recalcular estado/posibles
      this.current = this.ordersSvc.currentStatus(this.found);
      this.nextList = this.ordersSvc.nextStatuses(this.current);

      // Mostrar modal Bootstrap
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bootstrap = (window as any).bootstrap;
      const el = document.getElementById('updateModal');
      if (bootstrap && el) {
        const modal = new bootstrap.Modal(el);
        modal.show();
      }

      // Reset form y preselección del siguiente
      this.updateForm.reset();
      if (this.nextList.length) this.updateForm.patchValue({ nextStatus: this.nextList[0] });

    } catch (e: unknown) {
      this.errorMsg = e instanceof Error ? e.message : 'Error al actualizar.';
    }
  }
}
