import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList implements OnInit {
  todos: any[] = [];
  successMessage: string = '';
  
  currentPage: number = 1;
  pageSize: number = 5;

  statuses = ['To do', 'In progress', 'In review', 'Done'];

  constructor(private todoService: TodoService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: (data) => {
        this.todos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  get paginatedTodos() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.todos.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.todos.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  updateStatus(todo: any, newStatus: string) {
    // Optimistic UI update
    const previousStatus = todo.status;
    todo.status = newStatus;

    this.todoService.updateTodo(todo.id, newStatus).subscribe({
      next: () => {
        this.successMessage = 'Status updated!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err) => {
        // Revert on failure
        todo.status = previousStatus;
        console.error('Status update failed:', err);
        alert('Failed to update status in the database. Is your backend running?');
        this.cdr.detectChanges();
      }
    });
  }

  deleteTodo(id: number) {
    // Optimistic UI removal
    const todoIndex = this.todos.findIndex(t => t.id === id);
    const removedTodo = this.todos[todoIndex];
    if (todoIndex > -1) {
      this.todos.splice(todoIndex, 1);
    }

    // Handle pagination edge case when deleting last item on page
    const isLastItemOnPage = this.paginatedTodos.length === 0;
    if (isLastItemOnPage && this.currentPage > 1) {
      this.currentPage--;
    }

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.successMessage = 'Todo deleted successfully!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        // Revert on failure
        if (removedTodo) {
          this.todos.splice(todoIndex, 0, removedTodo);
        }
        console.error('Delete failed:', err);
        alert('Failed to delete todo in the database.');
        this.cdr.detectChanges();
      }
    });
  }
}
