import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Avancement } from '../Models/Avancement';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AvancementService {

  AvancementsData :any=[];
  AvancementsPersonnel : any=[] ; 
  testAffichage : number=0 ; 
  Historiques  : any=[] ; 
  avancementsManquants : any=[]
  length_historiques : number =0 ; 
  length_historiques_personnel : number = 0 ; 
  selectedAvancements: any[] = [];  
  testTelechargement : number =0  ; 
  constructor(private http: HttpClient) {
    this.loadSelectedAvancements();
   }

  private urlGetAllAvancements = "http://localhost:8281/api/avancement/all" ;
  getAllAvancements(): Observable<any> {
    return this.http.get<any>(`${this.urlGetAllAvancements}`)
  }

  private urlGetAvancementByMle = 'http://localhost:8281/api/avancement/personnel';
  getAvancementPersonnel(mle : string): Observable<any> {
  return this.http.get<any>(`${this.urlGetAvancementByMle}/${mle}`);}

  private urlGetAvancementCeMoisGlobale = 'http://localhost:8281/api/avancement/avancementsCeMois';
  getAvDeCeMoisGlobale(date : string): Observable<any> {
  const params = new HttpParams().set('dateString' , date) ; 
  return this.http.get<any>(`${this.urlGetAvancementCeMoisGlobale}` , {params});}

  private urlGetAvancementCeMoisHoraire = 'http://localhost:8281/api/avancement/avancementsCeMoisHoraire';
  getAvDeCeMoisHoraire(date : string): Observable<any> {
  const params = new HttpParams().set('dateString' , date) ; 
  return this.http.get<any>(`${this.urlGetAvancementCeMoisHoraire}` , {params});}

  private urlGetAvancementCeMoisMensuel= 'http://localhost:8281/api/avancement/avancementsCeMoisMensuel';
  getAvDeCeMoisMensuel(date : string): Observable<any> {
  const params = new HttpParams().set('dateString' , date) ; 
  return this.http.get<any>(`${this.urlGetAvancementCeMoisMensuel}` , {params});}

  private urlGetAllHistoriques = "http://localhost:8281/api/avancement/avancementsRecentsPourChaquePersonnel" ;
  getAllHistoriquesRecent(): Observable<any> {
    return this.http.get<any>(`${this.urlGetAllHistoriques}`)
  }
  
  private urlGetAvancements = "http://localhost:8281/api/avancement" ;
  getAvancement(id : number): Observable<Avancement> {
    return this.http.get<Avancement>(`${this.urlGetAvancements}/${id}`);}
  

  private urlGetAvancementRecent = "http://localhost:8281/api/avancement/lastAvancement2" ;
  getAvancementRecent(mle : string): Observable<any> {
  return this.http.get<any>(`${this.urlGetAvancementRecent}/${mle}`);}


    
    /********************    Sanctions Personnels  & Anomalie Avancement  & Sauvgarde Historiques ******************/

    
  private urlGetAnomliesAvancements = 'http://localhost:8281/api/avancement/anomalie';
  getAllAvancementsManquants(): Observable<any> {
  return this.http.get<any>(`${this.urlGetAnomliesAvancements}`);}

  
  private urlGetNombreAnomliesAvancements = 'http://localhost:8281/api/avancement/nbrAnomalie';
  getNombreAvancementsManquants(): Observable<number> {
  return this.http.get<number>(`${this.urlGetNombreAnomliesAvancements}`);}


  private urlGetSanctionsPersonnelAvant18mois = 'http://localhost:8281/api/personnel/sanctions';
  getSanctionsPersonnels18Mois(mle: string): Observable<any> {
  return this.http.get<any>(`${this.urlGetSanctionsPersonnelAvant18mois}/${mle}`);}

  private urlGetNombreSanctionsPersonnelAvant18mois = 'http://localhost:8281/api/personnel/nbrsanctions';
  getNombreSanctionsPersonnels18Mois(mle: string): Observable<number> {
  return this.http.get<number>(`${this.urlGetNombreSanctionsPersonnelAvant18mois}/${mle}`);}


  /************************************* Seclected Avancements  ********************************************/

    addAvancement(avancement: Avancement): void {
      const existingIndex = this.selectedAvancements.findIndex(a => a.id === avancement.id);
      if (existingIndex === -1) {
        this.selectedAvancements.push(avancement);
        this.saveSelectedAvancements();
      }
    }
    loadSelectedAvancements(): void {
      const data = localStorage.getItem('selectedAvancements');
      if (data) {
        this.selectedAvancements = JSON.parse(data);
      }
    }
  
    
    
    getSelectedAvancements(): Avancement[] {
      return this.selectedAvancements;
    }
    
    
   
    saveSelectedAvancements(): void {
      localStorage.setItem('selectedAvancements', JSON.stringify(this.selectedAvancements));
    }
   
    removeAvancement(avancement: Avancement): void {
      const index = this.selectedAvancements.findIndex(a => a.id === avancement.id);
      if (index !== -1) {
        this.selectedAvancements.splice(index, 1);
        this.saveSelectedAvancements();
      }
    }



  /*******************************  Recuperer Th et IndDiff d'un personnel  *************************************/
  
  private urlGetTH = 'http://localhost:8281/api/avancement/getTh';
  getTh(echelon: number, cat: string, scat: string): Observable<string> {
    const params = new HttpParams()
      .set('echelon', echelon.toString())
      .set('cat', cat)
      .set('scat', scat);

    return this.http.get<string>(`${this.urlGetTH}`, { params });
  }

  
  private urlGetIndDiff = 'http://localhost:8281/api/avancement/getIndDiff';
  getIndiff(echelon: number, cat: string, scat: string): Observable<string> {
    const params = new HttpParams()
      .set('echelon', echelon.toString())
      .set('cat', cat)
      .set('scat', scat);

    return this.http.get<string>(`${this.urlGetIndDiff}`, { params });
  }

/************************* Sauvgarde Nouvelle situation  *************************/
private apiUrl = 'http://localhost:8281/api/avancement/modifierSituation'; 
updateAvancement(avancementN: any, mle: string): Observable<any> {
  const params = { mle };
  return this.http.post<any>(`${this.apiUrl}`, avancementN, { params });
}

/******************************  Update des avancements d'un mois bien déterminer *******************/
private urlSupprimerAvMensuel = 'http://localhost:8281/api/historiques/supprimerAvMensuel';
supprimerAvancementsMensuel(deffet : string): Observable<any> {
const params = new HttpParams().set('deffet' , deffet) ; 
return this.http.get<any>(`${this.urlSupprimerAvMensuel}` , {params});}

  private urlSupprimerAvHoraire = 'http://localhost:8281/api/historiques/supprimerAvHoraire';
  supprimerAvancementsHoraire(deffet : string): Observable<any> {
  const params = new HttpParams().set('deffet' , deffet) ; 
  return this.http.get<any>(`${this.urlSupprimerAvHoraire}` , {params});}

/*****************************            Historique         ******************************/
private urlAddHistorique = 'http://localhost:8281/api/historiques/addHistorique'; 
addHistorique(idAvancement: number, note: number, san1?: string, san2?: string, observation?: string): Observable<void> {
  let params = new HttpParams()
    .set('idAvancement', idAvancement.toString())
    .set('note', note.toString());

  if (san1) {
    params = params.set('san1', san1);
  }
  if (san2) {
    params = params.set('san2', san2);
  }
  if (observation) {
    params = params.set('observation', observation);
  }

  return this.http.post<void>(this.urlAddHistorique, {}, { params });
}

private urlGetTelechargementsHistoriquesMensuel = 'http://localhost:8281/api/historiques/telechargements_Mensuel';
getHistoriquesMensuel(): Observable<Map<string, any[]>> {
  return this.http.get<Map<string, any[]>>(`${this.urlGetTelechargementsHistoriquesMensuel}`);
}

private urlGetTelechargementsHistoriquesMensuel57ans = 'http://localhost:8281/api/historiques/telechargements_Mensuel_57ans';
getHistoriquesMensuel57ans(): Observable<Map<string, any[]>> {
  return this.http.get<Map<string, any[]>>(`${this.urlGetTelechargementsHistoriquesMensuel57ans}`);
}

getSizeMensuel(date: string): Observable<number> {
  return this.getHistoriquesMensuel().pipe(
    map((historiquesMap: any) => { // Use 'any' type here
      const dataList = historiquesMap[date] || [];
      return dataList.length;
    }),
    catchError(() => {
      return of(0); // Return 0 if there's an error
    })
  );
}


private urlGetTelechargementsHistoriquesHoraire = 'http://localhost:8281/api/historiques/telechargements_Horaire';
getHistoriquesHoraire(): Observable<Map<string, any[]>> {
  return this.http.get<Map<string, any[]>>(`${this.urlGetTelechargementsHistoriquesHoraire}`);
}

private urlGetTelechargementsHistoriquesHoraire57ans = 'http://localhost:8281/api/historiques/telechargements_Horaire_57ans';
getHistoriquesHoraire57ans(): Observable<Map<string, any[]>> {
  return this.http.get<Map<string, any[]>>(`${this.urlGetTelechargementsHistoriquesHoraire57ans}`);
}

getSizeHoraire(date: string): Observable<number> {
  return this.getHistoriquesHoraire().pipe(
    map((historiquesMap: any) => { // Use 'any' type here
      const dataList = historiquesMap[date] || [];
      return dataList.length;
    }),
    catchError(() => {
      return of(0); // Return 0 if there's an error
    })
  );
}

}