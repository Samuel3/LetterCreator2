const { ipcRenderer } = require('electron')

setTimeout(() => {console.log("Test")}, 2000)
console.log("TEst")

window.ipcRenderer = ipcRenderer