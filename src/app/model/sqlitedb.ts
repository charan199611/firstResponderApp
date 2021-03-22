import * as fs from 'fs';
import * as path from 'path';
import { Database } from 'sqlite3';
import { Settings } from './settings';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Menu, MenuItemConstructorOptions, OpenDialogOptions, remote, ipcRenderer, SaveDialogOptions } from 'electron';
import { ApplicationConfigProvider } from '../services/application-cofig/application-config';

export interface IDbResult {
    changes: number;
    lastID: number;
}

export interface SqliteMethods {
    insert(sql: string, values: {}): Observable<IDbResult>
    update(sql: string, values: {}): Observable<IDbResult>
    delete(sql: string, values: {}): Observable<IDbResult>
}

/**
 * TheDb is a Promise-ified wrapper around bare sqlite3 API.
 *
 * @export
 * @class TheDb
 */
@Injectable()
export class SqliteDb implements SqliteMethods {

    private static readonly version = 1;
    private static db: Database;
    private routerInfo: BehaviorSubject<boolean>;
    constructor() {
        console.log('Sqlite service executed');
        Settings.initialize();
        this.checkIfDBCreated();
        this.routerInfo = new BehaviorSubject<boolean>(false);
        // SqliteDb.db.run("CREATE TABLE lorem (info TEXT)")

    }

    public selectOne(sql: string, values: {}): Promise<{}> {
        return new Promise<{}>((resolve, reject) => {
            SqliteDb.db.get(sql, values, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }


    insert(sql: string, values: {}): Observable<IDbResult> {
        return SqliteDb.change(sql, values);
    }
    update(sql: string, values: {}): Observable<IDbResult> {
        return SqliteDb.change(sql, values);
    }
    delete(sql: string, values: {}): Observable<IDbResult> {
        return SqliteDb.change(sql, values);
    }

    public static createDb(dbPath: string): Promise<string> {
        dbPath += path.extname(dbPath) === '.db' ? '' : '.db';

        console.log('Creating  databae: ', dbPath);

        //const dataPath = path.join(Settings.dbFolder, `database.init.json`);
        const schemaPath = path.join(Settings.dbFolder, `database.db.sql`);
        const schema = fs.readFileSync(schemaPath, { encoding: 'utf8' });

        // Create data directory in userdata folder
        if (!fs.existsSync(path.join(dbPath, '..'))) {
            fs.mkdirSync(path.join(dbPath, '..'));
        }

        return SqliteDb.getDb(dbPath)
            .then(() => SqliteDb.exec(schema))
            .then(() => {
                console.log('Database created.');
                return dbPath;
            });
    }

    public static openDb(dbPath: string): Promise<void> {
        console.log('Opening database: ', dbPath);

        return SqliteDb.getDb(dbPath)
            .then(() => {
                console.log('Database opened');
                //SqliteDb.db.run("CREATE TABLE lorem (info TEXT)")
                return Promise.resolve();
            });
    }

    public static closeDb(): Promise<void> {
        if (!SqliteDb.db) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve, reject) => {
            SqliteDb.db.close((err) => {
                console.log('Closing current Db');
                if (err) {
                    reject(err);
                    console.log('Db not closed');
                } else {
                    resolve();
                }
            });
        });
    }

    private static getDb(dbPath: string): Promise<void> {
        return SqliteDb.closeDb()
            .then(() => {
                return new Promise<void>((resolve, reject) => {
                    const db = new Database(dbPath, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            SqliteDb.db = db;
                            resolve();
                        }
                    });
                });
            });
    }

    private static exec(sql: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqliteDb.db.exec(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }



    private static change(sql: string, values: {}): Observable<IDbResult> {
        let obeservable = Observable.create(observer => {
            console.log('change00', sql);

            SqliteDb.db.run(sql, values, function (err) {
                if (err) {
                    // reject(err);
                    observer.next(err);
                } else {
                    //resolve({ changes: this.changes, lastID: this.lastID });
                    observer.next({ changes: this.changes, lastID: this.lastID })
                }
            });
        })
        return obeservable;
    }

    public selectAll(sql: string, values: {}): Observable<Array<{}>> {
        let obeservable = Observable.create(observer => {
            console.log('selectAll==', sql, values);

            SqliteDb.db.all(sql, values, (err, rows) => {
                console.log('selectAll new==', rows);
                if (err) {
                    console.log('selectAll errr==', sql, values);
                    observer.next(err);
                } else {

                    observer.next(rows);
                }
                
            });

        })
        return obeservable;

    } 

    public selectEventUpdate(sql: string, values: {}) {
        /*         let obeservable = Observable.create(observer => {
                    console.log('selectAll==', sql, values);
        
                    SqliteDb.db.all(sql, values, (err, rows) => {
                        console.log('selectAll new==', rows);
                        if (err) {
                            console.log('selectAll errr==', sql, values);
                            observer.next(err);
                        } else {
        
                            observer.next(rows);
                        }
                        
                    });
        
                })
                return obeservable; */

        let promise = new Promise((resolve, reject) => {
            SqliteDb.db.all(sql, values, (err, rows) => {
                console.log('selectAll new==123', rows);
                if (err) {
                    console.log('selectAll errr==', sql, values);

                    reject(err);
                } else {
                    resolve(rows);

                }

            });

        })

        return promise;

    }

    initializeDb() {
        SqliteDb.openDb(Settings.dbPath)
            .then(() => {
                if (!Settings.hasFixedDbLocation) {
                    Settings.dbPath = Settings.dbPath;
                    Settings.write();
                }
            })
            .then(() => {

            })
            .catch((reason) => {
                console.log('Error occurred while opening database: ', reason);
            });
    }

    checkIfDBCreated() {
        console.log('Settings.dbPath', Settings.dbPath);
        if (fs.existsSync(Settings.dbPath)) {
            this.openDb(Settings.dbPath);
            console.log('if');
        } else if (Settings.hasFixedDbLocation) {
            this.createDb(Settings.dbPath);
            console.log('else if');
        } else {
            this.createDb();
            console.log('else');
        }
    }

    public async createDb(filename?: string) {
        if (!filename) {
            const options: SaveDialogOptions = {
                title: 'Create file',
                defaultPath: remote.app.getPath('documents'),
                filters: [
                    {
                        name: 'Database',
                        extensions: ['db'],
                    },
                ],
            };
            filename = await remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), options);
        }

        if (!filename) {
            return;
        }

        SqliteDb.createDb(filename)
            .then((dbPath) => {
                console.log('Settings.hasFixedDbLocation', Settings.hasFixedDbLocation);
                if (!Settings.hasFixedDbLocation) {
                    Settings.dbPath = dbPath;
                    console.log('Settings.write');
                    Settings.write();


                }
            })
            .then(() => {
                // this.getHeroes();
                this.setValue(true)

            })
            .catch((reason) => {
                console.log(reason);
            });

    }

    public openDb(filename: string) {
        SqliteDb.openDb(filename)
            .then(() => {
                if (!Settings.hasFixedDbLocation) {
                    Settings.dbPath = filename;
                    Settings.write();
                }
            })
            .then(() => {
                console.log('after opening db');

                this.setValue(true)
            })
            .catch((reason) => {
                // Handle errors
                console.log('Error occurred while opening database: ', reason);
            });
    }

    getValue(): Observable<boolean> {
        return this.routerInfo.asObservable();
    }
    setValue(newValue): void {
        this.routerInfo.next(newValue);
    }
}
