import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PersonnelServiceService } from '../Services/personnel-service.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AvancementService } from '../Services/avancement.service';
@Component({
  selector: 'app-avancement',
  templateUrl: './avancement.component.html',
  styleUrls: ['./avancement.component.css']
})
export class AvancementComponent implements OnInit ,AfterViewInit  {
  showLoader : boolean = true; 
  informationsAvancement: any 
  test : number =0 ; 
  qualificationPersonnel : string=""
  constructor(private router : Router , public service :AvancementService , private servicePersonnel :PersonnelServiceService) {}
  ngOnInit() {
     this.getAvancementsManquants()  ;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.hideLoader();
      this.initDataTable();
    }, 7000); // Délai de 3 secondes (ajustez selon vos besoins)
  }
  initDataTable() {
    $(document).ready(function() {
      $('#avancementsManquants').DataTable();
    });
  }
  hideLoader(): void { this.showLoader = false;  }
   
  deconnexion(){
    localStorage.clear() ; 
    this.router.navigate(['']); 
  }

  getAvancementsManquants(){
    this.service.getAllAvancementsManquants().subscribe(data => {
      this.service.avancementsManquants = data;
      $(document).ready(function () {
        $('#avancementsManquants').DataTable();
      });
    });
    
  }
  transformerDate(timestamp: number) :string {
    const dateObj = new Date(timestamp);
    const year = dateObj.getUTCFullYear();
    const month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2); // +1 car les mois vont de 0 à 11
    const day = ('0' + dateObj.getUTCDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  }
  parseDateString(dateString: string): Date | null {
    // Vérifiez si la chaîne est dans le format attendu
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      console.error('Date string format is incorrect');
      return null;
    }
  
    // Divisez la chaîne en parties
    const [year, day, month] = dateString.split('-').map(part => parseInt(part, 10));
  
    // Les mois en JavaScript sont de 0 (janvier) à 11 (décembre), il faut donc ajuster
    const date = new Date(year, month - 1, day);
  
    // Vérifiez que la date est valide
    if (isNaN(date.getTime())) {
      console.error('Invalid date');
      return null;
    }
  
    return date;
  }
  calculateAge(dateOfBirthString: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirthString);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Si le mois actuel est antérieur au mois de naissance ou si c'est le même mois mais le jour actuel est antérieur au jour de naissance
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  getAvancement(id : number){
    this.service.getAvancement(id).subscribe(data => {
      this.informationsAvancement = data;
      console.log("avancement selectionnee est : " +  this.informationsAvancement) ; 
    });
}
afficheQualificationPersonnel(mle :string):string{
  this.servicePersonnel.getPersonnel(mle).subscribe(data => {
    this.qualificationPersonnel = data.qualification;
    console.log("qualification Personnel Selectionnnééé "+  this.qualificationPersonnel ) ;
  });
  return  this.qualificationPersonnel  ;}


}
