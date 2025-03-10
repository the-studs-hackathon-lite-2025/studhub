const path = require('path');

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