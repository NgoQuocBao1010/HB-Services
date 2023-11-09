import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "NHQB_SECRET_KEY")
    DEBUG = False
    EXPRESS_API_BASE_URL = os.getenv(
        "EXPRESS_API_BASE_URL", "http://127.0.0.1:9000/api/users"
    )


key = Config.SECRET_KEY
