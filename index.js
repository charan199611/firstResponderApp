const electron = require('electron')
const {ipcMain} = require('electron')
const { autoUpdater } = require('electron-updater');
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const { setup: setupPushReceiver } = require('electron-push-receiver');
var screenElectron = electron.screen;
var ffmpeg = require('ffmpeg');
//process.env.FLUENTFFMPEG_COV= false;
//module.exports = process.env.FLUENTFFMPEG_COV ? require('./lib-cov/fluent-ffmpeg') : require('./lib/fluent-ffmpeg');
process.env.GOOGLE_API_KEY = 'AIzaSyBX3VtNul89lPrwsoUO5pEU6UJfsMwBsCM'
lame = require("lamejs")
encoder = new lame.Mp3Encoder(1, 48000,128)
console.log(encoder)

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true


let win, serve
const args = process.argv.slice(1)
serve = args.some(val => val === '--serve')

function createWindow() {
  debugger
  const mainScreen = screenElectron.getPrimaryDisplay();
  win = new BrowserWindow({
   // width: 1800,
    //height: 1200,
    width: mainScreen.size.width,
    height: mainScreen.size.height,
    center: true,
    icon: path.join(__dirname, './src/assets/icon/police-icon.png'),
    webPreferences: {
      nodeIntegration: true
    }
  })
 // win.maximize();
//win.show();

  win.once('ready-to-show', () => {
    setupPushReceiver(win.webContents);
    win.show()
    autoUpdater.checkForUpdates();
  });

  if (serve) {
    win.loadURL('http://localhost:4200')
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'www/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

   win.webContents.openDevTools()
  setupPushReceiver(win.webContents);

  // Emitted when the window is closed.
  // win.on('closed', () => {
  //   // Dereference the window object, usually you would store window
  //   // in an array if your app supports multi windows, this is the time
  //   // when you should delete the corresponding element.
  //   win = null
  // })
  win.on('close', function(e) {
    const choice = require('electron').dialog.showMessageBoxSync(this,
      {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to quit?'
      });
    if (choice === 1) {
      e.preventDefault();
    }
  });
}
try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // app.on('ready', createWindow)

  app.on('ready', () => {
    createWindow();
    console.log("Ready to show");
    autoUpdater.checkForUpdates();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
} catch (e) {
  // Catch Error
  // throw e;
}

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function (command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {
        detached: true
      });
    } catch (error) { }

    return spawnedProcess;
  };

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(application.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(application.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      application.quit();
      return true;
  }
};

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});



autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
})
autoUpdater.on('download-progress', (progressObj) => {
  console.log("download-progress");
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log("log message", log_message);
  win.webContents.send('update_progress', { progress: Math.round(progressObj.percent) + '%' });
  
})
