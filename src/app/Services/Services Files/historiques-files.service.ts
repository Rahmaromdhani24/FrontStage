import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { HttpClient , HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { format, addDays } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class HistoriquesFilesService {

  constructor(private http: HttpClient) {}
  element : any ; 
  private urlGetHistoriquesPersonnelMensuel = "http://localhost:8281/api/historiques/historiquesMensuel" ;
getDataMensuel(dateEffet: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.urlGetHistoriquesPersonnelMensuel}?dateEffet=${dateEffet}`);}

private urlGetHistoriquesPersonnelHoraire = "http://localhost:8281/api/historiques/historiquesHoraire" ;
getDataHoraire(dateEffet: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.urlGetHistoriquesPersonnelHoraire}?dateEffet=${dateEffet}`);}

downloadPDFMensuel(dateEffet: string): void {
    this.getDataMensuel(dateEffet).subscribe(
      async (result: any[]) => {
        if (!result || result.length === 0) {
          console.error('Aucune donnée n\'a été récupérée.');
          return;
        }
        result.sort((a, b) => {
          const matriculeA = +a.mle;
          const matriculeB = +b.mle;
          if (matriculeA < matriculeB) return -1;
          if (matriculeA > matriculeB) return 1;
          return 0;
        });
        const data = [];
        for (let row of result) {
          const dEffetAFormatted = row.dEffetA ? format(addDays(new Date(row.dEffetA), 1), 'dd-MM-yyyy') : '-';
          const dEffetNFormatted = row.dEffetN ? format(addDays(new Date(row.dEffetN), 1), 'dd-MM-yyyy') : '-';
          const note = row.note !== 0 ? row.note.toFixed(2) : '-';
          try {
            const item = await new Promise<any>((resolve, reject) => {
              this.getChangementMensuel(row.mle, dateEffet).subscribe(
                item => resolve(item),
                error => reject(error)
              );
            });
            if (item) {
              for (const key in item) {
                  if (item.hasOwnProperty(key)) {
                      console.log(`${key}:`, item[key]);
                  }
              }     
              const categorie = item.cat;
              const echelon = item.ech;
              const sbasee = item.sbase;
              const indDifferentiel = item.indDiff && item.indDiff.trim() !== '' ? item.indDiff : '-';
              const dateEffetFormatted = item.dEffet ? format((new Date(item.dEffet)), 'dd-MM-yyyy') : '-';
              data.push([
                  { content: row.mle, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.nom, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: categorie, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `categorie`
                  { content: echelon, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `categorie`
                  { content: sbasee, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `categorie`
                  { content: indDifferentiel, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `categorie`
                  { content: dateEffetFormatted, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `categorie`
                  { content: row.catN, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.echN, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.sbaseN, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.indDiffN !== null ? row.indDiffN : '-', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content:dEffetNFormatted, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: note, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.san1 || '', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.san2 || '', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: '', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: '', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
              ]);
              data.push([            
                  { content: row.catA, styles: { halign: 'center', valign: 'middle' } }, // Deuxième ligne affiche `row.catA`
                  { content: row.echA, styles: { halign: 'center', valign: 'middle' } },// Cellule vide pour `echelon`
                  { content: row.sbaseA, styles: { halign: 'center', valign: 'middle' } }, // Cellule vide pour `sbasee`
                  { content: row.indDiffA !== null ? row.indDiffA : '-',styles: { halign: 'center', valign: 'middle' } }, // Cellule vide pour `sbasee
                  { content: dEffetAFormatted , styles: { halign: 'center', valign: 'middle' } }, // Cellule vide pour `indDifferentiel`                  
                  { content: dEffetNFormatted , styles: { halign: 'center', valign: 'middle' } }, // Cellule vide pour `indDifferentiel`                
              ]);
          }
           else {
              // Traitement si item est null ou non défini
              data.push([
                { content: row.mle},
                { content: row.nom },
                { content: row.catA }, // Catégorie
                { content: row.echA }, // Échelon
                { content: row.sbaseA },// SB/TH
                { content: row.indDiffA !== null ? row.indDiffA : '-' }, // IND-DIFF
                { content: dEffetAFormatted, }, // D.EFFET
                { content:   row.catN},
                { content: row.echN },
                { content: row.sbaseN },
                { content: row.indDiffN !== null ? row.indDiffN : '-' },
                { content: dEffetNFormatted},
                { content:note },
                { content: row.san1 || ''},
                { content: row.san2 || '' },
                { content: ''},
                { content: '' },
              ]);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des données de changement mensuel', error);
            // Gestion de l'erreur selon vos besoins
          }
        }
        const doc = new jsPDF('landscape');
        doc.setFontSize(9);
        doc.setTextColor(0); // Couleur du texte noir
        doc.text('S.T.I.P', 14, 10);
        doc.setFontSize(9); // Augmente la taille du texte à 12 points
        doc.text('USINE M\'SAKEN', 14, 15);
        doc.setFontSize(9); // Maintient la taille du texte à 12 points pour la ligne suivante
        doc.text('SCE Développement R-H & Formation', 14, 20);
        const text1 = 'ETAT D\'AVANCEMENT D\'ECHELON NORMAL - '+this.transformDateToMonthYear(dateEffet);
        const text1Width = doc.getStringUnitWidth(text1) * 10 / doc.internal.scaleFactor; // Largeur du texte en points
        const text1X = 148 - (text1Width / 2); // Centrage du texte
        doc.setFont('helvetica', 'bold'); // Mettre le texte en gras
        doc.text(text1, text1X + 20, 20); // Décalage de 20 points vers la droite
        doc.setLineWidth(0.2); // Epaisseur de la ligne de 0.2 points (plus fine)
        const lineStartX = text1X + 20;
        const lineEndX = text1X + text1Width + 11; // Réduire la longueur de la ligne de 10 points
        doc.line(lineStartX, 21, lineEndX, 21); // Ligne juste en dessous du texte décalée vers la droite
  
        const text2 = 'PERSONNEL : MENSUEL';
        const text2Width = doc.getStringUnitWidth(text2) * 10 / doc.internal.scaleFactor; // Largeur du texte en points
        const text2X = 170 - (text2Width / 2); // Centrage du texte
        doc.setFont('helvetica', 'bold'); // Remettre le texte en normal après avoir mis le premier en gras
        doc.text(text2, text2X, 25);
        doc.setLineWidth(0.2); // Epaisseur de la ligne de 0.2 points (plus fine)
        const lineStartX2 = text2X;
        const lineEndX2 = text2X + text2Width - 4; // Réduire la longueur de la ligne de 10 points
        doc.line(lineStartX2, 26, lineEndX2, 26); // Ligne juste en dessous du texte décalée vers la droite
        
    
        const headers = [
          [
            { content: 'Mle', rowSpan: 2 },
            { content: 'Nom & Prénom', rowSpan: 2 },
            { content: 'ANCIENNE SITUATION', colSpan: 5, halign: 'center' },
            { content: 'NOUVELLE SITUATION', colSpan: 5, halign: 'center' },
            { content: 'MOY NOTE', rowSpan: 2 },
            { content: '', rowSpan: 2 }, // Placeholder for custom text
            { content: '', rowSpan: 2 },
            { content: 'REPORT 3 MOIS', rowSpan: 2 },
            { content: 'REPORT 6 MOIS', rowSpan: 2 }
          ],
          [
            'CAT', 'ECH', 'SB/TH', 'IND-DIFF', 'D.EFFET', 'CAT', 'ECH', 'SB/TH', 'IND-DIFF', 'D.EFFET'
          ]
        ];
    
        interface CellData {
          section: 'head' | 'body' | 'foot';
          column: { index: number; };
          row: { index: number; };
          cell: { x: number; y: number; width: number; height: number; };
        }
        (doc as any).autoTable({
          startY: 35,
          head: headers,
          body: data,
          theme: 'grid', // Choose from 'striped', 'grid', 'plain' for the theme
          styles: { fontSize: 8, 
                    textColor: 0,
                    lineWidth: 0.3, // Increase the border thickness here
                    lineColor: [0, 0, 0] // Set border color to black
                     }, // Black text for the entire table
          columnStyles: {
              0: { cellWidth: 10, fontStyle: 'normal', halign: 'center' }, // Mle
              1: { cellWidth: 45, fontStyle: 'normal', halign: 'center' }, // Nom & Prénom
              2: { cellWidth: 9, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation CAT
              3: { cellWidth: 10, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation ECH
              4: { cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation SB/TH
              5: { cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation IND-DIFF
              6: { cellWidth: 18, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation D.EFFET
              7: { cellWidth: 9, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation CAT
              8: { cellWidth: 10, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation ECH
              9: { cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation SB/TH
              10:{ cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation IND-DIFF
              11:{ cellWidth: 18, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation D.EFFET
              12:{ cellWidth: 11, fontStyle: 'normal', halign: 'center' }, // MOY NOTE
              13:{ cellWidth: 20, fontStyle: 'normal', halign: 'center' }, // SANCTION 1er DEGRE
              14:{ cellWidth: 20, fontStyle: 'normal', halign: 'center' }, // SANCTION 2EME DEGRE
              15:{ cellWidth: 15, fontStyle: 'normal', halign: 'center' }, // REPORT 3 MOIS
              16:{ cellWidth: 15, fontStyle: 'normal', halign: 'center' }, // REPORT 6 MOIS
            },
            headStyles: {
            fillColor: [255, 255, 255], // White background color for headers
            textColor: [0, 0, 0], // Black text color for headers
            fontStyle: 'bold', // Bold font for headers
            lineWidth: 0.3, // Increase the border thickness for headers
            lineColor: [0, 0, 0], // Set border color to black
            halign: 'center' // Center the headers
          },
          bodyStyles: {
            lineWidth: 0.3, // Increase the border thickness for body rows
            lineColor: [0, 0, 0] , // Set border color to black
            fontStyle: 'normal' // Normal font for body
    
          },
          margin: { left: 9 }, // Adjust the left margin to move the table to the left
          didDrawCell: (data: CellData) => {
            if (data.section === 'head' && data.row.index === 0 && data.column.index === 13) {
              // Custom text for SANCTION
              doc.setFontSize(9);
              doc.text('SANCTION', data.cell.x + data.cell.width / 2, data.cell.y + 5, { align: 'center' });
              doc.setFontSize(8);
              doc.text('1er DEGRE', data.cell.x + data.cell.width / 2, data.cell.y + 9, { align: 'center' });
            }
            if (data.section === 'head' && data.row.index === 0 && data.column.index === 14) {
              // Custom text for SANCTION
              doc.setFontSize(9);
              doc.text('SANCTION', data.cell.x + data.cell.width / 2, data.cell.y + 5, { align: 'center' });
              doc.setFontSize(8);
              doc.text('2eme DEGRE', data.cell.x + data.cell.width / 2, data.cell.y + 9, { align: 'center' });
            }
          }
        });
        doc.text('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Chef Service \n\n Développement RH & Formation', 14, (doc as any).autoTable.previous.finalY + 5);
        doc.text('Amani NASR', 25, (doc as any).autoTable.previous.finalY + 19);
        const fontSize = 12;
        const pageWidth = doc.internal.pageSize.width;
        const secondText = 'Lotfi ROUIS';
        const secondTextWidth = doc.getStringUnitWidth(secondText) * fontSize / doc.internal.scaleFactor;
        doc.text(secondText, pageWidth - secondTextWidth - 38, (doc as any).autoTable.previous.finalY + 19);
        const text = 'Le S/D Ressources Humaines &\n\nRelations Professionnelles P/I ';
        const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
        doc.text(text, pageWidth - textWidth + 50, (doc as any).autoTable.previous.finalY + 5);
        doc.save('etatMensuel_'+dateEffet+'.pdf');
       },
       error => {
       console.error('Erreur lors du téléchargement des données', error);
       }
       );
       }
 
downloadPDFHoraire(dateEffet : string): void {
    this.getDataHoraire(dateEffet).subscribe(
      async (result: any[]) => {
        if (!result || result.length === 0) {
          console.error('Aucune donnée n\'a été récupérée.');
          return;
        }
        result.sort((a, b) => {
          const matriculeA = +a.mle;
          const matriculeB = +b.mle;
          if (matriculeA < matriculeB) return -1;
          if (matriculeA > matriculeB) return 1;
          return 0;
        });
        const data = [];
        for (let row of result) {
          const dEffetAFormatted = row.dEffetA ? format(addDays(new Date(row.dEffetA), 1), 'dd-MM-yyyy') : '-';
          const dEffetNFormatted = row.dEffetN ? format(addDays(new Date(row.dEffetN), 1), 'dd-MM-yyyy') : '-';
          const note = row.note !== 0 ? row.note.toFixed(2) : '-';

          try {
            const item = await new Promise<any>((resolve, reject) => {
              this.getChangementHoraire(row.mle, dateEffet).subscribe(
                item => resolve(item),
                error => reject(error)
              );
            });
            if (item) {
              for (const key in item) {
                  if (item.hasOwnProperty(key)) {
                      console.log(`${key}:`, item[key]);
                  }
              }     
              const categorie = item.cat;
              const sousCategorie = item.sCat;
              const echelon = item.ech;
              const th = item.th;
              const indDifferentiel = item.indDiff && item.indDiff.trim() !== '' ? item.indDiff : '-';
              const dateEffetFormatted = item.dEffet ? format(addDays(new Date(item.dEffet), 1), 'dd-MM-yyyy') : '-';
              data.push([
                  { content: row.mle, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.nom, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: categorie, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `categorie`
                  { content: sousCategorie, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `sous categorie`
                  { content: echelon, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `categorie`
                  { content: th, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `categorie`
                  { content: indDifferentiel, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `categorie`
                  { content: dateEffetFormatted, rowSpan: 1, styles: { halign: 'center', valign: 'middle' } }, // Première ligne affiche `categorie`
                  { content: row.catN, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.sCatN, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.echN, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.thN, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.indDiffN !== null ? row.indDiffN : '-', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content:dEffetNFormatted, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: note, rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.san1 || '', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: row.san2 || '', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: '', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
                  { content: '', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
              ]);
              data.push([            
                  { content: row.catA, styles: { halign: 'center', valign: 'middle' } }, // Deuxième ligne affiche `row.catA`
                  { content: row.sCatA, styles: { halign: 'center', valign: 'middle' } }, // Deuxième ligne affiche `row.catA`
                  { content: row.echA, styles: { halign: 'center', valign: 'middle' } },// Cellule vide pour `echelon`
                  { content: row.thA, styles: { halign: 'center', valign: 'middle' } }, // Cellule vide pour `sbasee`
                  { content: row.indDiffA !== null ? row.indDiffA : '-', styles: { halign: 'center', valign: 'middle' } }, // Cellule vide pour `sbasee
                  { content: dEffetAFormatted , styles: { halign: 'center', valign: 'middle' } }, // Cellule vide pour `indDifferentiel`                  
                  { content: dEffetNFormatted , styles: { halign: 'center', valign: 'middle' } }, // Cellule vide pour `indDifferentiel`                
              ]);
          }
           else {
              // Traitement si item est null ou non défini
              data.push([
                { content: row.mle},
                { content: row.nom },
                { content: row.catA }, // Catégorie
                { content: row.sCatA }, //sous  Catégorie
                { content: row.echA }, // Échelon
                { content: row.thA },// SB/TH
                { content: row.indDiffA !== null ? row.indDiffA : '-' }, // IND-DIFF
                { content: dEffetAFormatted, }, // D.EFFET
                { content:  row.catN},
                { content: row.sCatN }, //sous  Catégorie
                { content: row.echN },
                { content: row.thN },
                { content: row.indDiffN !== null ? row.indDiffN : '-' },
                { content: dEffetNFormatted},
                { content: note },
                { content: row.san1 || ''},
                { content: row.san2 || '' },
                { content: ''},
                { content: '' },
              ]);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des données de changement mensuel', error);
            // Gestion de l'erreur selon vos besoins
          }
        }
    const doc = new jsPDF('landscape');
   
    doc.setFontSize(9);
    doc.setTextColor(0); // Couleur du texte noir
    doc.text('S.T.I.P', 14, 10);
    doc.setFontSize(9); // Augmente la taille du texte à 12 points
    doc.text('USINE M\'SAKEN', 14, 15);
    doc.setFontSize(9); // Maintient la taille du texte à 12 points pour la ligne suivante
    doc.text('SCE Développement R-H & Formation', 14, 20);
    // Decrease font size for the next line
  // Premier texte avec soulignement juste en dessous
  const text1 = 'ETAT D\'AVANCEMENT D\'ECHELON NORMAL - '+this.transformDateToMonthYear(dateEffet);
const text1Width = doc.getStringUnitWidth(text1) * 10 / doc.internal.scaleFactor; // Largeur du texte en points
const text1X = 148 - (text1Width / 2); // Centrage du texte
doc.setFont('helvetica', 'bold'); // Mettre le texte en gras
doc.text(text1, text1X + 20, 20); // Décalage de 20 points vers la droite
doc.setLineWidth(0.2); // Epaisseur de la ligne de 0.2 points (plus fine)
const lineStartX = text1X + 20;
const lineEndX = text1X + text1Width + 11; // Réduire la longueur de la ligne de 10 points
doc.line(lineStartX, 21, lineEndX, 21); // Ligne juste en dessous du texte décalée vers la droite

// Deuxième texte avec soulignement juste en dessous
const text2 = 'PERSONNEL : Horaire';
const text2Width = doc.getStringUnitWidth(text2) * 10 / doc.internal.scaleFactor; // Largeur du texte en points
const text2X = 170 - (text2Width / 2); // Centrage du texte
doc.setFont('helvetica', 'bold'); // Remettre le texte en normal après avoir mis le premier en gras
doc.text(text2, text2X, 25);
doc.setLineWidth(0.2); // Epaisseur de la ligne de 0.2 points (plus fine)
const lineStartX2 = text2X;
const lineEndX2 = text2X + text2Width - 4; // Réduire la longueur de la ligne de 10 points
doc.line(lineStartX2, 26, lineEndX2, 26); // Ligne juste en dessous du texte décalée vers la droite

    const headers = [
      [
        { content: 'Mle', rowSpan: 2 },
        { content: 'Nom & Prénom', rowSpan: 2 },
        { content: 'ANCIENNE SITUATION', colSpan: 6, halign: 'center' },
        { content: 'NOUVELLE SITUATION', colSpan: 6, halign: 'center' },
        { content: 'MOY NOTE', rowSpan: 2 },
        { content: '', rowSpan: 2 }, // Placeholder for custom text
        { content: '', rowSpan: 2 },
        { content: 'REPORT 3 MOIS', rowSpan: 2 },
        { content: 'REPORT 6 MOIS', rowSpan: 2 }
      ],
      [
        'CAT','S/C', 'ECH', 'SB/TH', 'IND-DIFF', 'D.EFFET', 'CAT','S/C', 'ECH', 'SB/TH', 'IND-DIFF', 'D.EFFET'
      ]
    ];

    

      

    interface CellData {
      section: 'head' | 'body' | 'foot';
      column: { index: number; };
      row: { index: number; };
      cell: { x: number; y: number; width: number; height: number; };
    }
    (doc as any).autoTable({
      startY: 29,
      head: headers,
      body: data,
      theme: 'grid', // Choose from 'striped', 'grid', 'plain' for the theme
      styles: { fontSize: 8, 
                textColor: 0,
                lineWidth: 0.3, // Increase the border thickness here
                lineColor: [0, 0, 0] // Set border color to black
                 }, // Black text for the entire table
      columnStyles: {
          0: { cellWidth: 10, fontStyle: 'normal', halign: 'center' }, // Mle
          1: { cellWidth: 45, fontStyle: 'normal', halign: 'center' }, // Nom & Prénom
          2: { cellWidth: 9, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation CAT
          3: { cellWidth: 9, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation sCAT
          4: { cellWidth: 10, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation ECH
          5: { cellWidth: 15, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation SB/TH
          6: { cellWidth: 16, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation IND-DIFF
          7: { cellWidth: 18, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation D.EFFET
          8: { cellWidth: 9, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation CAT
          9: { cellWidth: 9, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation SCAT
          10:{ cellWidth: 10, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation ECH
          11:{ cellWidth: 15, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation SB/TH
          12:{ cellWidth: 16, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation IND-DIFF
          13:{ cellWidth: 18, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation D.EFFET
          14:{ cellWidth: 11, fontStyle: 'normal', halign: 'center' }, // MOY NOTE
          15:{ cellWidth: 20, fontStyle: 'normal', halign: 'center' }, // SANCTION 1er DEGRE
          16:{ cellWidth: 20, fontStyle: 'normal', halign: 'center' }, // SANCTION 2EME DEGRE
          17:{ cellWidth: 15, fontStyle: 'normal', halign: 'center' }, // REPORT 3 MOIS
          18:{ cellWidth: 15, fontStyle: 'normal', halign: 'center' }, // REPORT 6 MOIS
        },
        headStyles: {
        fillColor: [255, 255, 255], // White background color for headers
        textColor: [0, 0, 0], // Black text color for headers
        fontStyle: 'bold', // Bold font for headers
        lineWidth: 0.3, // Increase the border thickness for headers
        lineColor: [0, 0, 0], // Set border color to black
        halign: 'center' // Center the headers
      },
      bodyStyles: {
        lineWidth: 0.3, // Increase the border thickness for body rows
        lineColor: [0, 0, 0] , // Set border color to black
        fontStyle: 'normal' // Normal font for body

      },
      margin: { left: 2}, // Adjust the left margin to move the table to the left
      didDrawCell: (data: CellData) => {
        if (data.section === 'head' && data.row.index === 0 && data.column.index === 15) {
          doc.setFontSize(8);
          doc.text('SANCTION', data.cell.x + data.cell.width / 2, data.cell.y + 5, { align: 'center' });
          doc.setFontSize(8);
          doc.text('1er DEGRE', data.cell.x + data.cell.width / 2, data.cell.y + 9, { align: 'center' });
        }
        if (data.section === 'head' && data.row.index === 0 && data.column.index === 16) {
          doc.setFontSize(8);
          doc.text('SANCTION', data.cell.x + data.cell.width / 2, data.cell.y + 5, { align: 'center' });
          doc.setFontSize(8);
          doc.text('2eme DEGRE', data.cell.x + data.cell.width / 2, data.cell.y + 9, { align: 'center' });
        }
      }
    });
 doc.text('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Chef Service \n\n Développement RH & Formation', 14, (doc as any).autoTable.previous.finalY + 5);
 doc.text('Amani NASR', 25, (doc as any).autoTable.previous.finalY + 19);
 const fontSize = 12;
 const pageWidth = doc.internal.pageSize.width;
 const secondText = 'Lotfi ROUIS';
 const secondTextWidth = doc.getStringUnitWidth(secondText) * fontSize / doc.internal.scaleFactor;
 doc.text(secondText, pageWidth - secondTextWidth - 38, (doc as any).autoTable.previous.finalY + 19);
 const text = 'S/D Ressources Humaines &\n\nRelations Professionnelles P/I ';
 const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
 doc.text(text, pageWidth - textWidth + 50, (doc as any).autoTable.previous.finalY + 5);
 doc.save('etatHoraire_'+dateEffet+'.pdf');
},
error => {
 console.error('Erreur lors du téléchargement des données', error);
}
);
}
transformDateToMonthYear(dateString: string): string {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dateParts = dateString.split('-');
  const year = dateParts[0];
  const monthIndex = +dateParts[1] - 1; 
  const monthName = months[monthIndex];
  return `MOIS DE ${monthName.toUpperCase()} ${year}`;
}


private urlGetDataHoraire = 'http://localhost:8281/api/historiques/downloadExcelHoraire'; 
generateExcelHoraire(dateEffet: string): void {
  const params = new HttpParams().set('dateEffet', dateEffet);
  this.http.get(this.urlGetDataHoraire, { params, responseType: 'blob' }).subscribe(blob => {
    saveAs(blob, 'Av Horaire_'+dateEffet+'.xlsx');
  }, error => {
    console.error('Error downloading the file', error);
  });
}

private urlGetDataMensuel = 'http://localhost:8281/api/historiques/downloadExcelMensuel'; // URL de votre API backend  
generateExcelMensuel(dateEffet: string) {
  const params = new HttpParams().set('dateEffet',  dateEffet );
  this.http.get(this.urlGetDataMensuel, { params, responseType: 'blob' }).subscribe(blob => {
    saveAs(blob, 'Av Mensuel_'+dateEffet+'.xlsx');
  }, error => {
    console.error('Error downloading the file', error);
  });
}
private urlGenerateExcelHoraire57ans = 'http://localhost:8281/api/historiques/downloadHoraire57ans'; 
generateExcelHoraire57ans(dateEffet: string): void {
  const params = new HttpParams().set('dateEffet', dateEffet);
  this.http.get(this.urlGenerateExcelHoraire57ans, { params, responseType: 'blob' }).subscribe(blob => {
    saveAs(blob, 'avancement_horaire_57ans'+dateEffet+'.xlsx');
  }, error => {
    console.error('Error downloading the file', error);
  });
}

private urlGenerateExcelMensuel57ans = 'http://localhost:8281/api/historiques/downloadMensule57ans'; 
generateExcelMensuel57ans(dateEffet: string): void {
  const params = new HttpParams().set('dateEffet', dateEffet);
  this.http.get(this.urlGenerateExcelMensuel57ans, { params, responseType: 'blob' }).subscribe(blob => {
    saveAs(blob, 'avancement_mensuel_57ans'+dateEffet+'.xlsx');
  }, error => {
    console.error('Error downloading the file', error);
  });
}
private urlChangemetMensuel = "http://localhost:8281/api/avancement/changementMensuel";
getChangementMensuel(mle: string, dpav: string) {
  return this.http.get<any>(`${this.urlChangemetMensuel}?mle=${mle}&dpav=${dpav}`);
}

private urlChangemetHoraire = "http://localhost:8281/api/avancement/changementHoraire";
getChangementHoraire(mle: string, dpav: string) {
  return this.http.get<any>(`${this.urlChangemetHoraire}?mle=${mle}&dpav=${dpav}`);
}
}
