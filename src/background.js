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
import { rejects } from "assert";

const ical = require("ical");
const fs = require("fs");
const util = require("util");
const os = require("os");

const readdir = util.promisify(fs.readdir);

const readfile = util.promisify(fs.readFile);

const fromEntries = require("fromentries");

const pathExists = util.promisify(fs.exists);

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

function createMainWindow() {
	const window = new BrowserWindow({
		width: 1000,
		height: 700,
		minWidth: 800,
		minHeight: 600,
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
ipcMain.on("syncCalendar", (event, data) => {
	syncCalendar();
});
//Render process communication with main process

ipcMain.on("calendar-start", (event, data) => {
	fs.readFile(
		`${os.homedir()}/.config/sealcal/config.txt`,
		{
			encoding: "utf-8",
		},
		(err, data) => {
			if (err) {
				event.sender.send("config-error", "No config file");
				console.error(err);
				return;
			}
			confPath = data;
			syncCalendar(data);
			readfile(confPath, "utf-8").then((res) => {
				calDirs = fromEntries(
					res.split("\n").map((line) => line.split(" = "))
				);
			});

			syncCalendar().then(() => {
				calDirs.collections = calDirs.collections.split('"')[1];
				calDirs.path = calDirs.path.split('"')[1];
				console.log(calDirs);
				event.sender.send("config-correct", "Config correct");
			});
		}
	);
});

ipcMain.on("createEvent", (event, data) => {
	const ID = uid(16).toUpperCase();
	const startDate = createEventDate(data.start, data.allDay);

	const endDate = createEventDate(data.end, data.allDay);

	const newEvent = `BEGIN:VCALENDAR\nPRODID:-//Nextcloud calendar v1.6.5\nVERSION:2.0\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nUID:${ID}\nSUMMARY:${
		data.title
	}\nDESCRIPTION:${data.description}\nLOCATION:${
		data.location
	}\nCLASS:PUBLIC\nDTSTART;${startDate}\nDTEND;${endDate}\nEND:VEVENT\nEND:VCALENDAR`;

	fs.writeFile(`${calDirs.path}/${calDirs.collections}/${ID}.ics`, newEvent);
});

ipcMain.on("get-data", (event, data) => {
	async function myF() {
		syncCalendar();
		try {
			console.log(`${calDirs.path}${calDirs.collections}/`);
			await readdir(`${calDirs.path}${calDirs.collections}/`).then(
				(names) => {
					console.log(names);
					if (names === undefined) {
						console.log("undefined");
					} else {
						names.forEach((file) => {
							const data = ical.parseFile(
								`${calDirs.path}/${calDirs.collections}/${file}`
							);
							event.sender.send(
								"got-data",
								data[Object.keys(data)[0]]
							);
						});
					}
				}
			);
		} catch (err) {
			throw err;
		}
	}

	myF();
});

ipcMain.on("deleteEvent", (event, data) => {
	syncCalendar();
	fs.unlink(`${calDirs.path}/${calDirs.collections}/${data}.ics`, (err) => {
		if (err) {
			throw err;
		} else {
			console.log(`File ${data}.ics deleted!`);
		}
	});
});
ipcMain.on("set-config", (event, data) => {
	saveConfigFile(data);
	event.sender.send("set-correct", "config set-correct");
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
							fs.mkdir(
								`${os.homedir()}/sealcalendar/calendar_files/bartek`
							);
						}
					);
				});
			}
		})
		.then(() => {
			const config = `[general]
status_path = "${os.homedir()}/sealcalendar/status"

[pair calendar]
a = "seal_calendar"
b = "local_calendar"
collections = ["bartek"]
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
					discoverCal().then(() => {
						event.sender.send("config-created", "Config correct");
					});
				}
			);
		});
});

//functions
function syncCalendar() {
	return new Promise((resolve, reject) => {
		exec(`vdirsyncer -c ${confPath} sync`, (err, stdout, stderr) => {
			if (err) {
				throw err;
			}
			resolve(stdout);
		});
	});
}

function createEventDate(date, allDay) {
	return `${
		allDay
			? `VALUE=DATE:${date[0]}${
					`${date[1]}`.length == 2 ? date[1] : "0" + date[1]
			  }${`${date[2]}`.length == 2 ? date[2] : "0" + date[2]}`
			: `TZID=Europe/Warsaw:${date[0]}${
					`${date[1]}`.length == 2 ? date[1] : "0" + date[1]
			  }${`${date[2]}`.length == 2 ? date[2] : "0" + date[2]}T${
					`${date[3]}`.length == 2 ? date[3] : "0" + date[3]
			  }${`${date[4]}`.length == 2 ? date[4] : "0" + date[4]}00`
	}`;
}

function checkConfig() {
	fs.exists(`${os.homedir()}/.config/sealcal`, (exists) => {
		if (!exists) {
			fs.mkdir(`${os.homedir()}/.config/sealcal`, (err) => {
				if (err) {
					throw err;
				}
			});
		}
	});
}

function saveConfigFile(configFile) {
	return new Promise((resolve, reject) => {
		fs.writeFile(
			`${os.homedir()}/.config/sealcal/config.txt`,
			configFile,
			(err) => {
				if (err) {
					throw err;
				}
				confPath = configFile;
				resolve(configFile);
			}
		);
	});
}

function discoverCal() {
	return new Promise((resolve, reject) => {
		exec(`vdirsyncer -c ${confPath} discover`, (err, stdout, stderr) => {
			if (err) {
				throw err;
			}
			resolve(stdout);
		});
	});
}
