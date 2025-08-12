const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  saveFile: (data, filename) => ipcRenderer.invoke('save-file', data, filename),
  
  // Listen to menu events
  onFilesSelected: (callback) => ipcRenderer.on('files-selected', callback),
  onExportExcel: (callback) => ipcRenderer.on('export-excel', callback),
  onExportSummary: (callback) => ipcRenderer.on('export-summary', callback),
  onStartAIAnalysis: (callback) => ipcRenderer.on('start-ai-analysis', callback),
  onStartOCR: (callback) => ipcRenderer.on('start-ocr', callback),
  onBatchProcess: (callback) => ipcRenderer.on('batch-process', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform info
  platform: process.platform,
  isElectron: true
});

// Prevent navigation away from the app
window.addEventListener('beforeunload', (event) => {
  // Allow navigation within the app
  return;
});