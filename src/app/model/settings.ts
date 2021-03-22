import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

// tslint:disable-next-line:no-implicit-dependencies
import { remote } from 'electron';

/**
 * Class Settings holds information required by the application.
 * Settings uses settings.json to persist relevant information across sessions.
 *
 * @export
 */
export class Settings {
    /** Folder where data files are located */
    public static dbFolder: string;
    /** Path to database file used by application */
    public static dbPath: string;
    /** Determines if database location can be set by user (false), or is fixed by application (true). */
    public static hasFixedDbLocation = false;
    /**
     * Sets database location when hasFixedDbLocation === true.
     * For valid values see https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname.
     */
    public static fixedLocation: 'userData' = 'userData';

    /** Default name of folder containing data files. app/www/assets/dbdata*/
    //while commiting please change it to app.asar/www/assets/dbdata
   // private static dataSubFolder = 'app.asar/www/assets/dbdata';
   private static dataSubFolder = '/www/assets/dbdata'; 
    /** Default name of database file. */
    private static dbName = 'database.db';
    /** Default name of folder containing data files for Karma. */
    private static dataFolderKarma = 'src/assets/data';
    /** Default name of database file for Karma tests. */
    private static dbNameKarma = 'karma-database.db';
    /** Location of settings.json file */
    private static settingsPath: string;

    /**
     * Settings.initialize must be called at startup of application and determines the locations of database
     */
    public static initialize(): void {
        Settings.getPaths();

        if (!Settings.hasFixedDbLocation) {
            if (!existsSync(Settings.settingsPath)) {
                Settings.write();
            }
            Settings.read();
        }
    }

    public static read(): void {
        const settings = JSON.parse(readFileSync(Settings.settingsPath, { encoding: 'utf8' }));
        Settings.fromJson(settings);
    }

    public static write(): void {
        console.log('Settings.settingsPath', Settings.settingsPath);
        writeFileSync(Settings.settingsPath,
            JSON.stringify({
                dbPath: Settings.dbPath,
            }, undefined, 4));
    }

    private static getPaths() {
        if (remote.app.getPath('userData').endsWith('.electron')) {
            const karmaPath = remote.app.getAppPath();
            const appPath = karmaPath.slice(0, karmaPath.indexOf('node_modules'));
            Settings.hasFixedDbLocation = true;
            Settings.dbFolder = path.join(appPath, Settings.dataFolderKarma);
            Settings.dbPath = path.join(Settings.dbFolder, Settings.dbNameKarma);
            console.log('getPaths', 'getPaths if');
        } else {
            const appPath = remote.app.getAppPath();
            console.log('getPaths', 'getPaths else');
            if (Settings.hasFixedDbLocation) {
                console.log('getPaths', 'getPaths else if');
                Settings.dbPath = path.join(remote.app.getPath(Settings.fixedLocation), 'data', Settings.dbName);
            } else {
                console.log('getPaths', 'getPaths else else');
                Settings.settingsPath = path.join(remote.app.getPath('userData'), 'settings.json');
            }

            const isDevMode = /^[eE]lectron$/.test(path.basename(remote.app.getPath('exe'), '.exe'));

            if (isDevMode) {
                console.log('getPaths', 'isDevMode if');
                Settings.dbFolder = path.join(appPath, Settings.dataSubFolder);
                console.log('getPaths', 'isDevMode if' + Settings.dbFolder);
            } else {
                console.log('getPaths', 'isDevMode else');
                // remote.process.resoursesPath yields undefined
                Settings.dbFolder = path.join(remote.getGlobal('process').resourcesPath, Settings.dataSubFolder);
            }
        }
    }

    private static fromJson(settings: { dbPath: string }) {
        Settings.dbPath = settings.dbPath;
    }
}
