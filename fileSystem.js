'use strict';

const osenv = require('osenv');
const fs = require('fs');
const path = require('path');
const async = require('async');

function getUserHomeFolder() {
    return osenv.home();
}

function getFilesInFolder(folderPath, cb) {
    fs.readdir(folderPath, cb);
}

function inspectAndDescribeFile(filePath, cb) {
    let result = {
        file: path.basename(filePath),
        path: filePath,
        type: ''
    };
    fs.stat(filePath, (err, stat) => {
        if (err) {
            cb(err);
        } else {
            if (stat.isFile()) {
                result.type = 'file';
            }
            if (stat.isDirectory()) {
                result.type = 'directory';
            }
            cb(err, result);
        }
    })
}

function inspectAndDescribeFiles(folderPath, files, cb) {
    async.map(files, (file, asyncCb) => {
        let resolvedFilePath = path.resolve(folderPath, file);
        inspectAndDescribeFile(resolvedFilePath, asyncCb);
    }, cb);
}

function openFile(filePath) {
    let shell = require('electron').shell;
    shell.openItem(filePath);
}
module.exports = {
    getFilesInFolder,
    getUserHomeFolder,
    inspectAndDescribeFiles,
    openFile
};