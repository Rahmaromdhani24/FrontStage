import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PersonnelServiceService } from '../Services/personnel-service.service';
@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {

  public constructor(private router : Router  , private servicePersonnel : PersonnelServiceService) { }

  ngOnInit() {}
   
  passwordFieldType: string = 'password';

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login(f: NgForm) {
    if (f.valid) {
      const matricule = f.value.matricule;
      const pwd = f.value.pwd;
      console.log("Matricule :" + matricule + "     pwd :" + pwd);
      this.servicePersonnel.loginn(matricule, pwd).subscribe(
        token => {
          console.log('Token:', token);
          localStorage.setItem('token', token);
          this.router.navigate(["/accueil"])
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Matricule ou mot de passe incorrect !! ',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
        }
      );
    }
  }
}