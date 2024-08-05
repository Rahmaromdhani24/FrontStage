import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Personnel } from 'src/app/Models/Personnel';
import { AvancementService } from 'src/app/Services/avancement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changer-situation',
  templateUrl: './changer-situation.component.html',
  styleUrls: ['./changer-situation.component.css']
})

export class ChangerSituationComponent  implements OnInit ,AfterViewInit  {
  nouvelleSituation: { th: string, indDiff: string } = { th: '', indDiff: '' };

  showLoader : boolean = true; 
  informationsPersonnel: any // Personnel | null = null; 
  personnelSelected :Personnel | null = null;
  recentAvancementPersonnel : any ; 
  mlePersonnel : string ='' ; 
  thValue : any ;
  indDiff : any ; 
/****************************************/
echelonNumber : any ; 
echelon: string='';
categorie: string='';
sousCategorie: any;
/***********************************************/
dateEffetn : Date | null=null ; 
datePAvn: Date | null=null ; 

  constructor(private router : Router ,private ar: ActivatedRoute,private serviceAvancement : AvancementService ) {}

  ngOnInit() {
    this.loadSelectedPersonnel();

  }
  loadSelectedPersonnel(): void {
    const personnelData = localStorage.getItem('selectedPersonnel');
    if (personnelData) {
      this.personnelSelected = JSON.parse(personnelData) as Personnel;
      console.log('Personnel selected:', this.personnelSelected);
      this.callAvancementService();
    }
  }
  callAvancementService(): void {
    if (this.personnelSelected && this.personnelSelected.mle) {
      this.recupererDernierAvancementDeCePersonnel(this.personnelSelected.mle);
      console.log('Personnel selected mle:', this.personnelSelected.mle);
      this.mlePersonnel=this.personnelSelected.mle ; 
    } else {
      console.error('Personnel or personnel.mle is null');
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.hideLoader();
    }, 2000); // Délai de 3 secondes (ajustez selon vos besoins)
  }
  hideLoader(): void { this.showLoader = false;  }
   
  deconnexion(){
    localStorage.clear() ; 
    this.router.navigate(['']); 
  }

  recupererDernierAvancementDeCePersonnel(mle: string): void {
    this.serviceAvancement.getAvancementRecent(mle).subscribe(
      (data) => {
        this.recentAvancementPersonnel=data
        console.log('Avancement data:', data);
        // Process the data as needed
      },
      (error) => {
        console.error('Error fetching avancement data', error);
      }
    );
  }
  get dEffetTransformed(): string {
    if (this.recentAvancementPersonnel && this.recentAvancementPersonnel.dEffet) {
      return this.transformerDate(this.recentAvancementPersonnel.dEffet);
    }
    return '';
  }
  get dPavTransformed(): string {
    if (this.recentAvancementPersonnel && this.recentAvancementPersonnel.dpav) {
      return this.transformerDate(this.recentAvancementPersonnel.dpav);
    }
    return '';
  }

  transformerDate(timestamp: number): string {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // +1 because months are 0-indexed
    const day = ('0' + dateObj.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  
  onFieldChange(): void {
    this.echelonNumber = parseInt(this.echelon) ; 
    if (this.echelon && this.categorie && this.sousCategorie) {
      this.getThValue(this.echelonNumber, this.categorie, this.sousCategorie);
      this.getIndDiff(this.echelonNumber, this.categorie, this.sousCategorie);

      console.log("thhhhhhhhhhhh   "+ this.getThValue(this.echelonNumber, this.categorie, this.sousCategorie) )
    }
    if (this.echelon && this.categorie ) {
      this.getThValue(this.echelonNumber, this.categorie, null);
      this.getIndDiff(this.echelonNumber, this.categorie, null);

      console.log("thhhhhhhhhhhh   "+ this.getThValue(this.echelonNumber, this.categorie, this.sousCategorie) )
    }
  
  }

 
 
  getThValue(echelon: number, categorie: string, sousCategorie: any): void {
    this.serviceAvancement.getTh(echelon, categorie, sousCategorie).subscribe(response => {
        this.nouvelleSituation.th = response;
        console.log("Taux horaire mis à jour: ", this.nouvelleSituation.th);
    });
}

getIndDiff(echelon: number, categorie: string, sousCategorie: any): void {
    this.serviceAvancement.getIndiff(echelon, categorie, sousCategorie).subscribe(response => {
        this.nouvelleSituation.indDiff = response;
        console.log("Indemnité de fonction mise à jour: ", this.nouvelleSituation.indDiff);
    });
}
  annulation(){
    localStorage.removeItem('selectedAvancements') ; 
    this.router.navigate(['/personnelHoraire']) ; 
  }
  transformDateToYyyyMmDd(date: Date | null): string | null {
    if (!date) return null;
  
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  sauvgarde(){
    const nomPersonnel = this.recentAvancementPersonnel.nom;
    const cat = this.categorie ; 
    const sCat =this.sousCategorie ; 
    const ech = this.echelon ; 
    const dEffet =this.dateEffetn ; 
    const dPAv = this.datePAvn ; 
    const th= this.nouvelleSituation.th ; 
    const indDiff= this.nouvelleSituation.indDiff ; 
    const avancementN = {nomPersonnel , cat , sCat , ech, dEffet , dPAv , th, indDiff}
    console.log("dEffet    : " + this.transformDateToYyyyMmDd(dEffet) + ", dPAv   : " + this.transformDateToYyyyMmDd(dPAv) );

    this.serviceAvancement.updateAvancement(avancementN , this.mlePersonnel).subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: 'Nouvelle Situation modifiée avec succès !!',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        this.annulation() ; 
      },
      error: (error) => {
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
    })
 
  }
}