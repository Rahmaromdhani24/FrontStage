import { Component, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements AfterViewInit {

 public  constructor() {}
 
  ngAfterViewInit() {
    $(document).ready(function() {
      $('#example').DataTable({
        "columnDefs": [
          { "orderable": false, "targets": 5 }
        ],
        language: {
          'paginate': {
            'previous': '<span class="fa-solid fa-chevron-left"></span>',
            'next': '<span class="fa-solid fa-chevron-right"></span>'
          },
          "lengthMenu": 'Display <select class="form-control input-sm">' +
            '<option value="10">10</option>' +
            '<option value="20">20</option>' +
            '<option value="30">30</option>' +
            '<option value="40">40</option>' +
            '<option value="50">50</option>' +
            '<option value="-1">All</option>' +
            '</select> results'
        }
      });
    });

    /*********************************************************************************************/

  }
  clickme() {
  let selectedIcon: string | null = null;
  Swal.fire({
    title: 'Sélectionner le format de fichier qui doit le télécharger ?',
    html: `
    <div class="icon-container" style="display: flex; justify-content: center; margin: 20px 0;">
      <img id="icon-excel" src="assets/excel.png" class="icon" alt="Excel" style="cursor: pointer; margin: 0 10px; width: 125px; height: 80px; margin-left: -56px;" />
      <img id="icon-pdf" src="assets/pdf.png" class="icon" alt="PDF" style="cursor: pointer; margin: 0 10px; width: 70px; height: 80px;" />
    </div>
  `,
  showDenyButton: true,
  showCancelButton: false,
  confirmButtonText: 'Télécharger',
  denyButtonText: 'Fermer',
  didOpen: () => {
    const iconExcel = document.getElementById('icon-excel');
    const iconPdf = document.getElementById('icon-pdf');
    const confirmButton = document.querySelector('.swal2-confirm');

   // Disable the confirm button initially
        if (confirmButton) {
          confirmButton.setAttribute('disabled', 'true');}
          iconExcel?.addEventListener('click', () => {
          selectedIcon = 'excel';
          iconExcel.style.backgroundColor = 'lightgray';
          iconExcel.style.borderRadius = '5px';
          iconExcel.style.padding = '10px'; // Increase the padding
          iconExcel.style.width = '135px'; // Increase the width
          iconExcel.style.height = '90px'; // Increase the height
          if (iconPdf) {
            iconPdf.style.backgroundColor = '';
            iconPdf.style.borderRadius = '';
            iconPdf.style.padding = '10px'; // Reset the padding
            iconPdf.style.width = '80px'; // Reset the width
            iconPdf.style.height = '90px'; }
          if (confirmButton) {
            confirmButton.removeAttribute('disabled'); }      }); 
          iconPdf?.addEventListener('click', () => {
          selectedIcon = 'pdf';
          iconPdf.style.backgroundColor = 'lightgray';
          iconPdf.style.borderRadius = '5px';
          iconPdf.style.padding = '10px'; // Increase the padding
          iconPdf.style.width = '80px'; // Increase the width
          iconPdf.style.height = '90px'; // Increase the height
          if (iconExcel) {
            iconExcel.style.backgroundColor = '';
            iconExcel.style.borderRadius = '';
            iconExcel.style.padding = '10px'; // Reset the padding
            iconExcel.style.width = '135px'; // Reset the width
            iconExcel.style.height = '90px';  }
          if (confirmButton) {
            confirmButton.removeAttribute('disabled');
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success');
        if (selectedIcon === 'excel') {
          this.downloadExcel();
        } else if (selectedIcon === 'pdf') {
          this.downloadPdf();
        }
      } 
    });
  }
downloadExcel(){}
downloadPdf(){}
}