const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

exports.ping = (req, res) => {
    res.send('pong');
};

exports.getRobots = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'robot/robots.txt'));
};

exports.getRobotsMinified = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'robot/robots.min.txt'));
};

exports.cite = async (req, res) => {
    try {
        const url = new URL(req.body.url);
        
        if (!["http:", "https:"].includes(url.protocol)) {
            res.status(400).send({ error: 'Invalid URL' });
            return;
        }
    } catch (e) {
        console.error(e);
        res.status(400).send({ error: 'Invalid URL' });
        return;
    }

    try {
        const url = process.env.FLASK_SERVICE_URL || 'http://localhost:8080';
        const response = await fetch(url + '/v1/cite?' + new URLSearchParams(req.body)) 
        const data = await response.json();
        res.send(data);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: e.message });
    }
};

exports.uploadAudio = async (req, res) => {
    console.log(req.files, req.files.file === undefined);

    if (!req.files || req.files.file === undefined) {
        res.status(400).send({ 'error': 'No file was sent' });
        return;
    }

    const { file } = req.files;
    const mimeType = file.mimetype;
    const fileName = file.name;
    const fileExtension = fileName == "blob" ? "." + mimeType.split('/')[1] : path.extname(fileName); 
    
    if (!mimeType.startsWith('audio/')) {
        res.status(400).send({ 'error': 'Invalid file type' });
        return;
    }

    const fileId = uuidv4() + fileExtension;
    const filePath = path.join(__dirname, '..', 'public', 'uploads', fileId);

    if (!fs.existsSync(path.join(__dirname, '..', 'public', 'uploads'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'public', 'uploads'));
    }

    try {
        file.mv(filePath);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ "error": "error uploading file" });
    }

    res.send({ message: "success", id: fileId });
}

exports.transcribeAudio = async (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, '..', 'public', 'uploads', id);

    if (!fs.existsSync(filePath)) {
        res.status(404).send({ 'error': 'File not found' });
        return;
    }

    const url = process.env.FLASK_SERVICE_URL || 'http://localhost:8080';
