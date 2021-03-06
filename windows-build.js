const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig() {
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, '')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'myapp-source-built-win32-x64/'),
    authors: '',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'myapp-source-built.exe',
    setupExe: 'ionic-desktop.exe',
    //setupIcon: path.join(rootPath, 'assets','icon.ico')
  })
}