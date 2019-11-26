// Logs handling.
// TODO: Add support for config file
// TODO: Load config file, configure logs
// TODO: Add external logging service capability
// TODO: Wrap all parse and mongo logs

/* eslint-disable-next-line no-unused-vars */
const logzConfig = require('./logz-config.json');

const error = (errorMessage) => {
  console.log('\x1b[31m', `${'[ ERROR ]\t\x1b[0m'}${errorMessage}`);
};
  // Handle regular logging
const log = (logMessage) => {
  console.log('\x1b[33m', `${'[  LOG  ]\t\x1b[0m'}${logMessage}`);
};

// Handle success logging
const success = (successMessage) => {
  console.log('\x1b[32m', `${'[  OK   ]\t\x1b[0m'}${successMessage}`);
};

export default {
  error,
  log,
  success,
};

// TODO: Process summary logging
// const Box = require('cli-box');
/*
exports.summary = function(summary) {
    console.log(`--------------------------------`)
    console.log('\n\n')
    var b = Box("50x1",  {
        text: "SUMMARY",
        stretch: true,
        autoEOL: true
    })
    var b1 = Box("50x10",  {
        text: ` Successful transfers: ${summary.successful}\n
                Unsuccessful transfers: ${summary.unsucessful}\n`,
        stretch: true,
        autoEOL: true,
        hAlign: "left"
    })
    console.log(b.toString())
    console.log(b1.toString())
    console.log('\n\n')
}
*/
