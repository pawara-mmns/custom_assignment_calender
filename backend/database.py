import jaydebeapi
import jpype
import os
import threading

_lock = threading.Lock()
_connection = None

H2_JAR = os.path.join(os.path.dirname(__file__), "h2", "h2-2.2.224.jar")
DB_URL = "jdbc:h2:file:" + os.path.join(os.path.dirname(__file__), "data", "assignments").replace("\\", "/")
DB_USER = "sa"
DB_PASSWORD = ""

CREATE_TABLE = """
CREATE TABLE IF NOT EXISTS assignments (
    id          VARCHAR(36) PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    due_date    VARCHAR(30) NOT NULL,
    course      VARCHAR(100) DEFAULT '',
    type        VARCHAR(20) DEFAULT 'homework',
    assigned_to VARCHAR(10) DEFAULT 'you',
    priority    VARCHAR(10) DEFAULT 'medium',
    status      VARCHAR(20) DEFAULT 'upcoming',
    notes       TEXT DEFAULT '',
    created_at  VARCHAR(30),
    updated_at  VARCHAR(30)
)
"""


def _start_jvm():
    if not jpype.isJVMStarted():
        jpype.startJVM(classpath=[H2_JAR])


def get_connection():
    global _connection
    with _lock:
        if _connection is None:
            _start_jvm()
            os.makedirs(os.path.join(os.path.dirname(__file__), "data"), exist_ok=True)
            _connection = jaydebeapi.connect(
                "org.h2.Driver",
                DB_URL,
                [DB_USER, DB_PASSWORD],
                H2_JAR,
            )
            cursor = _connection.cursor()
            cursor.execute(CREATE_TABLE)
            cursor.close()
        return _connection


def close_connection():
    global _connection
    with _lock:
        if _connection:
            try:
                _connection.close()
            except Exception:
                pass
            _connection = None
