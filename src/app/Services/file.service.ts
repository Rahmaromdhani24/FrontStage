import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

downloadPDFMensuel(): void {
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
  const text1 = 'ETAT D\'AVANCEMENT D\'ECHELON NORMAL - MOIS DE MAI 2024';
  const text1Width = doc.getStringUnitWidth(text1) * 10 / doc.internal.scaleFactor; // Largeur du texte en points
  const text1X = 148 - (text1Width / 2); // Centrage du texte
  doc.text(text1, text1X + 20, 20); // Décalage de 20 points vers la droite
  doc.setLineWidth(0.2); // Epaisseur de la ligne de 0.2 points (plus fine)
  const lineStartX = text1X + 20;
  const lineEndX = text1X + text1Width + 11; // Réduire la longueur de la ligne de 10 points
  doc.line(lineStartX, 21, lineEndX, 21); // Ligne juste en dessous du texte décalée vers la droite

// Deuxième texte avec soulignement juste en dessous
const text2 = 'PERSONNEL : MENSUEL';
const text2Width = doc.getStringUnitWidth(text2) * 10 / doc.internal.scaleFactor; // Largeur du texte en points
const text2X = 170 - (text2Width / 2); // Centrage du texte
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

    const data = [
      ['480', 'TOUMI CHOKRI', '7', '28', '1072.457', '214.495', '11/1/2022', '7', '29', '1142.167', '228.437', '5/1/2024', '12', 'Non', 'Oui', 'Non', 'Non'],
      ['1511', 'SOYAH NEJIB', '10', '25', '1356.176', '271.238', '11/1/2022', '10', '26', '1444.327', '288.868', '5/1/2024', '15', 'Oui', 'Non', 'Non', 'Oui'],
      // Add more rows as needed
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
          6: { cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation D.EFFET
          7: { cellWidth: 9, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation CAT
          8: { cellWidth: 10, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation ECH
          9: { cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation SB/TH
          10:{ cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation IND-DIFF
          11:{ cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation D.EFFET
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
   // Add additional text
  doc.text('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Chef Service \n\n Développement RH & Formation', 14, (doc as any).autoTable.previous.finalY + 40);
  doc.text('Amani NASR', 25, (doc as any).autoTable.previous.finalY + 55);
  // Taille de police que vous utilisez (en pixels)
const fontSize = 12;

// Obtenez la largeur de la page
const pageWidth = doc.internal.pageSize.width;

// Pour le deuxième texte (Lotfi ROUIS)
const secondText = 'Lotfi ROUIS';
const secondTextWidth = doc.getStringUnitWidth(secondText) * fontSize / doc.internal.scaleFactor;
doc.text(secondText, pageWidth - secondTextWidth - 28, (doc as any).autoTable.previous.finalY + 55);
const text = 'S/D Ressources Humaines &\n\nRelations Professionnelles P/I ';
const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
doc.text(text, pageWidth - textWidth + 50, (doc as any).autoTable.previous.finalY + 40);
    doc.save('etatMensuel.pdf');
  }



  downloadPDFHoraire(): void {
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
  const text1 = 'ETAT D\'AVANCEMENT D\'ECHELON NORMAL - MOIS DE MAI 2024';
  const text1Width = doc.getStringUnitWidth(text1) * 10 / doc.internal.scaleFactor; // Largeur du texte en points
  const text1X = 148 - (text1Width / 2); // Centrage du texte
  doc.text(text1, text1X + 20, 20); // Décalage de 20 points vers la droite
  doc.setLineWidth(0.2); // Epaisseur de la ligne de 0.2 points (plus fine)
  const lineStartX = text1X + 20;
  const lineEndX = text1X + text1Width + 11; // Réduire la longueur de la ligne de 10 points
  doc.line(lineStartX, 21, lineEndX, 21); // Ligne juste en dessous du texte décalée vers la droite

// Deuxième texte avec soulignement juste en dessous
const text2 = 'PERSONNEL : HORAIRE';
const text2Width = doc.getStringUnitWidth(text2) * 10 / doc.internal.scaleFactor; // Largeur du texte en points
const text2X = 170 - (text2Width / 2); // Centrage du texte
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

    const data = [
      ['480', 'TOUMI CHOKRI', '7','E1', '28', '1072.457', '214.495', '11/1/2022', '7','C1', '29', '1142.167', '228.437', '5/1/2024', '12', 'Non', 'Oui', 'Non', 'Non'],
      ['1511', 'SOYAH NEJIB', '10','C1', '25', '1356.176', '271.238', '11/1/2022', '10', 'D1','26', '1444.327', '288.868', '5/1/2024', '15', 'Oui', 'Non', 'Non', 'Oui'],
      // Add more rows as needed
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
          3: { cellWidth: 9, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation sCAT
          4: { cellWidth: 10, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation ECH
          5: { cellWidth: 16, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation SB/TH
          6: { cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation IND-DIFF
          7: { cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Ancienne Situation D.EFFET
          8: { cellWidth: 9, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation CAT
          9: { cellWidth: 9, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation SCAT
          10: { cellWidth: 10, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation ECH
          11: { cellWidth: 16, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation SB/TH
          12:{ cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation IND-DIFF
          13:{ cellWidth: 17, fontStyle: 'normal', halign: 'center' }, // Nouvelle Situation D.EFFET
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
          // Custom text for SANCTION
          doc.setFontSize(8);
          doc.text('SANCTION', data.cell.x + data.cell.width / 2, data.cell.y + 5, { align: 'center' });
          doc.setFontSize(8);
          doc.text('1er DEGRE', data.cell.x + data.cell.width / 2, data.cell.y + 9, { align: 'center' });
        }
        if (data.section === 'head' && data.row.index === 0 && data.column.index === 16) {
          // Custom text for SANCTION
          doc.setFontSize(8);
          doc.text('SANCTION', data.cell.x + data.cell.width / 2, data.cell.y + 5, { align: 'center' });
          doc.setFontSize(8);
          doc.text('2eme DEGRE', data.cell.x + data.cell.width / 2, data.cell.y + 9, { align: 'center' });
        }
      }
    });

doc.text('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Chef Service \n\n Développement RH & Formation', 14, (doc as any).autoTable.previous.finalY + 40);
doc.text('Amani NASR', 25, (doc as any).autoTable.previous.finalY + 55);
const fontSize = 12;
const pageWidth = doc.internal.pageSize.width;
const secondText = 'Lotfi ROUIS';
const secondTextWidth = doc.getStringUnitWidth(secondText) * fontSize / doc.internal.scaleFactor;
doc.text(secondText, pageWidth - secondTextWidth - 28, (doc as any).autoTable.previous.finalY + 55);
const text = 'S/D Ressources Humaines &\n\nRelations Professionnelles P/I ';
const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
doc.text(text, pageWidth - textWidth + 50, (doc as any).autoTable.previous.finalY + 40);
doc.save('etatHoraire.pdf');
  }


  dowloadExcelHoraire(): void {
    // Données à insérer dans le tableau Excel
    const data = [
      ['480', 'TOUMI CHOKRI', '7', 'E1', '28', '1072.457', '214.495', '11/1/2022', '7', 'C1', '29', '1142.167', '228.437', '5/1/2024', '12', 'Non', 'Oui', 'Non', 'Non'],
      ['1511', 'SOYAH NEJIB', '10', 'C1', '25', '1356.176', '271.238', '11/1/2022', '10', 'D1', '26', '1444.327', '288.868', '5/1/2024', '15', 'Oui', 'Non', 'Non', 'Oui'],
      // Ajoutez plus de lignes au besoin
    ];
  
    // En-têtes de colonne pour le tableau Excel
    const headers = [
      'Mle', 'Nom & Prénom', 'Ancienne Situation CAT', 'Ancienne Situation S/C', 'Ancienne Situation ECH',
      'Ancienne Situation SB/TH', 'Ancienne Situation IND-DIFF', 'Ancienne Situation D.EFFET',
      'Nouvelle Situation CAT', 'Nouvelle Situation S/C', 'Nouvelle Situation ECH', 'Nouvelle Situation SB/TH',
      'Nouvelle Situation IND-DIFF', 'Nouvelle Situation D.EFFET', 'MOY NOTE', 'SANCTION 1er DEGRE',
      'SANCTION 2eme DEGRE', 'REPORT 3 MOIS', 'REPORT 6 MOIS'
    ];
  
    // Création d'un nouveau classeur Excel
    const wb = XLSX.utils.book_new();
  
    // Création d'une feuille de calcul
    const ws = XLSX.utils.aoa_to_sheet([headers].concat(data));
  
    // Ajout de la feuille de calcul au classeur
    XLSX.utils.book_append_sheet(wb, ws, 'Etat Horaire');
  
    // Générer le fichier Excel (format .xlsx)
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    // Conversion du classeur en un blob Excel
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
  
    // Téléchargement du fichier Excel
    saveAs(blob, 'etatHoraire.xlsx');
  }
dowloadExcelMensuel(): void {
}
}