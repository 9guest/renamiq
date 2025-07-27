// main.js - Electron Main Process
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      devTools: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  mainWindow.loadFile('renderer/index.html');

  // Suppress DevTools autofill warnings in production
  if (process.env.NODE_ENV !== 'development') {
    mainWindow.webContents.on('console-message', (event, level, message) => {
      if (message.includes('Autofill.enable') || message.includes('Autofill.setAddresses')) {
        event.preventDefault();
      }
    });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    mainWindow.webContents.openDevTools();
    
  });

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Add Files',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.send('menu-add-files')
        },
        {
          label: 'Add Folder',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: () => mainWindow.webContents.send('menu-add-folder')
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo Rename',
          accelerator: 'CmdOrCtrl+Z',
          click: () => mainWindow.webContents.send('menu-undo')
        },
        { type: 'separator' },
        {
          label: 'Clear All',
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => mainWindow.webContents.send('menu-clear-all')
        }
      ]
    },
    {
      label: 'Templates',
      submenu: [
        {
          label: 'Save Template',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu-save-template')
        },
        {
          label: 'Load Template',
          accelerator: 'CmdOrCtrl+L',
          click: () => mainWindow.webContents.send('menu-load-template')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC Handlers
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled) {
    const files = [];
    for (const filePath of result.filePaths) {
      try {
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          files.push({
            path: filePath,
            name: path.basename(filePath),
            ext: path.extname(filePath),
            size: stats.size,
            modified: stats.mtime
          });
        }
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
    return files;
  }
  return [];
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled) {
    const folderPath = result.filePaths[0];
    const files = [];
    
    try {
      const items = await fs.readdir(folderPath);
      for (const item of items) {
        const fullPath = path.join(folderPath, item);
        const stats = await fs.stat(fullPath);
        if (stats.isFile()) {
          files.push({
            path: fullPath,
            name: path.basename(fullPath),
            ext: path.extname(fullPath),
            size: stats.size,
            modified: stats.mtime
          });
        }
      }
    } catch (error) {
      console.error('Error reading folder:', error);
    }
    
    return files;
  }
  return [];
});

ipcMain.handle('rename-files', async (event, renameOperations) => {
  const results = [];
  const undoData = [];
  
  console.log(`Starting rename operation for ${renameOperations.length} files`);
  
  for (let i = 0; i < renameOperations.length; i++) {
    const operation = renameOperations[i];
    try {
      const oldPath = operation.oldPath;
      const newPath = path.join(path.dirname(oldPath), operation.newName);
      
      console.log(`[${i}] Attempting to rename: "${path.basename(oldPath)}" -> "${operation.newName}"`);
      
      // Check if source file exists
      if (!fsSync.existsSync(oldPath)) {
        console.log(`[${i}] ERROR: Source file does not exist`);
        results.push({
          success: false,
          oldPath,
          newPath,
          error: 'Source file does not exist'
        });
        continue;
      }
      
      // Check if target file already exists
      if (fsSync.existsSync(newPath)) {
        console.log(`[${i}] ERROR: Target file already exists`);
        results.push({
          success: false,
          oldPath,
          newPath,
          error: 'Target file already exists'
        });
        continue;
      }
      
      // Check if the new name is valid (not empty, no invalid characters)
      if (!operation.newName || operation.newName.trim() === '') {
        console.log(`[${i}] ERROR: Invalid filename - empty`);
        results.push({
          success: false,
          oldPath,
          newPath,
          error: 'Invalid filename: empty name'
        });
        continue;
      }
      
      // Check for invalid characters in filename
      const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
      if (invalidChars.test(operation.newName)) {
        console.log(`[${i}] ERROR: Invalid characters in filename`);
        results.push({
          success: false,
          oldPath,
          newPath,
          error: 'Invalid filename: contains invalid characters'
        });
        continue;
      }
      
      // Check if old and new paths are the same
      if (oldPath === newPath) {
        console.log(`[${i}] SKIP: No change needed`);
        results.push({
          success: true, // Changed from false to true since no change is needed
          oldPath,
          newPath,
          error: null
        });
        continue;
      }
      
      await fs.rename(oldPath, newPath);
      console.log(`[${i}] SUCCESS: Renamed successfully`);
      
      results.push({
        success: true,
        oldPath,
        newPath
      });
      
      undoData.push({
        oldPath: newPath,
        newPath: oldPath
      });
      
    } catch (error) {
      console.error(`[${i}] ERROR: Rename failed:`, error.message);
      results.push({
        success: false,
        oldPath: operation.oldPath,
        newPath: operation.newName,
        error: error.message
      });
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  console.log(`Rename operation completed. Success: ${successCount}, Failed: ${failCount}`);
  
  return { results, undoData };
});

ipcMain.handle('undo-rename', async (event, undoData) => {
  const results = [];
  
  for (const operation of undoData) {
    try {
      await fs.rename(operation.oldPath, operation.newPath);
      results.push({
        success: true,
        oldPath: operation.oldPath,
        newPath: operation.newPath
      });
    } catch (error) {
      results.push({
        success: false,
        oldPath: operation.oldPath,
        newPath: operation.newPath,
        error: error.message
      });
    }
  }
  
  return results;
});

ipcMain.handle('save-template', async (event, templateData) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'Renamiq Template', extensions: ['rnq'] }
    ],
    defaultPath: 'template.rnq'
  });
  
  if (!result.canceled) {
    try {
      await fs.writeFile(result.filePath, JSON.stringify(templateData, null, 2));
      return { success: true, path: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  return { success: false, error: 'Cancelled' };
});

ipcMain.handle('load-template', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    filters: [
      { name: 'Renamiq Template', extensions: ['rnq'] }
    ],
    properties: ['openFile']
  });
  
  if (!result.canceled) {
    try {
      const data = await fs.readFile(result.filePaths[0], 'utf8');
      return { success: true, data: JSON.parse(data) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  return { success: false, error: 'Cancelled' };
});

ipcMain.handle('get-file-info', async (event, filePaths) => {
  const files = [];
  
  for (const filePath of filePaths) {
    try {
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        files.push({
          path: filePath,
          name: path.basename(filePath),
          ext: path.extname(filePath),
          size: stats.size,
          modified: stats.mtime
        });
      }
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }
  
  return files;
});