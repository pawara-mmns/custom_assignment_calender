from pymongo import MongoClient

MONGO_URI = "mongodb+srv://pawarasamarawickrama_db_user:f2bBBL1SUjAt2JR7@pawara.sg4mdbr.mongodb.net/?appName=pawara"
DB_NAME = "assigncal"
COLLECTION_NAME = "assignments"

_client: MongoClient | None = None


def get_db():
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI)
    return _client[DB_NAME]


def get_collection():
    return get_db()[COLLECTION_NAME]


def close_connection():
    global _client
    if _client:
        _client.close()
        _client = None
