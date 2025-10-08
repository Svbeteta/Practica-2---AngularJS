import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { OrdersService } from '../../core/orders';
import { CommonModule } from '@angular/common';

/** Solo letras (incluye tildes y ñ) y espacios */
function onlyLetters(control: AbstractControl): ValidationErrors | null {
  const v = (control.value ?? '').trim();
  return v && /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(v) ? null : { onlyLetters: true };
}

/** Email únicamente de gmail.com u outlook.com */
function gmailOrOutlook(control: AbstractControl): ValidationErrors | null {
  const v = (control.value ?? '').trim().toLowerCase();
  if (!v) return { required: true };
  const ok = /^[^\s@]+@(?:gmail\.com|outlook\.com)$/i.test(v);
  return ok ? null : { domain: true };
}

/**
 * Valida longitud entre min y max IGNORANDO espacios en blanco.
 * Cuenta solo caracteres no-espacio.
 */
function lengthBetween(min: number, max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value ?? '') as string;
    const noSpacesLen = raw.replace(/\s+/g, '').length; // <-- ignora espacios
    return noSpacesLen >= min && noSpacesLen <= max
      ? null
      : { lengthBetween: { min, max } };
  };
}

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear.html',
  styleUrl: './crear.scss'
})
export class Crear {
  private fb = inject(FormBuilder);
  private orders = inject(OrdersService);

  submitted = false;
  generatedPackage = '';
  generatedId = '';

  readonly minDesc = 40;
  readonly maxDesc = 120;

  form = this.fb.group({
    nombre: ['', [Validators.required, onlyLetters]],
    direccion: ['', [Validators.required]],
    email: ['', [gmailOrOutlook]],
    descripcion: ['', [Validators.required, lengthBetween(40, 120)]],
  });

  get f() { return this.form.controls; }

  // Estado del botón
  get canCreate(): boolean {
    return this.form.valid;
  }

  // Contadores de descripción (IGNORAN espacios)
  get descLen(): number {
    const value = (this.form.value.descripcion ?? '') as string;
    return value.replace(/\s+/g, '').length;
  }
  get descLeft(): number {
    return Math.max(this.minDesc - this.descLen, 0);
  }

  // Mensajes para la alerta de requisitos
  get missingMessages(): string[] {
    const msgs: string[] = [];
    const nombre = this.f.nombre;
    const direccion = this.f.direccion;
    const email = this.f.email;
    const descripcion = this.f.descripcion;

    if (nombre.errors) {
      if (nombre.errors['required']) msgs.push('El nombre del destinatario es obligatorio.');
      if (nombre.errors['onlyLetters']) msgs.push('El nombre solo debe contener letras y espacios.');
    }

    if (direccion.errors) {
      if (direccion.errors['required']) msgs.push('La dirección de destino es obligatoria.');
    }

    if (email.errors) {
      if (email.errors['required']) msgs.push('El email de contacto es obligatorio.');
      if (email.errors['domain']) msgs.push('El email debe ser de dominio gmail.com u outlook.com.');
    }

    if (descripcion.errors) {
      if (descripcion.errors['required']) msgs.push('La descripción del paquete es obligatoria.');
      if (descripcion.errors['lengthBetween']) {
        msgs.push(`La descripción debe tener entre ${this.minDesc} y ${this.maxDesc} caracteres (sin contar espacios).`);
      }
    }

    return msgs;
  }

  get showAlert(): boolean {
    return this.submitted && this.form.invalid;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.generatedPackage = this.orders.genPackageNumber();
    this.generatedId = this.orders.genIdentifier();

    this.orders.add({
      packageNumber: this.generatedPackage,
      identifier: this.generatedId,
      nombre: this.f.nombre.value!.trim(),
      direccion: this.f.direccion.value!.trim(),
      email: this.f.email.value!.trim(),
      // Guardamos el texto tal cual lo escribió el usuario; si quieres limpiarlo, lo ajustamos.
      descripcion: this.f.descripcion.value!.trim(),
      historial: []
    });

    // Modal de confirmación (Bootstrap)
    const bootstrap = (window as any).bootstrap;
    const modalEl = document.getElementById('confirmModal');
    if (bootstrap && modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }

    this.form.reset();
    this.submitted = false;
  }
}
