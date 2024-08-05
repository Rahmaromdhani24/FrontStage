import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonnelServiceService } from '../Services/personnel-service.service';
import { AvancementService } from '../Services/avancement.service';
import { Avancement } from '../Models/Avancement';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FileService } from '../Services/file.service';
import { FileMensuleService } from '../Services/Services Files/file-mensule.service';
import { FileHoraireService } from '../Services/Services Files/file-horaire.service';


@Component({
  selector: 'app-barr',
  templateUrl: './barr.component.html',
  styleUrls: ['./barr.component.css'],
  providers: [DatePipe] // Ajouter DatePipe ici
})
export class BarrComponent implements OnInit {
  @ViewChildren(NgModel) inputs!: QueryList<NgModel>;

  showLoader: boolean = true; 
  sanctionsPersonnels: any = [];
  lengthSanctionsPersonnel: number = 0; 
 
  constructor(private fileService: FileService , public  datePipe: DatePipe , private fileMensuelService : FileMensuleService , 
   private fileHoraireService : FileHoraireService , public serviceAvancement: AvancementService, private router: Router, public servicePersonnel: PersonnelServiceService) {}

  ngOnInit() {
    setTimeout(() => {
      this.hideLoader();
    }, 3000); 
    this.serviceAvancement.loadSelectedAvancements();
    this.updateSanctionsStatus();
  }

  hideLoader(): void {
    this.showLoader = false;
  }

  formatDate(timestamp: number): string {
    if (timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  updateDate(avancement: Avancement, field: keyof Avancement, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.valueAsDate) {
      const date = inputElement.valueAsDate;
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      (avancement[field] as number) = date.getTime();
    }
  }

  annulation() {
    this.serviceAvancement.selectedAvancements = [] ; 
    localStorage.removeItem('selectedAvancements') ; 
    this.router.navigate(['/avancementHoraire']);
  }

  updateSanctionsStatus() {
    this.serviceAvancement.selectedAvancements.forEach(avancement => {
      this.serviceAvancement.getNombreSanctionsPersonnels18Mois(avancement.tpersonnel.mle).subscribe(data => {
        avancement.hasSanctions = data > 0;
      });
    });
  }
  sauvegardeAvancements(): void {
    this.serviceAvancement.selectedAvancements.forEach(avancement => {
      const idAvancement = avancement.id;
      const san1Value = avancement.san1 !== undefined ? avancement.san1 : null;
      const san2Value = avancement.san2 !== undefined ? avancement.san2 : null;
      const noteValue = avancement.note;
      const observationValue = avancement.observation !== undefined ? avancement.observation : null;
  
      console.log("idAvancement: " + idAvancement + ", san1: " + san1Value + ", san2: " + san2Value + ", note: " + noteValue + ", observation: " + observationValue);
  
      this.serviceAvancement.addHistorique(idAvancement, noteValue, san1Value, san2Value, observationValue).subscribe({
        next: () => {        
        
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde de l\'avancement pour ID ' + idAvancement + ':', error);
          Swal.fire({
            icon: "error",
            title: 'Erreur lors de la sauvegarde !!',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
        }
      });
    });
  
    localStorage.removeItem('selectedAvancements') ;  // Effacer le localStorage après la sauvegarde
    this.annulation() ; 
  }
  
  
  
  getSanctionsPersonnels18Mois(mle: string): any {
    this.serviceAvancement.getSanctionsPersonnels18Mois(mle).subscribe(data => {
      this.sanctionsPersonnels = data;
    });
    return this.sanctionsPersonnels; 
  }
  ajouterUnJour(dateString: string): Date {
    let date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date;
  }
  deconnexion() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  downloadPDFMensuel(): void {
    this.fileMensuelService.downloadPDFMensuel();
  }
  downloadPDFHoraire(): void {
    this.fileHoraireService.downloadPDFHoraire();
  }
  downloadMensuleExcel(): void {
  //  this.fileMensuelService.generateExcelMensuel();
  }
  downloadHoraireExcel(): void {
   // this.fileHoraireService.generateExcelHoraire();
  }

  clickme() {
    let selectedIcon: string | null = null;
    Swal.fire({
      title: 'Sélectionner le format de fichier qui doit le télécharger ?',
      html: `
      <div class="icon-container" style="display: flex; justify-content: center; margin: 20px 0;">
        <img id="icon-excel" src="assets/excel.png" class="icon" alt="Excel" style="cursor: pointer; margin: 0 10px; width: 125px; height: 80px; margin-left: -56px;" />
        <img id="icon-pdf" src="assets/pdf.png" class="icon" alt="PDF" style="cursor: pointer; margin: 0 10px; width: 70px; height: 80px;" />
      </div>
    `,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: 'Télécharger',
    denyButtonText: 'Fermer',
    didOpen: () => {
      const iconExcel = document.getElementById('icon-excel');
      const iconPdf = document.getElementById('icon-pdf');
      const confirmButton = document.querySelector('.swal2-confirm');
  
     // Disable the confirm button initially
          if (confirmButton) {
            confirmButton.setAttribute('disabled', 'true');}
            iconExcel?.addEventListener('click', () => {
            selectedIcon = 'excel';
            iconExcel.style.backgroundColor = 'lightgray';
            iconExcel.style.borderRadius = '5px';
            iconExcel.style.padding = '10px'; // Increase the padding
            iconExcel.style.width = '135px'; // Increase the width
            iconExcel.style.height = '90px'; // Increase the height
            if (iconPdf) {
              iconPdf.style.backgroundColor = '';
              iconPdf.style.borderRadius = '';
              iconPdf.style.padding = '10px'; // Reset the padding
              iconPdf.style.width = '80px'; // Reset the width
              iconPdf.style.height = '90px'; }
            if (confirmButton) {
              confirmButton.removeAttribute('disabled'); }      }); 
            iconPdf?.addEventListener('click', () => {
            selectedIcon = 'pdf';
            iconPdf.style.backgroundColor = 'lightgray';
            iconPdf.style.borderRadius = '5px';
            iconPdf.style.padding = '10px'; // Increase the padding
            iconPdf.style.width = '80px'; // Increase the width
            iconPdf.style.height = '90px'; // Increase the height
            if (iconExcel) {
              iconExcel.style.backgroundColor = '';
              iconExcel.style.borderRadius = '';
              iconExcel.style.padding = '10px'; // Reset the padding
              iconExcel.style.width = '135px'; // Reset the width
              iconExcel.style.height = '90px';  }
            if (confirmButton) {
              confirmButton.removeAttribute('disabled');
            }
          });
        }
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Saved!', '', 'success');
          if (selectedIcon === 'excel') {
         //   this.downloadExcel();
          } else if (selectedIcon === 'pdf') {
          //  this.downloadPdf();
          }
        } 
      });
    }
}
