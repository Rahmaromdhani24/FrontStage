import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonnelServiceService } from 'src/app/Services/personnel-service.service';
import { AvancementService } from 'src/app/Services/avancement.service';
import { Avancement } from 'src/app/Models/Avancement';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FileService } from 'src/app/Services/file.service';
import { FileMensuleService } from 'src/app/Services/Services Files/file-mensule.service';
import { FileHoraireService } from 'src/app/Services/Services Files/file-horaire.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-avancement-mois-horaire',
  templateUrl: './avancement-mois-horaire.component.html',
  styleUrls: ['./avancement-mois-horaire.component.css']
})
export class AvancementMoisHoraireComponent implements OnInit {
  @ViewChildren(NgModel) inputs!: QueryList<NgModel>;

  showLoader: boolean = true; 
  sanctionsPersonnels: any = [];
  lengthSanctionsPersonnel: number = 0; 
  dateSelected : any ; 
  navText : string='Avancement Personnel Horaire'

  constructor(private fileService: FileService , public  datePipe: DatePipe , private fileMensuelService : FileMensuleService , 
   private fileHoraireService : FileHoraireService , public serviceAvancement: AvancementService, private router: Router, public servicePersonnel: PersonnelServiceService) {}

  ngOnInit() {
    this.preloadImages();

    setTimeout(() => {
      this.hideLoader();
    }, 3000); 
    this.serviceAvancement.loadSelectedAvancements();
    this.updateSanctionsStatus();
    this.serviceAvancement.selectedAvancements.sort((a, b) => {
      // treee des avancements par des matricules des personnels 
      const matriculeA = +a.tpersonnel.mle;
      const matriculeB = +b.tpersonnel.mle;
    
      if (matriculeA < matriculeB) return -1;
      if (matriculeA > matriculeB) return 1;
      return 0;
    });
    
  }

  hideLoader(): void {
    this.showLoader = false;
  }
  preloadImages() {
    const preloadImage = (src: string) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    Promise.all([
        preloadImage('assets/excel.png'),
        preloadImage('assets/pdf.png')
    ]).then(() => {
        console.log('Images preloaded');
    }).catch((error) => {
        console.error('Error preloading images:', error);
    });
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
    localStorage.removeItem('selectedAvancements');
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
    Swal.fire({
      icon: 'warning',
      title: 'Êtes-vous sûr de vouloir sauvegarder ces avancements ?',
      showCancelButton: true,
      confirmButtonText: 'Oui, sauvegarder !',
      cancelButtonText: 'Non',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Tableau pour stocker les observables d'ajout d'historique
        const observables: Observable<any>[] = [];

        // Boucle sur chaque avancement sélectionné
        this.serviceAvancement.selectedAvancements.forEach(avancement => {
          const idAvancement = avancement.id;
          const san1Value = avancement.san1 !== undefined ? avancement.san1 : null;
          const san2Value = avancement.san2 !== undefined ? avancement.san2 : null;
          const noteValue = avancement.note;
          const observationValue = avancement.observation !== undefined ? avancement.observation : null;
          console.log("idAvancement: " + idAvancement + ", san1: " + san1Value + ", san2: " + san2Value + ", note: " + noteValue + ", observation: " + observationValue);

          // Ajouter l'observable d'ajout d'historique au tableau
          observables.push(this.serviceAvancement.addHistorique(idAvancement, noteValue, san1Value, san2Value, observationValue));
        });

        // Exécuter les observables en parallèle
        forkJoin(observables).subscribe({
          next: () => {
            // Après chaque enregistrement d'avancement, appeler clickme()
            this.clickme();
          },
          error: (error) => {
            console.error('Erreur lors de la sauvegarde des avancements:', error);
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
          },
          complete: () => {
            // Une fois que tout est terminé, exécuter annulation()
            this.annulation();
          }
        });
      }
    });
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
  clickme() {
    const preloadImage = (src: string) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    Promise.all([
        preloadImage('assets/excel.png'),
        preloadImage('assets/pdf.png')
    ]).then(() => {
        // Images are preloaded, now show the modal
        this.showFileFormatModal();
    }).catch((error) => {
        console.error('Error preloading images:', error);
    });
}

showFileFormatModal() {
    let selectedIcon: string | null = null;
    Swal.fire({
        title: 'Sélectionner le format de fichier qui doit le télécharger ?',
        html: `
        <div class="icon-container" style="display: flex; justify-content: center; margin: 20px 0;">
            <img id="icon-excel" src="assets/excel.png" class="icon" alt="Excel" style="cursor: pointer; margin: 0 10px; width: 125px; height: 80px;" />
            <img id="icon-pdf" src="assets/pdf.png" class="icon" alt="PDF" style="cursor: pointer; margin: 0 10px; width: 70px; height: 80px;" />
        </div>
        `,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Télécharger',
        denyButtonText: 'Fermer',
        didOpen: () => {
            const iconExcel = document.getElementById('icon-excel') as HTMLImageElement;
            const iconPdf = document.getElementById('icon-pdf') as HTMLImageElement;
            const confirmButton = document.querySelector('.swal2-confirm') as HTMLButtonElement;

            // Disable the confirm button initially
            if (confirmButton) {
                confirmButton.disabled = true;
            }

            const updateIconSelection = (selected: string) => {
                if (selected === 'excel') {
                    iconExcel.style.backgroundColor = 'lightgray';
                    iconExcel.style.borderRadius = '5px';
                    iconExcel.style.padding = '10px';
                    iconExcel.style.width = '135px';
                    iconExcel.style.height = '90px';
                    iconPdf.style.backgroundColor = '';
                    iconPdf.style.borderRadius = '';
                    iconPdf.style.padding = '10px';
                    iconPdf.style.width = '70px';
                    iconPdf.style.height = '80px';
                } else if (selected === 'pdf') {
                    iconPdf.style.backgroundColor = 'lightgray';
                    iconPdf.style.borderRadius = '5px';
                    iconPdf.style.padding = '10px';
                    iconPdf.style.width = '80px';
                    iconPdf.style.height = '90px';
                    iconExcel.style.backgroundColor = '';
                    iconExcel.style.borderRadius = '';
                    iconExcel.style.padding = '10px';
                    iconExcel.style.width = '125px';
                    iconExcel.style.height = '80px';
                }
                if (confirmButton) {
                    confirmButton.disabled = false;
                }
            };

            iconExcel?.addEventListener('click', () => {
                selectedIcon = 'excel';
                updateIconSelection('excel');
            });

            iconPdf?.addEventListener('click', () => {
                selectedIcon = 'pdf';
                updateIconSelection('pdf');
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('le fichier est téléchargé !', '', 'success');
            if (selectedIcon === 'excel') {
               this.downloadHoraireExcel();
            } else if (selectedIcon === 'pdf') {
                this.downloadPDFHoraire();
            }
        }
    });
}


    downloadPDFHoraire(): void {
      this.fileHoraireService.downloadPDFHoraire();
      localStorage.removeItem('DateSelected');
}
      
    downloadHoraireExcel(): void {
     this.dateSelected = localStorage.getItem('DateSelected');
  if (this.dateSelected !== null) {
    this.fileHoraireService.generateExcelHoraire(this.dateSelected);
  } else {
    console.error("DateSelected is not available in localStorage");
  }
  localStorage.removeItem('DateSelected');
}
   
    deconnexion() {
      localStorage.clear();
      this.router.navigate(['']);
    }

    updateNavText(text: string) {
      this.navText = text;
    }
}

