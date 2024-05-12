import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClassService } from '../shared/services/class.service';
import { AuthService } from '../shared/services/auth.service';
import { Class } from '../shared/model/Class';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  classes?: Class[];
  userEmail: string;
  isAdmin: string;


  constructor(private router: Router, private authService: AuthService, private classService: ClassService) {
    this.userEmail = localStorage.getItem('email') == null ? "" : localStorage.getItem('email')!;
    this.isAdmin = localStorage.getItem('isAdmin') == null ? "" : localStorage.getItem('isAdmin')!;
    console.log(this.isAdmin + "asdasd");
   }

   refreshClassesTb(){
    this.classes = [];
    this.classService.getAll().subscribe({
      next: (data) => {
        this.classes = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

  subscribeToClass(id: number){
    this.classService.subscribeToClass(id, this.userEmail).subscribe({
      next: (data) => {
        this.refreshClassesTb();
      }, error: (err) => {
        console.log(err);
      }
    });
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

  ngOnInit() {
    this.refreshClassesTb();
  }
}

