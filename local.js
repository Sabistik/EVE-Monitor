

var socket = null;

function setSocket(obj) {
    socket = obj;
}

function update(text)
{
    var regexp = /^[a-zA-Z0-9-']{3,37}$|^[a-zA-Z0-9-']{1,24} [a-zA-Z0-9-']{1,12}$|^[a-zA-Z0-9-']+ [a-zA-Z0-9-']+ [a-zA-Z0-9-']{1,12}$/g
    
    // ^[a-zA-Z0-9-']{3,37}$|^[a-zA-Z0-9-']{1,24} [a-zA-Z0-9-']{1,12}$|^[a-zA-Z0-9-']+ [a-zA-Z0-9-']+ [a-zA-Z0-9-']{1,12}$
    // ([a-z]+\s[a-z]+){1,10}

}

module.exports = {
    update: update,
    setSocket: setSocket
};