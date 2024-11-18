function getDir(file) {
    let dir;
    let fileDir = file.split("\\");
    for (let i = 0; i < fileDir.length; i++) {
        if (fileDir[i] == "Commands") {
            dir = fileDir.slice(-(fileDir.length - i)).join("\\");
        }
    }
    return dir;
}

module.exports = {
    getDir,
}