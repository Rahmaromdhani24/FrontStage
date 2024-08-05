import { Component, OnInit } from '@angular/core';
import { NavbarAnimationService } from '../navbar-animation.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AvancementService } from '../Services/avancement.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-av-ech',
  templateUrl: './av-ech.component.html',
  styleUrls: ['./av-ech.component.css']
})
export class AvEchComponent  implements OnInit {
  showLoader : boolean = true; 
  serverDate: Date | undefined;
  selectedDatee :string=""
  test : boolean=false ;
  constructor(private navbarAnimationService: NavbarAnimationService , private router : Router , public service :AvancementService) {}

  ngOnInit() {
    setTimeout(() => {
      this.hideLoader();
    }, 6000); // Délai de 3 secondes (ajustez selon vos besoins)
  
   // this.navbarAnimationService.initNavbarAnimation();
    this.getByDatePicker() ; 
    this.getAllAvancementsCeMois();
  }

  hideLoader(): void { this.showLoader = false;  }
   
  deconnexion(){
    localStorage.clear() ; 
    this.router.navigate(['']); 
  }
  getAllAvancements() {
    this.service.getAllAvancements().subscribe(data => {
      this.service.AvancementsData = data;
      $(document).ready(function () {
        $('#example1').DataTable();
      });
    });
  }

  getCurrentDateFormatted(): string {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // Mois de 0 à 11, on ajoute 1 pour avoir de 1 à 12
    let day = date.getDate();
  
    if (day > 15) {
      // Si le jour est supérieur à 15, on doit afficher le premier jour du mois avant
      month += 1;
      if (month === 0) {
        // Si le mois devient 0, cela signifie qu'on est en janvier, donc on passe à décembre de l'année précédente
        month = 12; // Décembre
        year -= 1; // Année précédente
      }
    }
  
    // Formater le mois et le jour en chaînes avec padding
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = '01'; // Toujours le premier jour du mois
  console.log("date d'aujord'huiiii"+`${year}-${formattedMonth}-${formattedDay}`)
    return `${year}-${formattedMonth}-${formattedDay}`;
  }
  
  getAllAvancementsCeMois() {
    
    this.service.getAvDeCeMoisGlobale(this.getCurrentDateFormatted()).subscribe(data => {
      this.service.AvancementsData = data;
      $(document).ready(function () {
        $('#example1').DataTable();
      });
    });
  }
   transformerDate(timestamp: number) :string {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear(); // Utiliser getFullYear() pour l'année locale
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Utiliser getMonth() pour le mois local
    const day = ('0' + dateObj.getDate()).slice(-2); // Utiliser getDate() pour le jour local
  
    return `${year}-${month}-${day}`;
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    
    if (selectedDate) {
      this.test = true ; 
      const year = selectedDate.getFullYear();
      const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + selectedDate.getDate()).slice(-2);
      const transformedDate = `${year}-${month}-${day}`;
      this.selectedDatee = transformedDate ;
    
      console.log("Date choisie transformée : " + transformedDate);
      this.getByDatePicker() ; 

    } else {
      console.log("Aucune date sélectionnée.");
      // logique pour gérer le cas où aucune date n'est sélectionnée
    }
  }
  getByDatePicker(){
    this.service.getAvDeCeMoisGlobale(this.selectedDatee).subscribe(data => {
      this.service.AvancementsData = data;
      $(document).ready(function () {
        $('#example2').DataTable();
      });
    });
  }
  
  
}