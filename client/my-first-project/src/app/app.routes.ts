import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'welcome', loadComponent: () => import('./welcome/welcome.component').then((c) => c.WelcomeComponent), canActivate: [authGuard] },
    { path: 'user-management', loadComponent: () => import('./user-management/user-management.component').then((c) => c.UserManagementComponent), canActivate: [authGuard] },
    { path: 'calendar', loadComponent: () => import('./calendar/calendar.component').then((c) => c.CalendarComponent) },
    { path: 'subscriptions', loadComponent: () => import('./subscriptions/subscriptions.component').then((c) => c.SubscriptionsComponent) },
    { path: 'class-management', loadComponent: () => import('./class-management/class-management.component').then((c) => c.ClassManagementComponent) },
    { path: '**', redirectTo: 'login' }
];
