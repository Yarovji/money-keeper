import { Component, Input, OnInit } from '@angular/core';

import { Bill } from '../../shared/models/bill.model';

@Component({
  selector: 'alc-bill-card',
  templateUrl: './bill-card.component.html',
  styleUrls: ['./bill-card.component.scss']
})
export class BillCardComponent implements OnInit {

  @Input() bill: Bill;
  @Input() currency: any;

  dollar: number;
  euro: number;

  constructor() { }

  ngOnInit() {
    if (this.currency.success) {
      this.euro = this.bill.value / this.currency.rates.UAH;
      this.dollar = this.bill.value / (this.currency.rates.UAH / this.currency.rates.USD);
    }
  }

}
