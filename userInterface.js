'use strict'
const path = require('path');
let document;
const fileSystem = require('./fileSystem');

function covertFolderPathIntoLinks(folderPath) {
    const folders = folderPath.split(path.sep);
    const contents = [];
    let pathAtFolder = '';
    folders.forEach(folder => {
        pathAtFolder += folder + path.sep;
        contents.push(`<span class="path" data-path="${pathAtFolder.slice(0, -1)}">${folder}</span>`)
    });
    return contents.join(path.sep).toString();
}

function displayFolderPath(folderPath) {
    document.getElementById('current-folder').innerHTML = covertFolderPathIntoLinks(folderPath);
    bindCurrentFolderPath();
}

function clearView() {
    const mainArea = document.getElementById('main-area');
    let firstChild = mainArea.firstChild;
    while (firstChild) {
        mainArea.removeChild(firstChild);
        firstChild = mainArea.firstChild;
    }
}

function loadDirectory(folderPath) {
    return function (window) {
        if (!document) {
            document = window.document;
        }
        displayFolderPath(folderPath);
        fileSystem.getFilesInFolder(folderPath, (err, files) => {
            clearView();
            if (err) {
                return alert('sorry, you could not load your folder!');
            }
            fileSystem.inspectAndDescribeFiles(folderPath, files, displayFiles);
        })
    }
}

function displayFile(file) {
    const mainArea = document.getElementById('main-area');
    const template = document.querySelector('#item-template');
    let clone = document.importNode(template.content, true);
    clone.querySelector('img').src = `images/${file.type}.svg`;
    if (file.type === 'directory') {
        clone.querySelector('img').addEventListener('dblclick', () => {
            loadDirectory(file.path)();
        }, false);
    } else {
        clone.querySelector('img').addEventListener('dblclick', () => {
            fileSystem.openFile(file.path);
        }, false);
    }
    clone.querySelector('.filename').innerText = file.file;
    mainArea.appendChild(clone);
}

function displayFiles(err, files) {
    if (err) {
        return alert('sorry, we could not display your files!');
    }
    files.forEach(displayFile);
}

function bindDocument(window) {
    if (!document) {
        document = window.document;
    }
}

function bindCurrentFolderPath() {
    const load = (event) => {
        const folderPath = event.target.getAttribute('data-path');
        loadDirectory(folderPath)();
    };
    const paths = document.getElementsByClassName('path');
    for (let i = 0; i < paths.length; i++) {
        paths[i].addEventListener('click', load, false);
    }
}

module.exports = {
    bindDocument,
    displayFiles,
    loadDirectory
};