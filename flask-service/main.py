import os
from datetime import timedelta

import resources

from flask import Flask, request, send_from_directory, session, render_template
from flask_cors import CORS
from flask_restful import Api
from flask_apscheduler import APScheduler

from util.errors import ProcessingError

from config import (
    PORT,
    DEBUG,
    logger,
)

try:
    logger.info("Initializing Service")
    app = Flask(__name__, static_folder = "./client/dist", template_folder="pages")
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    app.config.update(
        CORS_HEADERS="Content-Type",
        SCHEDULER_API_ENABLED=True,
        PERMANENT_SESSION_LIFETIME=timedelta(minutes=15),
        STATIC_URL_PATH="/static"
    )

    scheduler = APScheduler()
    scheduler.init_app(app)
    scheduler.start()

    api = Api(app)
except Exception as e:
    logger.error("Error Initializing Service")
else:
    logger.info("Initialization Successful")

api.add_resource(resources.CiteWebsite, '/v1/cite')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def page_not_found(e):
    ip = request.environ.get('HTTP_CF_CONNECTING_IP', request.remote_addr)
    path = request.path
    ray = request.environ.get('HTTP_CF_RAY')
    logger.error(f"404: {ip} requested {path}")
    return render_template('errors/404.html', path=path, ip=ip, ray=ray), 404

@app.errorhandler(ProcessingError)
def processing_error(e):
    return { "message": str(e), "error": "PROCESSING_ERROR", "path": request.path }, 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT, debug=DEBUG)
