import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ClassService } from '../shared/services/class.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Class } from '../shared/model/Class';
import { AfterViewInit, Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './class-management.component.html',
  styleUrl: './class-management.component.scss'
})
export class ClassManagementComponent {
  isAdmin: string;
  classes?: Class[];
  @ViewChild('classForm', { static: false }) classForm: ElementRef | undefined;
  makeClassForm!: FormGroup;


  constructor(
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService,
    private classService: ClassService,
    private formBuilder: FormBuilder,
      ) {
    this.isAdmin = localStorage.getItem('isAdmin') == null ? "" : localStorage.getItem('isAdmin')!;
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

  refreshClassesTb() {
    this.classes = [];
    this.classService.getAll().subscribe({
      next: (data) => {
        this.classes = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  deleteClass(id: number) {
    this.classService.deleteClass(id).subscribe({
      next: (data) => {
        this.refreshClassesTb();
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    this.refreshClassesTb();
    this.makeClassForm = this.formBuilder.group({
      start: new Date(),
      duration: 0,
      maxPeople: 30,
      description: '',
      difficulty: '',
      type: '',
    })
  }

  classSubmit(){
    console.log('Form data:', this.makeClassForm.value);
    const fitnessclass: Class = {
      id: 1000000 + Math.floor(Math.random() * 30000),
      participants: [],
      start: this.makeClassForm.get('start')?.value,
      duration: this.makeClassForm.get('duration')?.value,
      maxPeople: this.makeClassForm.get('maxPeople')?.value,
      description: this.makeClassForm.get('description')?.value,
      type: this.makeClassForm.get('type')?.value,
      difficulty: this.makeClassForm.get('difficulty')?.value,
    };
    this.classService.createClass(fitnessclass).subscribe({
      next: (data) => {
        console.log(data);
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

  openForm() {
    this.renderer.setStyle(this.classForm?.nativeElement, 'display', 'block');

  }
  closeForm() {
    this.renderer.setStyle(this.classForm?.nativeElement, 'display', 'none');
  }


}


