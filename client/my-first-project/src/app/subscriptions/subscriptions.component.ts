import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClassService } from '../shared/services/class.service';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { Class } from '../shared/model/Class';


@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent {
  classes?: Class[];
  userEmail: string;
  isAdmin: string;

  constructor(private router: Router, private authService: AuthService, private classService: ClassService, private userService: UserService) {
    this.userEmail = localStorage.getItem('email') == null ? "" : localStorage.getItem('email')!;
    this.isAdmin = localStorage.getItem('isAdmin') == null ? "" : localStorage.getItem('isAdmin')!;
   
  }

   refreshClassesTb(){
    this.classes = [];
    this.classService.getAll().subscribe({
      next: (data) => {
        data.forEach(element => {
          if (element.participants.indexOf(this.userEmail) > -1){
            element.start = new Date(element.start);
            this.classes?.push(element);  
            console.log(element);
          }
        });
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

  unsubscribe(id: number){
    this.classService.unsubscribe(id, this.userEmail).subscribe({
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
