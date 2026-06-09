import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { TodoList } from './components/todo-list/todo-list';
import { TodoCreate } from './components/todo-create/todo-create';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'todos',
    canActivate: [authGuard],
    component: TodoList
  },
  {
    path: 'todos/add',
    canActivate: [authGuard],
    component: TodoCreate
  }
];