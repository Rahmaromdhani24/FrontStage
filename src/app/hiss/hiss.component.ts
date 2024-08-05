import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'bootstrap';
import { PersonnelServiceService } from '../Services/personnel-service.service';
import { AvancementService } from '../Services/avancement.service';
import { Avancement } from '../Models/Avancement';

@Component({
  selector: 'app-hiss',
  templateUrl: './hiss.component.html',
  styleUrls: ['./hiss.component.css']
})
export class HissComponent implements OnInit, AfterViewInit {
  id: string = "";
  index: number = 0;
  qualificationPersonnel: any;
  informationsAvancement: Avancement | null = null;
  test: number = 0;
  showLoader: boolean = true;
  nomPersonnel: string = "";
  espaceInsécable: string = String.fromCharCode(160);
  constructor(
    private router: Router,
    private ar: ActivatedRoute,
    public service: AvancementService,
    private servicePersonnel: PersonnelServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.id = this.ar.snapshot.params['id'];
    this.getAvancementsPersonnel();
    this.servicePersonnel.getPersonnel(this.id).subscribe(data => {
      this.nomPersonnel = data.nom + " " + data.prenom;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.hideLoader();
      this.initDataTable();
    }, 4000);
  }

  initDataTable() {
    $(document).ready(function() {
      $('#tabHistorique').DataTable();
    });
  }

  hideLoader(): void {
    this.showLoader = false;
  }

  getAvancementsPersonnel() {
    this.service.getAvancementPersonnel(this.id).subscribe(data => {
      this.service.AvancementsPersonnel = data;
      this.service.length_historiques_personnel = this.service.AvancementsPersonnel.length;
      this.test = this.service.AvancementsPersonnel.some((avancement: Avancement) => avancement.sCat) ? 1 : 0;
      this.initDataTable();
    });
  }

  transformerDate(timestamp: number): string {
    const dateObj = new Date(timestamp);
    dateObj.setDate(dateObj.getDate() + 1); // Increment the day by 1
    const year = dateObj.getUTCFullYear();
    const month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2); // +1 because months are 0-based
    const day = ('0' + dateObj.getUTCDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  }

  getAvancement(id: number) {
    // Réinitialiser les données du modal
    this.informationsAvancement = null;

    this.service.getAvancement(id).subscribe(data => {
      this.informationsAvancement = data;
      this.nomPersonnel = this.informationsAvancement.nom;

      // Vérifiez les données
      console.log('Données de l\'avancement:', this.informationsAvancement);

      // Forcer la détection des modifications
      this.cdr.detectChanges();

      // Afficher le modal
      ($('#exampleModal1') as any).modal('show');
    }, error => {
      console.error('Erreur lors de la récupération des données d\'avancement:', error);
    });
  }

  getQualificationPersonnel(mle: string) {
    this.servicePersonnel.getQualificationDePersonnel(mle).subscribe(data => {
      this.qualificationPersonnel = data;
    });
  }

  afficheQualificationPersonnel(mle: string): string {
    this.servicePersonnel.getPersonnel(mle).subscribe(data => {
      this.qualificationPersonnel = data.qualification;
    });
    return this.qualificationPersonnel;
  }

  deconnexion() {
    localStorage.clear() ; 
    this.router.navigate(['']);
  }
}