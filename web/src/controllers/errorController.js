const path = require('path');
const fs = require('fs');

exports.get404Page = (req, res) => {
    try {
        //  read 404.html file
        const filePath = path.join(__dirname, '..', 'public', 'error', '404.html');
        const html = fs.readFileSync(filePath, 'utf8');

        res.status(404).send(
            html.
            replace("{{path}}", req.url).
            replace("{{connecting_ip}}", req.headers['cf-connecting-ip'] || req.connection.remoteAddress).
            replace("{{cf_ray}}", req.headers['cf-ray'] || 'N/A')
        );
    } catch (error) {
        console.error('Error serving 404.html:', error);
        res.status(404).send('404 Not Found');
    }
};