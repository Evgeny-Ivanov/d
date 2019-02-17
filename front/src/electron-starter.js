const electron = require('electron');
const spawn = require('child_process').spawn;
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

/*
 * Keep a global reference of the window object, if you don't, the window will
 * be closed automatically when the JavaScript object is garbage collected.
 */
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1050,
        height: 600,
        // resizable: false,
        'node-integration': 'iframe', // and this line
        'web-preferences': {
            'web-security': false,
        },
    });

    let bat = null;
    if (process.env.REACT_APP_TEST_VAR) {
        bat = spawn('/home/unicorn/work/diploma/back/build/server');
        mainWindow.loadURL('http://localhost:5000');
        mainWindow.webContents.openDevTools();
    } else {
        bat = spawn(__dirname + '/back/server');
        mainWindow.loadURL('file://' + __dirname + '/index.html');
    }


    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        bat.kill('SIGINT');
        /*
         * Dereference the window object, usually you would store windows
         * in an array if your app supports multi windows, this is the time
         * when you should delete the corresponding element.
         */
        mainWindow = null;
    });
}

/*
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {

    /*
     * On OS X it is common for applications and their menu bar
     * to stay active until the user quits explicitly with Cmd + Q
     */
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {

    /*
     * On OS X it's common to re-create a window in the app when the
     * dock icon is clicked and there are no other windows open.
     */
    if (mainWindow === null) {
        createWindow();
    }
});

/*
 * In this file you can include the rest of your app's specific main process
 * code. You can also put them in separate files and require them here.
 */
