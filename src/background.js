"use strict";

import {
	app,
	protocol,
	BrowserWindow,
	ipcMain,
	Menu
} from "electron";
import * as path from "path";
import {
	format as formatUrl
} from "url";
import {
	createProtocol,
	installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";

import uid from "uid";
import fs from "fs";
import util from "util";
import os from "os";
import saveConfigFile from "../src/mainComponents/saveConfigFile";
import checkConfig from "../src/mainComponents/checkConfig";
import syncCalendar from "../src/mainComponents/syncCalendar";
import deleteEvent from "../src/mainComponents/deleteEvent";
import getData from "../src/mainComponents/getData";
import createEvent from "../src/mainComponents/createEvent";
import createDirectory from "../src/mainComponents/createDirectory";
import createConfig from "../src/mainComponents/createConfig";

const readfile = util.promisify(fs.readFile);
const fromEntries = require("fromentries");
const pathExists = util.promisify(fs.exists);

let confPath = "";
let calDirs = {};
try {
	checkConfig();

	const isDevelopment = process.env.NODE_ENV !== "production";
	if (isDevelopment) {
		// Don't load any native (external) modules until the following line is run:
		require("module").globalPaths.push(process.env.NODE_MODULES_PATH);
	}

	// global reference to mainWindow (necessary to prevent window from being garbage collected)
	let mainWindow;

	// Standard scheme must be registered before the app is ready
	protocol.registerStandardSchemes(["app"], {
		secure: true,
	});

	const windowParams = {
		width: 1000,
		height: 700,
		minWidth: 800,
		minHeight: 600,
	};

	function createMainWindow() {
		const window = new BrowserWindow(windowParams);

		const menu = Menu.buildFromTemplate([{
				label: "SealCal",
				submenu: [{
						label: "Configuration",
						click() {
							window.webContents.send(
								"config-error",
								"change config"
							);
						},
					},
					{
						role: "quit",
					},
				],
			},
			{
				label: "Edit",
				submenu: [{
						role: "undo",
					},
					{
						role: "redo",
					},
					{
						type: "separator",
					},
					{
						role: "cut",
					},
					{
						role: "copy",
					},
					{
						role: "paste",
					},
					[{
							role: "delete",
						},
						{
							type: "separator",
						},
						{
							role: "selectAll",
						},
					],
				],
			},
		]);
		Menu.setApplicationMenu(menu);

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
	//Response on ipcRenderer.send
	ipcMain.on("syncCalendar", async (event) => {
		await syncCalendar(confPath);
		event.sender.send("refreshview");
	});
	//Render process communication with main process

	ipcMain.on("calendar-start", async (event) => {
		const exists = await pathExists(
			`${os.homedir()}/.config/sealcal/config.txt`
		);
		if (!exists) {
			event.sender.send("config-error", "No config file");
			return;
		}
		const conf = await readfile(
			`${os.homedir()}/.config/sealcal/config.txt`, {
				encoding: "utf-8",
			}
		);
		confPath = conf;
		await syncCalendar(confPath);
		const res = await readfile(confPath, "utf-8");
		calDirs = fromEntries(res.split("\n").map((line) => line.split(" = ")));

		await syncCalendar(confPath);
		const collec = calDirs.collections.split(/\["|\"]|"|,| /g);
		calDirs.collections = [];
		collec.forEach((ele) => {
			if (ele) {
				calDirs.collections.push(ele);
			}
		});
		calDirs.path = calDirs.path.split('"')[1];
		event.sender.send("config-correct", calDirs.collections);
		event.sender.send("refreshview");
	});

	ipcMain.on("createEvent", (_event, data) => {
		const ID = uid(16).toUpperCase();
		createEvent(data, calDirs, ID);
	});

	ipcMain.on("get-data", async (event) => {
		const events = await getData(calDirs);
		events.sort(function (a, b) {
			a = new Date(a.start);
			b = new Date(b.start);
			return a.getTime() - b.getTime();
		});

		event.sender.send("got-data", events);
		event.sender.send("refreshview", "View Refreshed");
		await syncCalendar(confPath);
	});

	ipcMain.on("deleteEvent", async (event, data) => {
		await deleteEvent(calDirs, data);
		event.sender.send("item-deleted", "deleted");
		await syncCalendar(confPath);
	});
	ipcMain.on("set-config", async (event, data) => {
		confPath = await saveConfigFile(data);
		event.sender.send("set-correct", confPath);
	});

	ipcMain.on("create-config", async (event, data) => {
		await createDirectory(data);
		await createConfig(data);
		event.sender.send("config-created", "Config correct");
	});
	ipcMain.on("update-event", (_event, data) => {
		createEvent(data, calDirs, data.uid);
	});
} catch (err) {
	console.log(err);
}
