import { Component, Input } from '@angular/core';

@Component({
  selector: 'alc-currency-card',
  templateUrl: './currency-card.component.html',
  styleUrls: ['./currency-card.component.scss']
})
export class CurrencyCardComponent {

  @Input() currency: any;

  date: Date = new Date();
  currencies: string[] = ['USD', 'EUR'];

}
