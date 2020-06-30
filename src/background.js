"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import {
	createProtocol,
	installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
import { exec } from "child_process";

import uid from "uid";

const fs = require("fs");

const isDevelopment = process.env.NODE_ENV !== "production";
if (isDevelopment) {
	// Don't load any native (external) modules until the following line is run:
	require("module").globalPaths.push(process.env.NODE_MODULES_PATH);
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
let taskWindow;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(["app"], {
	secure: true,
});

function createMainWindow() {
	const window = new BrowserWindow({
		minWidth: 900,
		minHeight: 700,
	});

	if (isDevelopment) {
		// Load the url of the dev server if in development mode
		window.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) window.webContents.openDevTools();
	} else {
		createProtocol("app");
		//   Load the index.html when not in development
		window.loadURL(
			formatUrl({
				pathname: path.join(__dirname, "index.html"),
				protocol: "file",
				slashes: true,
			})
		);
		window.loadURL("https://vuejs.org/v2/guide/transitions.html");
	}

	window.on("closed", () => {
		mainWindow = null;
	});

	window.webContents.on("devtools-opened", () => {
		window.focus();
		setImmediate(() => {
			window.focus();
		});
	});

	return window;
}

function createTaskWindow() {
	const window = new BrowserWindow({
		width: 300,
		height: 200,
	});

	if (isDevelopment) {
		// Load the url of the dev server if in development mode
		window.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "/#/task");
	}

	window.on("closed", () => {
		taskWindow = null;
	});

	return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
	// on macOS it is common for applications to stay open until the user explicitly quits
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// on macOS it is common to re-create a window even after all windows have been closed
	if (mainWindow === null) {
		mainWindow = createMainWindow();
	}
});

// create main BrowserWindow when electron is ready
app.on("ready", async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		await installVueDevtools();
	}
	mainWindow = createMainWindow();
});

ipcMain.on("syncCalendar", (event, data) => {
	exec("vdirsyncer sync", (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			throw err;
		} else {
			console.log("Synchronized calendar!");
		}
	});
});

ipcMain.on("createEvent", (event, data) => {
	const ID = uid(16).toUpperCase();
	const newEvent = `BEGIN:VCALENDAR\nPRODID:-//Nextcloud calendar v1.6.5\nVERSION:2.0\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nUID:${ID}\nSUMMARY:${
		data.title
	}\nDESCRIPTION:${data.description}\nLOCATION:${
		data.location
	}\nCLASS:PUBLIC\nDTSTART;VALUE=DATE:${data.start[0]}${
		data.start[1] >= 10 ? data.start[1] : "0" + data.start[1]
	}${
		data.start[2] >= 10 ? data.start[2] : "0" + data.start[2]
	}\nDTEND;VALUE=DATE:${data.start[0]}${
		data.end[1] >= 10 ? data.end[1] : "0" + data.end[1]
	}${
		data.end[2] >= 10 ? data.end[2] : "0" + data.end[2]
	}\nEND:VEVENT\nEND:VCALENDAR`;

	fs.writeFile(`/usr/local/Cellar/calendar/bartek/${ID}.ics`, newEvent);
});
