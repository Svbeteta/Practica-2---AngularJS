import { Routes } from '@angular/router';
import { Crear} from './pages/crear/crear';
import { Actualizar} from './pages/actualizar/actualizar';
import { Seguimiento} from './pages/seguimiento/seguimiento';

export const routes: Routes = [
  { path: '', redirectTo: 'crear', pathMatch: 'full' },
  { path: 'crear', component: Crear},
  { path: 'actualizar', component: Actualizar},
  { path: 'seguimiento', component: Seguimiento},
  { path: '**', redirectTo: 'crear' }
];
