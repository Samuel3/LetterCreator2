'use strict'

import {app, protocol, BrowserWindow, ipcMain, shell, Menu} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'
const fs = require('fs')
const path = require('path')
const os = require('os')

const Store = require('electron-store');

const store = new Store();

store.set('unicorn', '🦄');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

function createWindow() {
    // Create the browser window.
    console.log(__dirname)
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.maximize()
    setMainMenu()

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) {
            win.webContents.openDevTools()
        }
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    win.on('closed', () => {
        win = null
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('write', (e, key, value) => {
    // console.log(arguments)
    console.log("Key: " + key + " Value: " + value)
    store.set(key, value)
})

// ipcMain.on('read', (e, key) => {
//     console.log("Received read event for " + key)
//     win.webContents.send(key, store.get(key))
//     win.webContents.send("read", store.get(key))
// });

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

ipcMain.on('print-pdf', () => {
    console.log("Receiving print request")
    const pdfPath = path.join(os.homedir(), 'Desktop', 'temp.pdf')
    win.webContents.printToPDF({
        pageSize: 'A4',
        printSelectionOnly: false,
        printBackground: false,
        marginsType: 1
    }).then(data => {
        fs.writeFile(pdfPath, data, (error) => {
            if (error) throw error
            console.log(`Wrote PDF successfully to ${pdfPath}`)
            win.webContents.send("print-pdf-path", pdfPath)
            shell.openExternal(pdfPath)
        })
    }).catch(error => {
        console.log(`Failed to write PDF to ${pdfPath}: `, error)
    })
})

ipcMain.on('load-letter', (event, path) => {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, data) {
        win.webContents.send("letter-loaded", data)
    });
});

ipcMain.on("print", () => {
    win.webContents.print({}, (success, failureReason)=>{
        if (success) {
            win.webContents.send("print-succes");
        } else {
            win.webContents.send("error", failureReason)
        }
    })
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

function setMainMenu() {

    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Hello',
                    accelerator: 'Shift+CmdOrCtrl+H',
                    click() {
                        console.log('Oh, hi there!')
                    }
                },
                {
                    label: 'Print'
                },
                {
                    label: 'Import'
                },
                {
                    label: 'Export'
                },
                {
                    label: 'Close'
                },
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'dsf',
                    click() {
                        console.log("Tach")
                    }
                }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}