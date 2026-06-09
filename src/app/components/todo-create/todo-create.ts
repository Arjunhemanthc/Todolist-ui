import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo';

@Component({
  selector: 'app-todo-create',
  imports: [CommonModule],
  templateUrl: './todo-create.html',
  styleUrl: './todo-create.css',
})
export class TodoCreate {
  successMessage: string = '';

  constructor(private todoService: TodoService, private router: Router, private cdr: ChangeDetectorRef) {}

  addTodo(title: string, description: string) {
    this.successMessage = '';
    const newTodo = { title, description };
    this.todoService.addTodo(newTodo).subscribe({
      next: () => {
        this.successMessage = 'Todo added successfully! Redirecting...';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/todos']);
          this.cdr.detectChanges();
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }
}
