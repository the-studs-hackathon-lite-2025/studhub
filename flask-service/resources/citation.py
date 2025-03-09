from util.logz import create_logger
from flask_restful import Resource
from urllib.parse import urlparse

from flask import request

import requests

import concurrent.futures

def zoterobib_lookup(url):
    headers = {
        'cache-control': 'no-cache',
        'content-type': 'text/plain',
    }

    response = requests.post('https://t0guvf0w17.execute-api.us-east-1.amazonaws.com/Prod/web', headers=headers, data=url)

    return response.json()

class SyncKeys(Resource):
    def __init__(self):
        self.logger = create_logger()

class CiteWebsite(Resource):
    def __init__(self):
        self.logger = create_logger()

    def get(self):
        query = request.args.get('url')

        if query is None:
            return {"error": "No URL Provided"}, 400
        
        # validate valid URL

        try:
            result = urlparse(query)
            if all([result.scheme, result.netloc]):
                pass
            else:
                return {"error": "Invalid URL Provided"}, 400
        except:
            return {"error": "Invalid URL Provided"}, 400
        
        return zoterobib_lookup(query)
