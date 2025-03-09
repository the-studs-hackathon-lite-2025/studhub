import os
from dotenv import load_dotenv
from util.logz import create_logger

load_dotenv() 
logger = create_logger()

MONGO_URI = os.environ.get("MONGODB_URI")
PORT=os.getenv("PORT", default=8080)
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY")
NUMLOOKUP_API_KEY = os.getenv("NUMLOOKUP_API_KEY")
DRIVER_NODES = os.getenv("DRIVER_NODES", None)