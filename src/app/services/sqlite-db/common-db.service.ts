import { Injectable } from '@angular/core';
import { SqliteDb } from 'src/app/model/sqlitedb';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommonDBService {

    subject = new Subject<any>();
    constructor(private sqliteDb: SqliteDb) {

    }

    getConfigrationDetails() {
        const sql = 'SELECT * FROM urlConfigrations';
        this.sqliteDb.selectAll(sql, {}).subscribe((rows) => {
            this.subject.next(rows);
            console.log("rows", rows);
        }, err => {
        });
        return this.subject.asObservable();
    }
}