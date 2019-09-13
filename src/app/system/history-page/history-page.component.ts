import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import * as moment from 'moment';

import { CategoriesService } from '../shared/services/categories.service';
import { EventsService } from '../shared/services/events.service';
import { Category } from '../shared/models/category.model';
import { ALCEvent } from '../shared/models/event.model';


@Component({
    selector: 'alc-history-page',
    templateUrl: './history-page.component.html',
    styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

    user_id: number = JSON.parse(window.localStorage.getItem('user')).id;

    isLoaded = false;
    sub1: Subscription;
    categories: Category[] = [];
    events: ALCEvent[] = [];
    filteredEvents: ALCEvent[] = [];

    chartData = [];

    isFilterVisible = false;

    constructor(private categoriesService: CategoriesService, private eventsService: EventsService) {
    }

    ngOnInit() {
        this.sub1 = combineLatest(this.categoriesService.getCategories(this.user_id), this.eventsService.getEvents(this.user_id))
            .subscribe((data: [Category[], ALCEvent[]]) => {
                this.categories = data[0];
                this.events = data[1];

                this.setOriginalEvents();
                this.calculateChartData();

                this.isLoaded = true;
            });
    }

    calculateChartData(): void {
        this.chartData = [];

        this.categories.forEach((category) => {
            const categoryEvents = this.filteredEvents.filter((event) => event.category === category.id && event.type === 'outcome');

            this.chartData.push({
                name: category.name,
                value: categoryEvents.reduce((total, event) => {
                    total += event.amount;
                    return total;
                }, 0)
            });
        });
    }

    private toogleFilterVisibility(dir: boolean) {
        this.isFilterVisible = dir;
    }

    openFilter() {
        this.toogleFilterVisibility(true);
    }

    private setOriginalEvents() {
        this.filteredEvents = this.events.slice();
    }

    filterApply(filterData) {
        this.toogleFilterVisibility(false);
        this.setOriginalEvents();

        const startPeroid = moment().startOf(filterData.period).startOf('d');
        const endPeroid = moment().endOf(filterData.period).endOf('d');

        this.filteredEvents = this.filteredEvents.filter((event) => {
            return filterData.types.indexOf(event.type) !== -1;
        }).filter((event) => {
            return filterData.categories.indexOf(event.category.toString()) !== -1;
        }).filter((event) => {
            const momentDate = moment(event.date, 'DD.MM.YYYY HH:mm:ss');
            return momentDate.isBetween(startPeroid, endPeroid);
        });

        this.calculateChartData();
    }

    filterCancel() {
        this.toogleFilterVisibility(false);
        this.setOriginalEvents();
        this.calculateChartData();
    }

    ngOnDestroy() {
        if (this.sub1) {
            this.sub1.unsubscribe();
        }
    }

}
