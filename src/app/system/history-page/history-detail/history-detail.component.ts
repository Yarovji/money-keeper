import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { EventsService } from '../../shared/services/events.service';
import { CategoriesService } from '../../shared/services/categories.service';
import { ALCEvent } from '../../shared/models/event.model';
import { Category } from '../../shared/models/category.model';


@Component({
    selector: 'alc-history-detail',
    templateUrl: './history-detail.component.html',
    styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

    sub1: Subscription;
    event: ALCEvent;
    category: Category;

    isLoaded = false;

    constructor(private route: ActivatedRoute, private eventsService: EventsService, private categoriesService: CategoriesService) {
    }

    ngOnInit() {
        this.sub1 = this.route.params.pipe(mergeMap((params: Params) => this.eventsService.getEventById(params['id']))).pipe(mergeMap((event: ALCEvent) => {
            this.event = event;
            return this.categoriesService.getCategoryById(event.category);
        })).subscribe((category: Category) => {
            this.category = category;
            this.isLoaded = true;
        });
    }

    ngOnDestroy() {
        if (this.sub1) {
            this.sub1.unsubscribe();
        }
    }

}
