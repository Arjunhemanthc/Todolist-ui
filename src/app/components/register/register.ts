import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  register(name: string, email: string, pass: string, confirmPass: string) {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (pass !== confirmPass) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }
    
    this.authService.register({ username: name, email, password: pass, confirmPassword: confirmPass }).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! You can now login.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Registration error:', err);
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && typeof err.error.text === 'string') {
          // Angular parses plain text errors into an object with a 'text' property when expecting JSON
          this.errorMessage = err.error.text;
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.error && err.error.errors) {
          // Flatten ASP.NET Core ValidationProblemDetails
          const messages = Object.values(err.error.errors).flat();
          this.errorMessage = messages.join(' ');
        } else {
          this.errorMessage = 'Registration failed: ' + JSON.stringify(err.error || err.message);
        }
        this.cdr.detectChanges();
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
