import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AvancementService } from 'src/app/Services/avancement.service';
import { Personnel } from 'src/app/Models/Personnel';
import { Avancement } from 'src/app/Models/Avancement';
@Component({
  selector: 'app-avancement-personnel-mensuel',
  templateUrl: './avancement-personnel-mensuel.component.html',
  styleUrls: ['./avancement-personnel-mensuel.component.css']
})
export class AvancementPersonnelMensuelComponent implements OnInit , AfterViewInit{

  showLoader : boolean = true; 
  selectedDate: Date | null = null;
  avacements: Personnel[] = []; 
  selectedAvancements: any[] = [];
  nbrNotifications : number =0 ;
  navText : string='Avancement Personnel Mensuel'
  selectedRows: Set<any> = new Set(); // Use Set for unique selected rows

  public constructor(private router: Router ,  public service :AvancementService ) {
    localStorage.removeItem('selectedAvancements') ; 
   }

  ngOnInit() {
    localStorage.removeItem('selectedAvancements') ; 
    this.processSelectedAvancements() ; 
    console.log(this.service.AvancementsData);  // Vérifiez les données ici
    this.getAllAvancementsCeMois();
    this.nombreAvancementsManquants();
    this.loadSelectedRowsFromLocalStorage() ; 
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.hideLoader();
      this.initDataTable();
    }, 4000); // Délai de 3 secondes (ajustez selon vos besoins)
  }
  initDataTable() {
    $(document).ready(() => {
      const table = $('#example').DataTable();
  
      // Redraw table when page changes
      table.on('page', () => {
        this.updateCheckboxes();
      });
  
      // Ensure the correct checkbox states on table draw
      table.on('draw', () => {
        this.updateCheckboxes();
      });
    });
  }
  
  hideLoader(): void { this.showLoader = false;  }
  updateNavText(text: string) {
    this.navText = text;
  }
  getCurrentDateFormatted(): string {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // Mois de 0 à 11, on ajoute 1 pour avoir de 1 à 12
    let day = date.getDate();
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = '01'; // Toujours le premier jour du mois
  console.log("date d'aujord'huiiii"+`${year}-${formattedMonth}-${formattedDay}`)
    return `${year}-${formattedMonth}-${formattedDay}`;
  }
  
getAllAvancementsCeMois() {
  this.service.getAvDeCeMoisMensuel(this.getCurrentDateFormatted()).subscribe((data: Avancement[]) => {
    this.service.AvancementsData = data.sort((a, b) => a.tpersonnel.mle - b.tpersonnel.mle);
    $(document).ready(function () {
      $('#example').DataTable();
    });
  });
  }
   
transformerDate(timestamp: number) :string {
  const dateObj = new Date(timestamp);
  const year = dateObj.getFullYear(); // Utiliser getFullYear() pour l'année locale
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Utiliser getMonth() pour le mois local
  const day = ('0' + dateObj.getDate()).slice(-2); 
return `${year}-${month}-${day}`;}

onDateChange(event: Date | null): void {
  if (event) {
    this.clearSelectedRows() ; 
    localStorage.removeItem('selectedAvancements') ; 
    localStorage.setItem('DateSelected', this.formatDateToYYYYMMDD(event));
    console.log('Date sélectionnée:', this.formatDateToYYYYMMDD(event));
    this.service.getAvDeCeMoisMensuel(this.formatDateToYYYYMMDD(event)).subscribe((data: Avancement[]) => {
      this.service.AvancementsData = data.sort((a, b) => a.tpersonnel.mle - b.tpersonnel.mle);
      for (const item of data) {
        console.log(item);
      }
    this.reinitializeDataTable();
    });
  } else {
    console.log('Aucune date sélectionnée');
  }
}
formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
reinitializeDataTable(): void {
  $(document).ready(() => {
    const table = $('#example').DataTable();
    table.clear();

    // Transform the data to match the columns in the table
    const transformedData = this.service.AvancementsData.map((av: any) => [
      `<input type="checkbox" ${this.selectedRows.has(av) ? 'checked' : ''} (change)="onRowSelect($event, ${JSON.stringify(av)})" />`,
      av.tpersonnel.mle,
      av.nom,
      this.transformerDate(av.dEffet),
      this.transformerDate(av.dpav),
      av.ech,
    ]);

    table.rows.add(transformedData);
    table.draw();

    // Rebind the checkbox events if needed
    this.bindCheckboxEvents();
  });
}
  /**********************Selection des avancements **********************/
  selectAll(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.service.AvancementsData.forEach((av: any) => {
        this.selectedRows.add(av);
      });
    } else {
      this.selectedRows.clear();
    }
    console.log('Selected Rows after selectAll:', Array.from(this.selectedRows));
    this.saveSelectedRowsToLocalStorage();
    this.updateCheckboxes();
  }
  
  
  updateCheckboxes(): void {
    const selectedMles = new Set(
      Array.from(this.selectedRows).map((av: any) => av.tpersonnel.mle)
    );
  
    // Update checkboxes on the current page
    $('#example tbody input[type="checkbox"]').each((index, checkbox) => {
      const inputCheckbox = checkbox as HTMLInputElement;
      const av = this.getAvancementFromCheckbox(inputCheckbox);
  
      if (av) {
        inputCheckbox.checked = selectedMles.has(av.tpersonnel.mle);
      } else {
        inputCheckbox.checked = false;
      }
    });
  
    // Update the select all checkbox state
    const selectAllCheckbox = $('#example thead input[type="checkbox"]').get(0) as HTMLInputElement;
  
    // Check if all checkboxes across all pages are selected
    const totalItems = this.service.AvancementsData.length;
    const totalSelected = Array.from(this.selectedRows).length;
  
    selectAllCheckbox.checked = totalItems > 0 && totalSelected === totalItems;
    selectAllCheckbox.indeterminate = false; // Ensure it's not indeterminate
  }
  
  getAvancementFromCheckbox(checkbox: HTMLInputElement): any {
    const row = $(checkbox).closest('tr').get(0);
    const mle = row ? $(row).find('td:eq(1)').text().trim() : '';
    return this.service.AvancementsData.find((av: any) => av.tpersonnel.mle === mle);
  }
  onRowSelect(event: any, av: any): void {
    const isChecked = event.target.checked;
  
    if (isChecked) {
      this.selectedRows.add(av);
    } else {
      this.selectedRows.delete(av);
    }
  
    console.log('Selected Rows:', Array.from(this.selectedRows));
  
    // Save selectedRows to localStorage
    this.saveSelectedRowsToLocalStorage();
  
    // Update the select all checkbox state
    this.updateCheckboxes();
  }
  
  bindCheckboxEvents(): void {
    // Rebind event listeners for row checkboxes
    $('#example tbody').on('change', 'input[type="checkbox"]', (event) => {
      const checkbox = event.target as HTMLInputElement;
      const av = this.getAvancementFromCheckbox(checkbox);
      if (av) {
        this.onRowSelect(event, av);
      }
    });
  }
  saveSelectedRowsToLocalStorage(): void {
    // Convert the selectedRows to an array and stringify it
    const selectedRowsArray = Array.from(this.selectedRows);
    const selectedRowsJson = JSON.stringify(selectedRowsArray);
  
    // Save to localStorage
    localStorage.setItem('selectedAvancements', selectedRowsJson);
  }
  loadSelectedRowsFromLocalStorage(): void {
    // Retrieve from localStorage
    const selectedRowsJson = localStorage.getItem('selectedAvancements');
  
    if (selectedRowsJson) {
      // Parse the JSON and update selectedRows
      const selectedMles = JSON.parse(selectedRowsJson);
  
      // Find and add the avancements by their mle
      this.selectedRows.clear(); // Clear existing selections
      selectedMles.forEach((mle: string) => {
        const av = this.service.AvancementsData.find((av: any) => av.tpersonnel.mle === mle);
        if (av) {
          this.selectedRows.add(av);
        }
      });
    }
  }
    
  processSelectedAvancements(): void {
    console.log('Avancements sélectionnés :', this.service.selectedAvancements);
    // Vous pouvez maintenant faire quelque chose avec les éléments sélectionnés
  }
  auMoinsUneSelection(): boolean {
    // Vérifie s'il y a au moins un élément sélectionné individuellement
    const hasSelectedIndividually = this.selectedRows.size > 0;

    // Vérifie si toutes les lignes sont sélectionnées avec la checkbox "Select All"
    const allSelected = this.service.AvancementsData.every((avancement: Avancement) => avancement.selected);

    // Le bouton "Suivant" sera visible si au moins une ligne est sélectionnée individuellement ou si toutes les lignes sont sélectionnées avec "Select All"
    return hasSelectedIndividually || allSelected;
  }
  suivant(): void {
    // Action à effectuer lorsque le bouton "Suivant" est cliqué
    console.log('Bouton Suivant cliqué');
    console.log('Avancements sélectionnés :', this.selectedAvancements);
  }

  nombreAvancementsManquants(){
    this.service.getNombreAvancementsManquants().subscribe(data =>{
      this.nbrNotifications = data ; 
      console.log("nbr notification : "+ this.nbrNotifications)
    })
  }
  selection(){
    this.router.navigate(['/avancementMoisMensuel'])
  }
  deconnexion(){
    localStorage.clear() ; 
    this.router.navigate([''])
  }
  clearSelectedRows(): void {
    // Clear the selectedRows set
    this.selectedRows.clear();
    
    // Uncheck all checkboxes in the table body
    const checkboxes = document.querySelectorAll('#example tbody input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      const inputCheckbox = checkbox as HTMLInputElement;
      inputCheckbox.checked = false;
    });
  
    // Uncheck the 'select all' checkbox if it exists
    const selectAllCheckbox = document.querySelector('#example thead input[type="checkbox"]') as HTMLInputElement;
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
    }
  
    console.log('Selected Rows cleared and checkboxes unselected.');
  }
  
  
}
