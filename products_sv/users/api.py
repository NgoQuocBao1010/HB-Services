from ninja import Query, Router
from ninja.responses import codes_4xx, codes_5xx

from .proxy import UserServicesProxy
from .utils import remove_none_values
from .schema import (
    PaginationQuery,
    UserCreatePayload,
    UserUpdatePayload,
    UserInfoResponse,
    DeleteResponse,
    ErrorResponse,
)

router = Router()
userServiceProxy = UserServicesProxy("http://0.0.0.0:9000")

standardResponse = {
    200: UserInfoResponse,
    codes_4xx: ErrorResponse,
    codes_5xx: ErrorResponse,
}


@router.get("/")
def get_users(request, query: PaginationQuery = Query(...)):
    data, http_code = userServiceProxy.get_users(query)
    return http_code, data


@router.post(
    "/",
    response={**standardResponse, 201: UserInfoResponse, 200: None},
)
def create_users(request, user_data: UserCreatePayload):
    payload = remove_none_values(user_data.dict())
    data, http_code = userServiceProxy.create_user(payload)

    return http_code, data


@router.get(
    "/email/{email}",
    response=standardResponse,
)
def get_user_by_email(request, email: str):
    data, http_code = userServiceProxy.get_user_by_email(email)
    return http_code, data


@router.get(
    "/{user_id}",
    response=standardResponse,
)
def get_user_by_id(request, user_id: str):
    data, http_code = userServiceProxy.user_operations(user_id, method="GET")
    return http_code, data


@router.patch(
    "/{user_id}",
    response=standardResponse,
)
def update_user_by_id(request, user_id: str, update_data: UserUpdatePayload):
    payload = remove_none_values(update_data.dict())

    data, http_code = userServiceProxy.user_operations(
        user_id, method="PATCH", data=payload
    )
    return http_code, data


@router.delete(
    "/{user_id}",
    response={**standardResponse, 200: DeleteResponse},
)
def delete_user_by_id(request, user_id: str):
    data, http_code = userServiceProxy.user_operations(user_id, method="DELETE")
    return http_code, data
