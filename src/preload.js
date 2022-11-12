const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    send: (message, args) => ipcRenderer.send(message, ...args),
    sendPlain: (message) => ipcRenderer.send(message),
    sendStringMessage: (message, args) => ipcRenderer.send(message, args),
    on: (channel, listener) => ipcRenderer.on(channel, listener)
})