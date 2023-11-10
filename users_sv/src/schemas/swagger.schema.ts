export default {
    openapi: "3.0.0",
    info: {
        title: "Node.js server",
        version: "v1.0",
    },
    servers: [
        {
            url: "/api",
            description: "Localhost server",
        },
    ],
    tags: [
        {
            name: "USER",
            description: "CRUD endpoints related to User",
        },
    ],
    paths: {
        "/users": {
            get: {
                tags: ["USER"],
                summary: "Retrieve all users - with pagination.",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        description: "Page number for pagination (optional).",
                        schema: {
                            type: "integer",
                            minimum: 1,
                            example: 1,
                        },
                    },
                    {
                        name: "perPage",
                        in: "query",
                        description: "Number of items per page (optional).",
                        schema: {
                            type: "integer",
                            minimum: 1,
                            example: 10,
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Return all users",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {
                                        users: [
                                            {
                                                id: "449819ea-dd6b-48dd-9ba9-7ea347c3ef70",
                                                createdAt:
                                                    "2023-11-08T17:31:31.000Z",
                                                updatedAt:
                                                    "2023-11-08T17:31:31.000Z",
                                                email: "jackson@gmail.com",
                                                displayName: "Nicholas Jackson",
                                                gender: "nonDisclosure",
                                                address: "Can Tho city",
                                                age: null,
                                            },
                                            {
                                                id: "75217059-4aa6-445a-bb99-d7bbdaf6b1b7",
                                                createdAt:
                                                    "2023-11-08T16:35:25.000Z",
                                                updatedAt:
                                                    "2023-11-08T17:27:24.000Z",
                                                email: "admin@gmail.com",
                                                displayName: "admin",
                                                gender: "nonDisclosure",
                                                address: null,
                                                age: null,
                                            },
                                            {
                                                id: "a93f246d-4d64-49de-aade-206077610de2",
                                                createdAt:
                                                    "2023-11-08T16:01:08.000Z",
                                                updatedAt:
                                                    "2023-11-08T17:31:12.000Z",
                                                email: "quocbao@gmail.com",
                                                displayName: "NHQB",
                                                gender: "male",
                                                address: "Chicago",
                                                age: 20,
                                            },
                                        ],
                                        total: 3,
                                        page: 1,
                                        perPage: 10,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["USER"],
                summary: "Store info of a new user.",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                example: {
                                    email: "ana@gmail.com",
                                    address: "Can Tho city",
                                    displayName: "Ana",
                                    gender: "female",
                                },
                            },
                        },
                    },
                    required: true,
                },
                responses: {
                    "201": {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {
                                        user: {
                                            email: "ana@gmail.com",
                                            displayName: "Ana",
                                            gender: "female",
                                            address: "Can Tho city",
                                            id: "c922832b-9058-4c67-bda0-09465a36d5da",
                                            createdAt:
                                                "2023-11-08T17:32:21.000Z",
                                            updatedAt:
                                                "2023-11-08T17:32:21.000Z",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/users/{userId}": {
            get: {
                tags: ["USER"],
                summary: "Retrieve users by his/her id.",
                parameters: [
                    {
                        name: "userId",
                        in: "path",
                        description: "Id of an user",
                        require: true,
                    },
                ],
                responses: {
                    "200": {
                        description: "Return all users",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {
                                        user: {
                                            id: "449819ea-dd6b-48dd-9ba9-7ea347c3ef70",
                                            createdAt:
                                                "2023-11-08T17:31:31.000Z",
                                            updatedAt:
                                                "2023-11-08T17:31:31.000Z",
                                            email: "jackson@gmail.com",
                                            displayName: "Nicholas Jackson",
                                            gender: "nonDisclosure",
                                            address: "Can Tho city",
                                            age: null,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            patch: {
                tags: ["USER"],
                summary: "Update info of an existed user.",
                parameters: [
                    {
                        name: "userId",
                        in: "path",
                        description: "Id of an user",
                        require: true,
                    },
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                example: {
                                    address: "New York city",
                                    displayName: "New Ana",
                                    gender: "female",
                                },
                            },
                        },
                    },
                    required: true,
                },
                responses: {
                    "200": {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {
                                        user: {
                                            email: "ana@gmail.com",
                                            displayName: "Ana",
                                            gender: "female",
                                            address: "Can Tho city",
                                            id: "c922832b-9058-4c67-bda0-09465a36d5da",
                                            createdAt:
                                                "2023-11-08T17:32:21.000Z",
                                            updatedAt:
                                                "2023-11-08T17:32:21.000Z",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["USER"],
                summary: "Delete an user.",
                parameters: [
                    {
                        name: "userId",
                        in: "path",
                        description: "Id of an user",
                        require: true,
                    },
                ],
                responses: {
                    "200": {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {
                                        message: "Delete successfully",
                                        deletedRows: 1,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/users/email/{email}": {
            get: {
                tags: ["USER"],
                summary: "Retrieve users by his/her email.",
                parameters: [
                    {
                        name: "email",
                        in: "path",
                        description: "Email of an user",
                        require: true,
                    },
                ],
                responses: {
                    "200": {
                        description: "Return the user info",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {
                                        user: {
                                            id: "449819ea-dd6b-48dd-9ba9-7ea347c3ef70",
                                            createdAt:
                                                "2023-11-08T17:31:31.000Z",
                                            updatedAt:
                                                "2023-11-08T17:31:31.000Z",
                                            email: "jackson@gmail.com",
                                            displayName: "Nicholas Jackson",
                                            gender: "nonDisclosure",
                                            address: "Can Tho city",
                                            age: null,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
