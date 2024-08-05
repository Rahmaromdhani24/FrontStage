import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PersonnelServiceService } from 'src/app/Services/personnel-service.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { Personnel } from 'src/app/Models/Personnel';

@Component({
  selector: 'app-personnel-exceptionnel57-ans',
  templateUrl: './personnel-exceptionnel57-ans.component.html',
  styleUrls: ['./personnel-exceptionnel57-ans.component.css']
})
export class PersonnelExceptionnel57AnsComponent implements OnInit ,AfterViewInit  {
  showLoader : boolean = true; 
  informationsPersonnel: any // Personnel | null = null; 


  navText = 'Exceptionnel de 57 ans';

  constructor(private router : Router , public service :PersonnelServiceService) {}

  ngOnInit() {
    localStorage.removeItem('selectedPersonnel') ; 
    this.service.selectedPersonnel = null  ; 
     this.getAllPersonnels()  ;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.hideLoader();
      this.initDataTable();
    }, 4000); // Délai de 3 secondes (ajustez selon vos besoins)
  }
  initDataTable() {
    $(document).ready(function() {
      $('#homePersonnels').DataTable();
    });
  }
  hideLoader(): void { this.showLoader = false;  }
  
  updateNavText(text: string) {
    this.navText = text;
  }

  getAllPersonnels() {
    this.service.getAllPersonnelsException57ansCeMois().subscribe(data => {
      this.service.PersonnelsData = data;
      $(document).ready(function () {
        $('#homePersonnels').DataTable();
      });
    });
  }
  transfomerDate(timestamp: number): string {
    const dateObj = new Date(timestamp);
    dateObj.setDate(dateObj.getDate() + 1); // Increment the day by 1
    const year = dateObj.getUTCFullYear();
    const month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2); // +1 because months are 0-based
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
  afficheInformations(mle :string){
    this.service.getPersonnel(mle).subscribe(data => {
      this.informationsPersonnel = data;
      console.log("Personnel Selectionnnééé "+  this.informationsPersonnel ) ;
    });
  }
  toggleSelection(personnel: Personnel): void {
    const currentSelectedPersonnel = this.service.getSelectedPersonnel();
    
    // Désélectionner l'ancien personnel s'il existe
    if (currentSelectedPersonnel) {
      this.service.removePersonnel(currentSelectedPersonnel);
    }
  
    // Sélectionner le nouveau personnel
    this.service.addPersonnel(personnel);
  }

  isPersonnelSelected(personnel: Personnel): boolean {
    return this.service.getSelectedPersonnel() === personnel;
  }

  deconnexion(){
    localStorage.clear() ; 
    this.router.navigate(['']); 
  }
}
