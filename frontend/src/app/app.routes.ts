import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { TaskList } from './components/task-list/task-list';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'login',    component: Login },
  { path: 'register', component: Register },
  {
    path: 'tasks',
    component: TaskList,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/new',        
    component: TaskList,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/edit/:id',   
    component: TaskList,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'tasks' }
];