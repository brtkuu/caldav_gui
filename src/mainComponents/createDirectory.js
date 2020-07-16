const fs = require('fs')
const util = require('util');
const os = require('os');
const mkdir = util.promisify(fs.mkdir);
const pathExists = util.promisify(fs.exists);


module.exports = async function (data) {
    const exists = await pathExists(`${os.homedir()}/sealcalendar`);
    if (!exists) {
        await mkdir(`${os.homedir()}/sealcalendar`)
        await mkdir(`${os.homedir()}/sealcalendar/status`);
        await mkdir(`${os.homedir()}/sealcalendar/calendar_files`)
        for (ele of data.collections) {
            fs.mkdir(
                `${os.homedir()}/sealcalendar/calendar_files/${ele}`
            );
        };
    }
}