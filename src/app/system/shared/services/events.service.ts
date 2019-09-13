import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../../shared/core/base-api';
import { ALCEvent } from '../models/event.model';


@Injectable()
export class EventsService extends BaseApi {

    constructor(public http: HttpClient) {
        super(http);
    }

    addEvent(event: ALCEvent): Observable<ALCEvent> {
        return this.post('/events', event);
    }

    getEvents(user_id: number): Observable<ALCEvent[]> {
        return this.get(`/events?user_id=${user_id}`);
    }

    getEventById(id: string): Observable<ALCEvent> {
        return this.get(`/events/${id}`);
    }
}
