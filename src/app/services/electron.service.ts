import { Injectable } from '@angular/core';
//import * as SerialPort from 'serialport';
//import * as RandomAccessFile from 'random-access-file';
import * as ReadLine from 'linebyline';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { Observable } from 'rxjs';

declare global {
  interface Window {
    require: any;
    process: any;
  }
}

@Injectable()
export class ElectronService {
  //serialPort: typeof SerialPort;
  //randomAccessFile: typeof RandomAccessFile;

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  readLine: typeof ReadLine;

  public rL: any;
  constructor() {
    // Conditional imports

    if (this.isElectron()) {
     // this.serialPort = window.require('serialport');
      //this.randomAccessFile = window.require('random-access-file');
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.readLine = window.require('linebyline');

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.openLineByLine()


    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  openLineByLine() {

    let observable = Observable.create((observer) => {

      this.rL = this.readLine('\\\\.\\pipe\\NMEA_pipe');
      this.rL.on('line', function (line, lineCount, byteCount) {
        // do something with the line of text
        console.log('openLineByLine', line);
        observer.next(JSON.parse(line));
      })
        .on('error', function (e) {
          // something went wrong
          observer.error(e);
          console.log('openLineByLineerror', e);
        });


    })

    return observable;


  }


}
