import { Injectable } from '@angular/core';
import { NativeDateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';

@Injectable({
  providedIn: 'root' // Assurez-vous que cette classe est fournie dans le niveau approprié
})
export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.includes('-')) {
      const str = value.split('-');
      const day = Number(str[0]);
      const month = Number(str[1]) - 1;
      const year = Number(str[2]);
      return new Date(year, month, day);
    }
    return super.parse(value);
  }

  override format(date: Date, displayFormat: Object): string {
    const day = this._to2digit(date.getDate());
    const month = this._to2digit(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private _to2digit(n: number): string {
    return ('00' + n).slice(-2);
  }
}

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD-MM-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
