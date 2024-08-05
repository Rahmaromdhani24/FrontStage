import { Departement } from "./Departement";
import { Personnel } from "./Personnel";

export interface Poste {
    id: number ;
    personnel: Personnel;
    fonction : string;
    position: string;
    qualification: string;
    college: string;
    active: string;
    date_Poste: Date;
    nom_Dep : string ; 
    id_Service: number;
    nom_Service: string;
    ref: string;

  }