import { Component, OnInit } from '@angular/core';
import { AvancementService } from '../Services/avancement.service';
import { HistoriquesFilesService } from '../Services/Services Files/historiques-files.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tableau-avancement',
  templateUrl: './tableau-avancement.component.html',
  styleUrls: ['./tableau-avancement.component.css']
})
export class TableauAvancementComponent implements OnInit{

  showLoader: boolean = true;
  searchTerm: string = '';
  historiquesAv: { key: string, value: any[] }[] = [];
  files: { fileName: string, size: any }[] = []; // Initialisation de files ici


constructor(private router : Router , public  serviceAvancement : AvancementService  , 
            private fileService : HistoriquesFilesService){}


ngOnInit() {
  setTimeout(() => {
    this.hideLoader();
  }, 4000); 
this.serviceAvancement.testTelechargement = 0 ; 
this.telechargementsHoraire();
this.telechargementsMensuel();

}

hideLoader(): void { this.showLoader = false;  }


get filteredFiles() {
  return this.files.filter(file =>
    file.fileName.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

telechargementsMensuel() {
  this.serviceAvancement.getHistoriquesMensuel().subscribe(
      (data: any) => {  
        console.log('Données reçues de l\'API (mensuel) :', data);        
        Object.keys(data).forEach(key => {
          this.serviceAvancement.testTelechargement = 1 ; 
        this.serviceAvancement.getSizeMensuel(key).subscribe((sizee) => {
        console.log("Taille reçue pour " + key + " : " + sizee);
        this.files.push({
          fileName: "Avancement Mensuel " + key,
          size: sizee + ' MB'
        });
      },
      error => {
        console.error('Erreur lors de la récupération de la taille pour ' + key + ' :', error);
      });
    });

    console.log('Files après transformation (mensuel) :', this.files);
  },
      error => {
        console.error('Erreur lors de la récupération des historiques avancés (mensuel) :', error);
      }
    );   
}

telechargementsHoraire() {
  this.serviceAvancement.getHistoriquesHoraire().subscribe(
      (data: any) => {
     console.log('Données reçues de l\'API (horaire) :', data);        
        Object.keys(data).forEach(key => {
        this.serviceAvancement.testTelechargement = 1 ; 
        this.serviceAvancement.getSizeHoraire(key).subscribe((sizee) => {
        console.log("Taille reçue pour " + key + " : " + sizee);
        this.files.push({
          fileName: "Avancement Horaire " + key,
          size: sizee + ' MB'
        });
      },
      error => {
        console.error('Erreur lors de la récupération de la taille pour ' + key + ' :', error);
      });
    });

    console.log('Files après transformation (mensuel) :', this.files);
  },
      error => {
        console.error('Erreur lors de la récupération des historiques avancés (horaire) :', error);
      }
    );
}

download(fileName : string){
  let parts = fileName.split(" ");

if(fileName.includes("Avancement Horaire")){
  let key = parts[2];
  console.log("dateeee" +key) ; 
  this.fileService.downloadPDFHoraire(key);
}


if(fileName.includes("Avancement Mensuel")){
  let key = parts[2];
  console.log("dateeee" +key) ; 
  this.fileService.downloadPDFMensuel(key);

}
}

downloadExcel(fileName : string){
  let parts = fileName.split(" ");

  if(fileName.includes("Avancement Horaire")){
    let key = parts[2];
    console.log("dateeee" +key) ; 
   this.fileService.generateExcelHoraire(key);
}
  
  
  if(fileName.includes("Avancement Mensuel")){
    let key = parts[2];
    this.fileService.generateExcelMensuel(key);
  }
}
deconnexion(){
  localStorage.clear() ; 
  this.router.navigate(['']) ; 

}
}
