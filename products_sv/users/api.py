from ninja import Query, Schema, Router
from ninja.responses import codes_4xx, codes_5xx

from .proxy import UserServicesProxy
from .utils import remove_none_values

router = Router()
userServiceProxy = UserServicesProxy("http://0.0.0.0:9000")


class PaginationQuery(Schema):
    page: int = 1
    perPage: int = 100


class UserInfo(Schema):
    email: str
    displayName: str = None
    gender: str = None
    address: str = None
    age: int = None


class ErrorDetailResponse(Schema):
    httpCode: int
    isOperational: bool
    name: str


class ErrorResponse(Schema):
    error: ErrorDetailResponse
    message: str


@router.get("/")
def get_users(request, query: PaginationQuery = Query(...)):
    data, http_code = userServiceProxy.get_users(query)
    return http_code, data


class UserInfoResponse(Schema):
    user: UserInfo


@router.post(
    "/",
    response={
        201: UserInfoResponse,
        codes_4xx: ErrorResponse,
        codes_5xx: ErrorResponse,
    },
)
def create_users(request, user_data: UserInfo):
    payload = remove_none_values(user_data.dict())
    data, http_code = userServiceProxy.create_user(payload)

    return http_code, data


@router.get(
    "/email/{email}",
    response={
        200: UserInfoResponse,
        codes_4xx: ErrorResponse,
        codes_5xx: ErrorResponse,
    },
)
def get_user_by_email(request, email: str):
    data, http_code = userServiceProxy.get_user_by_email(email)
    return http_code, data


@router.get(
    "/{user_id}",
    response={
        200: UserInfoResponse,
        codes_4xx: ErrorResponse,
        codes_5xx: ErrorResponse,
    },
)
def get_user_by_id(request, user_id: str):
    data, http_code = userServiceProxy.user_operations(user_id, method="GET")
    return http_code, data


class UserUpdatePayload(Schema):
    displayName: str = None
    gender: str = None
    address: str = None
    age: int = None


@router.patch(
    "/{user_id}",
    response={
        200: UserInfoResponse,
        codes_4xx: ErrorResponse,
        codes_5xx: ErrorResponse,
    },
)
def update_user_by_id(request, user_id: str, update_data: UserUpdatePayload):
    payload = remove_none_values(update_data.dict())

    data, http_code = userServiceProxy.user_operations(
        user_id, method="PATCH", data=payload
    )
    return http_code, data


class DeleteResponse(Schema):
    message: str
    deletedRows: int


@router.delete(
    "/{user_id}",
    response={
        200: DeleteResponse,
        codes_4xx: ErrorResponse,
        codes_5xx: ErrorResponse,
    },
)
def delete_user_by_id(request, user_id: str):
    data, http_code = userServiceProxy.user_operations(user_id, method="DELETE")
    return http_code, data
