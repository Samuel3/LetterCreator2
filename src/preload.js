const { ipcRenderer } = require('electron')
const fs = require("fs")

window.ipcRenderer = ipcRenderer
window.fs = fs