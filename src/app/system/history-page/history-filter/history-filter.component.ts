import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Category } from '../../shared/models/category.model';


@Component({
    selector: 'alc-history-filter',
    templateUrl: './history-filter.component.html',
    styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent {

    @Output() filterCancel = new EventEmitter<any>();
    @Output() filterApply = new EventEmitter<any>();

    @Input() categories: Category[] = [];

    timePeriods = [
        {type: 'd', label: 'День'},
        {type: 'w', label: 'Тиждень'},
        {type: 'M', label: 'Місяць'}
    ];

    types = [
        {type: 'income', label: 'Дохід'},
        {type: 'outcome', label: 'Розхід'}
    ];

    selectedPeriod = 'd';
    selectedTypes = [];
    selectedCategories = [];

    closeFilter() {
        this.selectedTypes = [];
        this.selectedCategories = [];
        this.selectedPeriod = 'd';

        this.filterCancel.emit();
    }

    private calculateInputParams(field: string, checked: boolean, value: string) {
        if (checked) {
            this[field].indexOf(value) === -1 ? this[field].push(value) : null;
        } else {
            this[field] = this[field].filter(i => i !== value);
        }
    }

    handleChangeTime({checked, value}) {
        this.calculateInputParams('selectedTypes', checked, value);
    }

    handleChangeCategory({checked, value}) {
        this.calculateInputParams('selectedCategories', checked, value);
    }

    applyFilter() {
        this.filterApply.emit({
            types: this.selectedTypes,
            categories: this.selectedCategories,
            period: this.selectedPeriod
        });
    }

}
