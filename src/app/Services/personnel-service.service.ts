import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personnel } from '../Models/Personnel';

@Injectable({
  providedIn: 'root'
})
export class PersonnelServiceService {
  PersonnelsData :any=[];
  selectedPersonnel: Personnel | null = null;
  private tokenKey = 'auth-token'; // Clé pour stocker le token, exemple localStorage

  constructor(private http: HttpClient) {  this.loadSelectedPersonnel(); }

  private urlLogin = "http://localhost:8281/auth/login" ;
  loginn(username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) });
    return this.http.post(this.urlLogin, {}, { headers, responseType: 'text' });
  }
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  /********************************************************************************/
  private urlGetAllPersonnels = "http://localhost:8281/api/personnel/all" ;
  getAllPersonnels(): Observable<any> { return this.http.get<any>(`${this.urlGetAllPersonnels}`) }

  private urlGetAllPersonnelsHoraire = "http://localhost:8281/api/personnel/horaire" ;
  getAllPersonnelsHoraire(): Observable<any> { return this.http.get<any>(`${this.urlGetAllPersonnelsHoraire}`) }

  private urlGetAllPersonnelsMensuel = "http://localhost:8281/api/personnel/mensuel" ;
  getAllPersonnelsMensuel(): Observable<any> { return this.http.get<any>(`${this.urlGetAllPersonnelsMensuel}`) }

  private urlGetAllPersonnelsException57ansCetteAnnée = "http://localhost:8281/api/personnel/57ansCeMois" ;
  getAllPersonnelsException57ansCeMois(): Observable<any> { return this.http.get<any>(`${this.urlGetAllPersonnelsException57ansCetteAnnée}`) }

  private urlGetAllPersonnelsPlusException57ans = "http://localhost:8281/api/personnel/plus57ans" ;
  getAllPersonnelsPlusException57ans(): Observable<any> { return this.http.get<any>(`${this.urlGetAllPersonnelsPlusException57ans}`) }


  private urlGetPersonnelByMle = 'http://localhost:8281/api/personnel';
  getPersonnel(mle : string): Observable<any> {return this.http.get<any>(`${this.urlGetPersonnelByMle}/${mle}`);}

  private urlGetPersonnelMensuelByMle = 'http://localhost:8281/api/personnel/mensuel';
  getPersonnelMensuel(mle : string): Observable<any> {return this.http.get<any>(`${this.urlGetPersonnelMensuelByMle}/${mle}`);}

  private urlGetQualificationDePersonnel = 'http://localhost:8281/api/personnel/qualification';
  getQualificationDePersonnel(mle : string): Observable<string> {return this.http.get<string>(`${this.urlGetQualificationDePersonnel}/${mle}`);}
  
/*********************************** Personnels Selected ****************************************************/

addPersonnel(personnel: Personnel): void {
  if (!this.selectedPersonnel) {
    this.selectedPersonnel = personnel;
    this.saveSelectedPersonnel();
  }
}

loadSelectedPersonnel(): void {
  const data = localStorage.getItem('selectedPersonnel');
  if (data) {
    this.selectedPersonnel = JSON.parse(data);
  }
}

saveSelectedPersonnel(): void {
  localStorage.setItem('selectedPersonnel', JSON.stringify(this.selectedPersonnel));
}

getSelectedPersonnel(): Personnel | null {
  return this.selectedPersonnel;
}

removePersonnel(personnel: Personnel): void {
  if (this.selectedPersonnel && this.selectedPersonnel.mle === personnel.mle) {
    this.selectedPersonnel = null;
    this.saveSelectedPersonnel();
  }
}

isPersonnelSelected(): boolean {
  return this.selectedPersonnel !== null;
}
}




