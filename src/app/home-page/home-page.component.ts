import { Component, OnInit } from '@angular/core';
import { AvancementService } from '../Services/avancement.service';
import * as $ from 'jquery';
import { PersonnelServiceService } from '../Services/personnel-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit{
  showLoader: boolean = true; // Contrôle l'affichage du chargement
  qualificationPersonnel :any ; 
  informationsAvancement : any; 
  test : number =0 ; 
  
  constructor(private router : Router , public service : AvancementService   , private servicePersonnel : PersonnelServiceService) { }

  ngOnInit(): void {
    // Appel à une fonction pour masquer le chargement après quelques secondes
    setTimeout(() => {
      this.hideLoader();
    }, 12000); // Délai de 12 secondes (ajustez selon vos besoins)
    this.getAllHistoriques() ;
  }

  hideLoader(): void {
    this.showLoader = false;
  }
  getAllHistoriques() {
    this.service.getAllHistoriquesRecent().subscribe(data => {
    this.service.Historiques = data;
    this.service.length_historiques =  this.service.Historiques.length() ; 
    console.log("length de tableau historiques : " + this.service.length_historiques);
      $(document).ready(function () {
        $('#example').DataTable();
      });  
    });
  }
  getAvancement(id : number){
    this.service.getAvancement(id).subscribe(data => {
      this.informationsAvancement = data;
      console.log("avancement selectionnee est : " +      this.informationsAvancement) ; 
    });
}
  transformerDate(timestamp: number) :string {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear(); // Utiliser getFullYear() pour l'année locale
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Utiliser getMonth() pour le mois local
    const day = ('0' + dateObj.getDate()).slice(-2); // Utiliser getDate() pour le jour local
  
    return `${year}-${month}-${day}`;
  }
  afficheQualificationPersonnel(mle :string):string{
    this.servicePersonnel.getPersonnel(mle).subscribe(data => {
      this.qualificationPersonnel = data.qualification;
      console.log("qualification Personnel Selectionnnééé "+  this.qualificationPersonnel ) ;
    });
    return  this.qualificationPersonnel  ;
  
  }
  deconnexion(){
    localStorage.clear();
    this.router.navigate([''])
  }
}