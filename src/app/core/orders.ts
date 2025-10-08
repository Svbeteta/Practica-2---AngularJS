import { Injectable } from '@angular/core';

export type OrderStatus =
  | 'Creado'
  | 'En preparación'
  | 'En tránsito'
  | 'Entregado'
  | 'No entregado';

export interface Order {
  packageNumber: string;
  identifier: string;
  nombre: string;
  direccion: string;
  email: string;
  descripcion: string;
  historial: Array<{ fecha: Date; estado: OrderStatus; comentario: string; responsable: string }>;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private orders: Order[] = [];

  private transitions: Record<OrderStatus, OrderStatus[]> = {
  'Creado': ['En preparación'],
  'En preparación': ['En tránsito', 'No entregado'], 
  'En tránsito': ['Entregado', 'No entregado'],
  'Entregado': [],
  'No entregado': []
};


  getAll(): Order[] {
    return this.orders;
  }

  /** Crear: arranca en "Creado" */
  add(order: Order): void {
    if (!order.historial?.length) {
      order.historial = [{
        fecha: new Date(),
        estado: 'Creado',
        comentario: 'Orden creada',
        responsable: 'Sistema'
      }];
    }
    this.orders.push(order);
  }

  /** Buscar por número de paquete */
  getByPackageNumber(pkg: string): Order | undefined {
    return this.orders.find(o => o.packageNumber === pkg.trim());
  }

  /** Buscar por identificador (12 letras) */
  getByIdentifier(id: string): Order | undefined {
    const clean = (id ?? '').trim().toUpperCase();
    return this.orders.find(o => o.identifier.toUpperCase() === clean);
  }

  /** Último estado registrado */
  currentStatus(order: Order): OrderStatus {
    return order.historial[order.historial.length - 1].estado;
  }

  /** ¿La transición es válida? */
  canTransition(from: OrderStatus, to: OrderStatus): boolean {
    return this.transitions[from]?.includes(to) ?? false;
  }

  /** Próximos estados permitidos desde uno actual (0, 1 o 2) */
  nextStatuses(from: OrderStatus): OrderStatus[] {
    return this.transitions[from] ?? [];
  }

  /** Actualiza el estado con validaciones del enunciado */
  updateStatus(pkg: string, to: OrderStatus, comentario: string, responsable: string): void {
    const order = this.getByPackageNumber(pkg);
    if (!order) throw new Error('Orden no encontrada.');

    const from = this.currentStatus(order);
    if (!this.canTransition(from, to)) {
      throw new Error(`Transición inválida: ${from} → ${to}.`);
    }

    const c = (comentario ?? '').trim();
    if (c.length < 20 || c.length > 40) {
      throw new Error('El comentario debe tener entre 20 y 40 caracteres.');
    }

    const r = (responsable ?? '').trim();
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(r)) {
      throw new Error('El responsable solo puede contener letras y espacios.');
    }

    order.historial.push({
      fecha: new Date(),
      estado: to,
      comentario: c,
      responsable: r
    });
  }

  /** Generadores usados por la pantalla de creación */
  genPackageNumber(): string {
    const seq = (this.orders.length + 1).toString().padStart(4, '0');
    const year = new Date().getFullYear();
    return `ENV-${year}-${seq}`;
  }

  genIdentifier(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < 12; i++) {
      id += letters[Math.floor(Math.random() * letters.length)];
    }
    return id;


  }}