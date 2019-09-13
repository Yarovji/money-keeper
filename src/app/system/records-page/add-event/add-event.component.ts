import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Category } from '../../shared/models/category.model';
import { ALCEvent } from '../../shared/models/event.model';
import { EventsService } from '../../shared/services/events.service';
import { BillService } from '../../shared/services/bill.service';
import { Bill } from '../../shared/models/bill.model';
import { Message } from '../../../shared/models/message.model';


@Component({
    selector: 'alc-add-event',
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

    sub1: Subscription;
    sub2: Subscription;
    @Input() categories: Category[] = [];
    types = [
        {type: 'income', label: 'Дохід'},
        {type: 'outcome', label: 'Розхід'}
    ];
    message: Message;

    user_id: number = JSON.parse(window.localStorage.getItem('user')).id;

    constructor(private eventsService: EventsService, private billService: BillService) {
    }

    private showMessage(message: Message) {
        this.message = message;
        window.setTimeout(() => {
            this.message.text = '';
        }, 3500);
    }

    ngOnInit() {
        this.message = new Message('success', '');
    }

    onSubmit(form: NgForm) {
        let {amount} = form.value;
        if (amount < 0) {
            amount *= -1;
        }

        const event = new ALCEvent(this.user_id, form.value.type, amount, +form.value.category, moment().format('DD.MM.YYYY HH:mm:ss'), form.value.description);

        this.sub1 = this.billService.getBill(this.user_id).subscribe((bill: Bill) => {
            let value = 0;
            if (form.value.type === 'outcome') {
                if (amount > bill[0].value) {
                    this.showMessage({
                        type: 'danger',
                        text: `На рахунку недостатньо коштів. Вам невистачить ${amount - bill[0].value}`
                    });
                    return;
                } else {
                    value = bill[0].value - amount;
                }
            } else {
                value = bill[0].value + amount;
            }

            this.sub2 = this.billService.updateBill({user_id: this.user_id, value, currency: bill[0].currency, id: bill[0].id}).pipe(mergeMap(() =>
                this.eventsService.addEvent(event))).subscribe(() => {
                    form.setValue({
                        amount: 1,
                        description: ' ',
                        category: 1,
                        type: 'outcome'
                    });
                    this.showMessage({
                        type: 'success',
                        text: 'Подія успішно добавлена'
                    });
                });
        });
    }

    ngOnDestroy() {
        if (this.sub1) {
            this.sub1.unsubscribe();
        }
        if (this.sub2) {
            this.sub2.unsubscribe();
        }
    }
}
