import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(email: string, pass: string) {
    this.errorMessage = '';
    this.authService.login({ email, password: pass }).subscribe({
      next: (res: any) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', res.token);
        this.router.navigate(['/todos']);
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
