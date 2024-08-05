import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ClearLocalStorageResolverService  implements Resolve<any> {

  resolve() {
    localStorage.removeItem('selectedAvancements');
    return null; // Peut être n'importe quelle valeur ou Observable, car on ne récupère pas de données ici
  }
}