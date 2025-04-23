import { AuthService } from './service/auth.service';
import { Component, OnInit } from '@angular/core'; // Добавили OnInit
import { RouterLink, RouterLinkActive, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { // Реализуем OnInit
  title = 'bookstore-app';
  isAuthenticated$!: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  // // FE-8c: Определение метода для выполнения выхода пользователя.
  logout(): void {
    console.log('Logout button clicked. Calling authService.logout...');
    // // FE-3: Этот вызов сервиса инициируется событием (кликом) и обращается к API.
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful (next callback). Navigating...');
        this.router.navigate(['/']);
        console.log('Navigation attempt finished.');
      },
      error: (error) => {
        console.error('Logout failed (error callback):', error);
        this.router.navigate(['/']);
      },
      complete: () => {
        console.log('Logout observable completed.');
      }
    });
    console.log('Subscribe called.');
  }
}