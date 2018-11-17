'use strict';

const fileSystem = require('./fileSystem');
const userInterface = require('./userInterface');

function main() {
    userInterface.bindDocument(window);
    const folderPath = fileSystem.getUserHomeFolder();
    userInterface.loadDirectory(folderPath)(window);
}

window.onload = main;