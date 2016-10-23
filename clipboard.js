var clipboard = require("copy-paste");


var currentClipboardText = '';

function monitor(callback) {
    var newTextClipboard = clipboard.paste();

    if(currentClipboardText != newTextClipboard) {
        currentClipboardText = newTextClipboard;

        callback(newTextClipboard);

    }
}

module.exports = {
    monitor: monitor
};