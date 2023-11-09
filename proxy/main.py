from flask import Flask, request, jsonify
import requests

from config import Config

app = Flask(__name__)
EXPRESS_API_BASE_URL = Config.EXPRESS_API_BASE_URL


@app.route("/api/users", methods=["GET"])
def get_users():
    response = requests.get(EXPRESS_API_BASE_URL, params=request.args)
    return jsonify(response.json()), response.status_code


@app.route("/api/users", methods=["POST"])
def create_user():
    response = requests.post(EXPRESS_API_BASE_URL, json=request.json)
    return jsonify(response.json()), response.status_code


@app.route("/api/users/email/<string:email>", methods=["GET"])
def get_user_by_email(email):
    response = requests.get(f"{EXPRESS_API_BASE_URL}/email/{email}")
    return jsonify(response.json()), response.status_code


@app.route("/api/users/<string:user_id>", methods=["GET", "PATCH", "DELETE"])
def user_operations(user_id):
    url = f"{EXPRESS_API_BASE_URL}/{user_id}"

    if request.method == "GET":
        response = requests.get(url)
    elif request.method == "PATCH":
        response = requests.patch(url, json=request.json)
    elif request.method == "DELETE":
        response = requests.delete(url)
    else:
        return (
            jsonify(
                {
                    "error": {
                        "httpCode": 405,
                        "name": "METHOD NOT ALLOWED",
                    }
                }
            ),
            405,
        )

    return jsonify(response.json()), response.status_code


def create_app():
    return app
