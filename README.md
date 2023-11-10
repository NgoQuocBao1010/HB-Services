# SERVERS GUIDE

## Requirements

-   Docker

## Setup

1. Create an `.env` file in the `./users_sv` folder. You can use the provided [./users_sv/.env.example](./users_sv/.env.example) as a template.

2. Run Docker Compose.

```bash
docker-compose up -d
```

This will create two containers:

-   `django_sv` running Django on port 8000
-   `nodejs_sv` running Node.js on port 9000

## Usage

-   Access Django Swagger Docs: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
-   Access Node Swagger Docs: [http://localhost:9000/api/docs](http://localhost:9000/api/docs)

Optional:

-   Load default `Products` into Django:

```bash
docker exec -it django_sv python manage.py loaddata default_products.json
```

-   Create a superuser for Django:

```bash
docker exec -it django_sv python manage.py createsuperuser
```

-   Access Django Admin: [http://localhost:8000/admin](http://localhost:8000/admin)

Sign in with the superuser credentials to perform CRUD operations on "Products".
