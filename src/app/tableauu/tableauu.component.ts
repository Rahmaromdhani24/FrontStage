import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvancementService } from '../Services/avancement.service';
import * as $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-tableauu',
  templateUrl: './tableauu.component.html',
  styleUrls: ['./tableauu.component.css']
})
export class TableauuComponent implements OnInit {
  selectedDate: Date | null = null;

  constructor(private router: Router, public service: AvancementService) { }

  ngOnInit(): void {
    this.getAllAvancementsCeMois();
  }

  onDateChange(event: Date | null): void {
    if (event) {
      console.log('Date sélectionnée:', this.formatDateToYYYYMMDD(event));
      this.service.getAvDeCeMoisHoraire(this.formatDateToYYYYMMDD(event)).subscribe(data => {
      this.service.AvancementsData = data;
        for (const item of data) {
          console.log(item);
        }
      this.reinitializeDataTable();
      });
    } else {
      console.log('Aucune date sélectionnée');
    }
  }

  getAllAvancementsCeMois() {
    this.service.getAvDeCeMoisHoraire(this.getCurrentDateFormatted()).subscribe(data => {
      this.service.AvancementsData = data;
      this.reinitializeDataTable();
    });
  }

  transformerDate(timestamp: number): string {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObj.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getCurrentDateFormatted(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const formattedDay = '01';
    return `${year}-${month}-${formattedDay}`;
  }

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private reinitializeDataTable(): void {
    $(document).ready(() => {
      const table = $('#example').DataTable();
      table.clear();
  
      // Transform the data to match the columns in the table
      const transformedData = this.service.AvancementsData.map((av : any) => [
        av.tpersonnel.mle,
        av.nom,
        this.transformerDate(av.dEffet),
        this.transformerDate(av.dpav),
        av.ech
      ]);
  
      table.rows.add(transformedData);
      table.draw();
    });
  }
  
}
