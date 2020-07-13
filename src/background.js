"use strict";

import { app, protocol, BrowserWindow, ipcMain, Menu } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import {
	createProtocol,
	installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";

import uid from "uid";

import ical from "ical";
import fs from "fs";
import util from "util";
import os from "os";
import createEventDate from "../src/mainComponents/createEventDates";
import saveConfigFile from "../src/mainComponents/saveConfigFile";
import checkConfig from "../src/mainComponents/checkConfig";
import syncCalendar from "../src/mainComponents/syncCalendar";
import discoverCal from "../src/mainComponents/discoverCalendar";

const readdir = util.promisify(fs.readdir);

const readfile = util.promisify(fs.readFile);

const fromEntries = require("fromentries");

const pathExists = util.promisify(fs.exists);

const unlink = util.promisify(fs.unlink);

const exec = util.promisify(require("child_process").exec);

let confPath = "";
let calDirs = {};

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

const isMac = process.platform === "darwin";

function createMainWindow() {
	const window = new BrowserWindow({
		width: 1000,
		height: 700,
		minWidth: 800,
		minHeight: 600,
	});

	const menu = Menu.buildFromTemplate([
		{
			label: "SealCal",
			submenu: [
				{
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
			submenu: [
				{
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
				...(isMac
					? [
							{
								role: "pasteAndMatchStyle",
							},
							{
								role: "delete",
							},
							{
								role: "selectAll",
							},
							{
								type: "separator",
							},
							{
								label: "Speech",
								submenu: [
									{
										role: "startspeaking",
									},
									{
										role: "stopspeaking",
									},
								],
							},
					  ]
					: [
							{
								role: "delete",
							},
							{
								type: "separator",
							},
							{
								role: "selectAll",
							},
					  ]),
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
ipcMain.on("syncCalendar", async (event, data) => {
	await syncCalendar(confPath);
});
//Render process communication with main process

ipcMain.on("calendar-start", async (event, data) => {
	const exists = await pathExists(
		`${os.homedir()}/.config/sealcal/config.txt`
	);
	console.log(exists);
	if (exists) {
		const conf = await readfile(
			`${os.homedir()}/.config/sealcal/config.txt`,
			{
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
	} else {
		event.sender.send("config-error", "No config file");
		console.error(err);
		return;
	}
});

ipcMain.on("createEvent", (event, data) => {
	const ID = uid(16).toUpperCase();
	const startDate = createEventDate(data.start, data.allDay);

	const endDate = createEventDate(data.end, data.allDay);

	const freq = data.freq ? `\nRRULE:FREQ=${data.freq}` : "";

	const newEvent = `BEGIN:VCALENDAR\nPRODID:-//Nextcloud calendar v1.6.5\nVERSION:2.0\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nUID:${ID}\nSUMMARY:${
		data.title
	}\nDESCRIPTION:${data.description}\nLOCATION:${
		data.location
	}\nCLASS:PUBLIC\nSTATUS:${
		data.status
	}\nDTSTART;${startDate}\nDTEND;${endDate}${freq}\nEND:VEVENT\nEND:VCALENDAR`;

	fs.writeFile(`${calDirs.path}/${data.collection}/${ID}.ics`, newEvent);
});

ipcMain.on("get-data", (event, data) => {
	async function myF() {
		calDirs.collections.forEach(async (ele) => {
			const names = await readdir(`${calDirs.path}/${ele}`);
			if (names === undefined) {
				console.log("undefined");
			} else {
				names.forEach(async (file) => {
					const data = ical.parseFile(
						`${calDirs.path}/${ele}/${file}`
					);
					if (data[Object.keys(data)[0]].rrule) {
						let res = await readfile(
							`${calDirs.path}/${ele}/${file}`,
							{
								encoding: "utf-8",
							}
						);
						res = res.slice(0, 400);
						const fileData = fromEntries(
							res.split("\n").map((line) => line.split(":"))
						);
						const frequency = fileData.RRULE.split("=");
						data[Object.keys(data)[0]].rrule = frequency[1];
						event.sender.send(
							"got-data",
							data[Object.keys(data)[0]]
						);
					} else {
						event.sender.send(
							"got-data",
							data[Object.keys(data)[0]]
						);
					}
				});
			}
		});
	}

	myF();
});

ipcMain.on("deleteEvent", (event, data) => {
	calDirs.collections.forEach(async (ele) => {
		const exists = await pathExists(`${calDirs.path}/${ele}/${data}.ics`);
		if (exists) {
			unlink(`${calDirs.path}/${ele}/${data}.ics`);
		}
	});
});
ipcMain.on("set-config", async (event, data) => {
	const res = await saveConfigFile(data);
	event.sender.send("set-correct", res);
});

ipcMain.on("create-config", (event, data) => {
	pathExists(`${os.homedir()}/sealcalendar`)
		.then((exists) => {
			if (!exists) {
				fs.mkdir(`${os.homedir()}/sealcalendar`, (err) => {
					fs.mkdir(`${os.homedir()}/sealcalendar/status`);
					fs.mkdir(
						`${os.homedir()}/sealcalendar/calendar_files`,
						(err) => {
							if (err) {
								throw err;
							}
							data.collections.forEach((ele) => {
								fs.mkdir(
									`${os.homedir()}/sealcalendar/calendar_files/${ele}`
								);
							});
						}
					);
				});
			}
		})
		.then(() => {
			let collections = "[";
			data.collections.forEach((ele, index) => {
				if (index != data.collections.length - 1) {
					collections += `"${ele}",`;
				} else {
					collections += `"${ele}"`;
				}
			});
			collections += "]";
			const config = `[general]
status_path = "${os.homedir()}/sealcalendar/status"

[pair calendar]
a = "seal_calendar"
b = "local_calendar"
collections = ${collections}
conflict_resolution = "a wins"
metadata = ["displayname"]

[storage local_calendar]
type = "filesystem"
path = "${os.homedir()}/sealcalendar/calendar_files/"
fileext = ".ics"

[storage seal_calendar]
type = "caldav"
url = "${data.url}"
username = "${data.login}"
password = "${data.password}"
	`;
			fs.writeFile(
				`${os.homedir()}/sealcalendar/config`,
				config,
				async (err) => {
					if (err) {
						throw err;
					}
					await saveConfigFile(`${os.homedir()}/sealcalendar/config`);
					await discoverCal(confPath);
					event.sender.send("config-created", "Config correct");
				}
			);
		});
});
