import requests


class UserServicesProxy:
    def __init__(self, base_url):
        self.base_url = base_url

    def get_users(self, params=None):
        response = requests.get(f"{self.base_url}/api/users", params=params)
        return response.json(), response.status_code

    def create_user(self, user_data):
        response = requests.post(f"{self.base_url}/api/users", json=user_data)
        return response.json(), response.status_code

    def get_user_by_email(self, email: str):
        response = requests.get(f"{self.base_url}/api/users/email/{email}")
        return response.json(), response.status_code

    def user_operations(self, user_id: str, method: str = "GET", data=None):
        url = f"{self.base_url}/api/users/{user_id}"
        if method == "GET":
            response = requests.get(url)
        elif method == "PATCH":
            response = requests.patch(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        else:
            return (
                {"error": {"httpCode": 405, "name": "METHOD NOT ALLOWED"}},
                405,
            )
        return response.json(), response.status_code
