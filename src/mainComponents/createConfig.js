const fs = require("fs");
const os = require("os");
const util = require('util');
const discoverCal = require("../mainComponents/discoverCalendar");
const saveConfigFile = require("../mainComponents/saveConfigFile");
const writeFile = util.promisify(fs.writeFile);

module.exports = async function (data) {
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
    await writeFile(`${os.homedir()}/sealcalendar/config`, config);
    await saveConfigFile(`${os.homedir()}/sealcalendar/config`);
    await discoverCal(`${os.homedir()}/sealcalendar/config`);
};