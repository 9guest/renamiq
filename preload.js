// preload.js - Secure communication bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  renameFiles: (operations) => ipcRenderer.invoke('rename-files', operations),
  undoRename: (undoData) => ipcRenderer.invoke('undo-rename', undoData),
  getFileInfo: (filePaths) => ipcRenderer.invoke('get-file-info', filePaths),
  
  // Template operations
  saveTemplate: (templateData) => ipcRenderer.invoke('save-template', templateData),
  loadTemplate: () => ipcRenderer.invoke('load-template'),
  
  // Menu events
  onMenuAddFiles: (callback) => ipcRenderer.on('menu-add-files', callback),
  onMenuAddFolder: (callback) => ipcRenderer.on('menu-add-folder', callback),
  onMenuUndo: (callback) => ipcRenderer.on('menu-undo', callback),
  onMenuClearAll: (callback) => ipcRenderer.on('menu-clear-all', callback),
  onMenuSaveTemplate: (callback) => ipcRenderer.on('menu-save-template', callback),
  onMenuLoadTemplate: (callback) => ipcRenderer.on('menu-load-template', callback),
  
  // Help menu events
  onMenuHelpTokens: (callback) => ipcRenderer.on('menu-help-tokens', callback),
  onMenuHelpExamples: (callback) => ipcRenderer.on('menu-help-examples', callback),
  onMenuHelpShortcuts: (callback) => ipcRenderer.on('menu-help-shortcuts', callback),
  onMenuAbout: (callback) => ipcRenderer.on('menu-about', callback),
  
  // Utility
  path: {
    basename: (filePath) => require('path').basename(filePath),
    dirname: (filePath) => require('path').dirname(filePath),
    extname: (filePath) => require('path').extname(filePath),
    join: (...paths) => require('path').join(...paths)
  }
});