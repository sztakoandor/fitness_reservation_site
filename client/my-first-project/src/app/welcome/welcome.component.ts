import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  userEmail: string;
  isAdmin: string;
  constructor(private router: Router, private authService: AuthService) {
    this.userEmail = localStorage.getItem('email') == null ? "" : localStorage.getItem('email')!;
    this.isAdmin = localStorage.getItem('isAdmin') == null ? "" : localStorage.getItem('isAdmin')!;
   }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl('/login');
      }, error: (err) => {
        console.log(err);
      }
    })
  }
}
