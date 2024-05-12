import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../shared/model/User';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users?: User[];
  userEmail: string;
  isAdmin: string;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router  
  ) { 
    this.userEmail = localStorage.getItem('email') == null ? "" : localStorage.getItem('email')!;
    this.isAdmin = localStorage.getItem('isAdmin') == null ? "" : localStorage.getItem('isAdmin')!;
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

  refreshUsers(){
    this.users = [];
    this.userService.getAll().subscribe({
      next: (data) => {
        data.forEach(element => {
          this.users?.push(element);
        });
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    this.refreshUsers();
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

  changeAdmin(email: string, admin: boolean){
    this.userService.makeAdmin(admin, email).subscribe({
      next: (data) => {
        console.log(data);
        this.refreshUsers();
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  deleteUser(email: string){
    this.userService.deleteUser(email).subscribe({
      next: (data) => {
        console.log(data);
        this.refreshUsers();
      }, error: (err) => {
        console.log(err);
      }
    })
  }

}
