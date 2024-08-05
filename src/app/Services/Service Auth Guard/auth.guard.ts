import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PersonnelServiceService } from '../personnel-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: PersonnelServiceService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.authService.getToken();
    if (token) {
      return true; 
    } else {
      this.router.navigate(['/login']); 
      return false;
    }
  }
}
