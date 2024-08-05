import { Poste } from "./Poste";
export interface Personnel {
    mle: any;
    nom: string;
    prenom : string;
    nom_P: string;
    nom_M: string;
    date_N: Date;
    lieu_N: string;
    cin: string;
    cpostal: string;
    date_CIN: string;
    num_CNSS: string;
    adresse: string;
    ville: string;
    sF: string;
    sexe: string;
    date_Entre_Etab: Date;
    date_Anc: Date;
    date_Sortie_Etab: Date;
    motif_Sortie: string;
    tel: string;
    TPostes : Poste[]; 
    selected: boolean;
  }