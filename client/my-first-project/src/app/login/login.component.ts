import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ClassService } from '../shared/services/class.service';
import { Class } from '../shared/model/Class';
import { User } from '../shared/model/User';
import { UserService } from '../shared/services/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService, private classService: ClassService, private userService: UserService) { }

  login() {
    if (this.email && this.password) {
      this.errorMessage = '';
      this.authService.login(this.email, this.password).subscribe({
        next: (data) => {
          if (data) {
            localStorage.setItem('email', this.email)
            this.userService.isAdmin(this.email).subscribe({
              next: (data) => {
                console.log("User is admin: " + data);
                localStorage.setItem('isAdmin', data);
              }, error: (err) => {
                console.log("Admin access unsuccessful" + err);
              }
            });
            // navigation
            this.router.navigateByUrl('/welcome');
          }
        }, error: (err) => {
          console.log(err);
        },
      })
    } else {
      this.errorMessage = 'Form is empty.';
    }
  }

  navigate(to: string) {  
    this.router.navigateByUrl(to);
  }

  ngOnInit(): void {
    if (localStorage.getItem('email')){
      localStorage.removeItem('email');
    }
    if (localStorage.getItem('isAdmin')){
      localStorage.removeItem('isAdmin');
    }
  }

  loadDatabase() {
    var typeArray = ["Aerobic", "Yoga", "Pilates", "Zumba", "Spinning", "Cardio", "Erőedzés"]
    var difficultyArray = ["Kezdő", "Haladó", "Nehéz"]
    for (let i = 0; i < 20; i++) {
      var tempDate = new Date();
      tempDate.setFullYear(2024);
      tempDate.setMonth(6 + Math.floor(Math.random() * 7));
      tempDate.setDate(Math.floor(Math.random() * 30));
      tempDate.setHours(Math.floor(Math.random() * 25));
      var fitnessclass: Class = {
        id: 100000 + i,
        participants: [],
        start: tempDate,
        duration: Math.floor(Math.random() * 4) + 1,
        maxPeople: Math.floor(Math.random() * 30) + 10,
        description: 'No description',
        type: typeArray[Math.floor(Math.random() * 7)],
        difficulty: difficultyArray[Math.floor(Math.random() * 3)]

      };
      this.classService.createClass(fitnessclass).subscribe({
        next: (data) => {
          console.log(data);
        }, error: (err) => {
          console.log(err);
        }
      });
      
    } 
    this.userService.makeAdmin(true, "admin@admin.hu").subscribe({
      next: (data) => {
        console.log(data);
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  deleteDatabase(){
    this.classService.deleteAll().subscribe({
      next: (data) => {
        console.log(data);
      }, error: (err) => {
        console.log(err);
      }
    });
  }
}

