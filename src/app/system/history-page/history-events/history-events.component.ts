import { Component, Input, OnInit } from '@angular/core';

import { ALCEvent } from '../../shared/models/event.model';
import { Category } from '../../shared/models/category.model';


@Component({
    selector: 'alc-history-events',
    templateUrl: './history-events.component.html',
    styleUrls: ['./history-events.component.scss']
})
export class HistoryEventsComponent implements OnInit {

    @Input() categories: Category[] = [];
    @Input() events: ALCEvent[] = [];

    searchValue = '';
    searchPlaceholder = 'Сумма';
    searchField = 'amount';

    constructor() {
    }

    ngOnInit() {
        this.events.forEach((event) => {
            event.categoryName = this.categories.find(category => category.id === event.category).name;
        });

    }

    onChangeCriteria(field: string) {
        const namesMap = {
            amount: 'Сума',
            date: 'Дата',
            category: 'Категорія',
            type: 'Тип'
        };

        this.searchPlaceholder = namesMap[field];
        this.searchField = field;

    }

}
