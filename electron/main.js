const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Keep a global reference of the window object
let mainWindow;
let serverProcess;

const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 5000;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'default',
    show: false,
    autoHideMenuBar: false
  });

  // Set application menu
  createMenu();

  // Wait for server to start, then load the app
  const serverUrl = `http://localhost:${port}`;
  
  // Function to check if server is ready
  const checkServer = () => {
    const http = require('http');
    const req = http.get(serverUrl, (res) => {
      mainWindow.loadURL(serverUrl);
      mainWindow.once('ready-to-show', () => {
        mainWindow.show();
      });
    });
    
    req.on('error', () => {
      setTimeout(checkServer, 1000);
    });
  };

  // Start checking server after a delay
  setTimeout(checkServer, 2000);

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Upload Documents',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile', 'multiSelections'],
              filters: [
                { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt'] },
                { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] },
                { name: 'Spreadsheets', extensions: ['xls', 'xlsx', 'csv'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            
            if (!result.canceled) {
              mainWindow.webContents.send('files-selected', result.filePaths);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Export Results',
          submenu: [
            {
              label: 'Export to Excel',
              click: () => {
                mainWindow.webContents.send('export-excel');
              }
            },
            {
              label: 'Export Summary',
              click: () => {
                mainWindow.webContents.send('export-summary');
              }
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'AI Analysis',
          click: () => {
            mainWindow.webContents.send('start-ai-analysis');
          }
        },
        {
          label: 'OCR Processing',
          click: () => {
            mainWindow.webContents.send('start-ocr');
          }
        },
        {
          label: 'Batch Process',
          click: () => {
            mainWindow.webContents.send('batch-process');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About XeveDoc',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About XeveDoc',
              message: 'XeveDoc Desktop - AI Document Processor',
              detail: 'Intelligent document analysis and processing tool.\nVersion 1.0.0\n\nFeatures:\n• AI-powered document analysis\n• OCR text extraction\n• Smart categorization\n• Data export capabilities'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function startServer() {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32';
    const npmCmd = isWin ? 'npm.cmd' : 'npm';
    const serverScript = isDev ? 'dev' : 'start';
    
    console.log('Starting server...');
    
    serverProcess = spawn(npmCmd, ['run', serverScript], {
      cwd: process.cwd(),
      stdio: 'pipe',
      env: { ...process.env, ELECTRON_APP: 'true' }
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
      if (data.toString().includes('serving on port')) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      resolve(); // Resolve anyway to prevent hanging
    }, 30000);
  });
}

// IPC handlers for file operations
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'All Supported', extensions: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'] },
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt'] },
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] }
    ]
  });
  return result.filePaths;
});

ipcMain.handle('save-file', async (event, data, filename) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: filename,
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] },
      { name: 'PDF Files', extensions: ['pdf'] },
      { name: 'Text Files', extensions: ['txt'] }
    ]
  });
  
  if (!result.canceled) {
    fs.writeFileSync(result.filePath, data);
    return result.filePath;
  }
  return null;
});

// App event handlers
app.whenReady().then(async () => {
  console.log('Electron app ready, starting server...');
  
  try {
    await startServer();
    console.log('Server started, creating window...');
    createWindow();
  } catch (error) {
    console.error('Failed to start server:', error);
    // Create window anyway for development
    createWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});