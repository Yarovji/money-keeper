import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { BillService } from '../shared/services/bill.service';
import { CategoriesService } from '../shared/services/categories.service';
import { EventsService } from '../shared/services/events.service';
import { Bill } from '../shared/models/bill.model';
import { Category } from '../shared/models/category.model';
import { ALCEvent } from '../shared/models/event.model';


@Component({
    selector: 'alc-planning-page',
    templateUrl: './planning-page.component.html',
    styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit, OnDestroy {

    sub1: Subscription;
    user_id: number = JSON.parse(window.localStorage.getItem('user')).id;
    isLoaded = false;

    bill: Bill;
    categories: Category[] = [];
    events: ALCEvent[] = [];

    constructor (private billService: BillService, private categoriesService: CategoriesService, private eventsService: EventsService) {
    }

    ngOnInit () {
        this.sub1 = combineLatest(this.billService.getBill(this.user_id), this.categoriesService.getCategories(this.user_id),
            this.eventsService.getEvents(this.user_id)).subscribe((data: [Bill, Category[], ALCEvent[]]) => {
                this.bill = data[0][0];
                this.categories = data[1];
                this.events = data[2];

                this.isLoaded = true;
            });
    }

    getCategoryCost (category: Category): number {
        const categoryEvents = this.events.filter(e => e.category === category.id && e.type === 'outcome');
        return categoryEvents.reduce((total, e) => {
            total += e.amount;
            return total;
        }, 0);
    }

    private getPercent(category: Category): number {
        const persent = (100 * this.getCategoryCost(category)) / category.capacity;
        return persent > 100 ? 100 : persent;
    }

    getCatPercent(category: Category): string {
        return this.getPercent(category) + '%';
    }

    getCatColorClass(category: Category): string {
        const percent = this.getPercent(category);
        if (percent < 60) {
            return 'success';
        } else if (percent > 95) {
            return 'danger';
        } else {
            return 'warning';
        }
    }

    ngOnDestroy () {
        if (this.sub1) {
            this.sub1.unsubscribe();
        }
    }

}
