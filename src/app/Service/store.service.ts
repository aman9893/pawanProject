import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class StoreService {
    private calendarData; any;

    constructor() {
        this.calendarData = [];
    }

    getCalendarData() {
        return this.calendarData;
    }
    
    setCalendarData(data: any) {
        this.calendarData = data;
    }
}
