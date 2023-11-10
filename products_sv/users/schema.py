from ninja import Schema


class PaginationQuery(Schema):
    page: int = 1
    perPage: int = 100


class UserInfo(Schema):
    id: str
    email: str
    displayName: str = None
    gender: str = None
    address: str = None
    age: int = None
    createdAt: str
    updatedAt: str


class UserInfoResponse(Schema):
    user: UserInfo


class UserCreatePayload(Schema):
    email: str
    displayName: str = None
    gender: str = None
    address: str = None
    age: int = None


class UserUpdatePayload(Schema):
    displayName: str = None
    gender: str = None
    address: str = None
    age: int = None


class DeleteResponse(Schema):
    message: str
    deletedRows: int


class ErrorDetailResponse(Schema):
    httpCode: int
    isOperational: bool
    name: str


class ErrorResponse(Schema):
    error: ErrorDetailResponse
    message: str
