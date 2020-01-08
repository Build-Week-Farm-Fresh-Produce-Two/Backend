Endpoints:
BaseURL:
https://bestfarm.herokuapp.com/api/

- ### users
    | Path              | Type   | Deployed | Auth (JWT) | Body               | Description                   |
    | ----------------- |:------:|:--------:|:----------:|:------------------:| ----------------------------- |
    | /auth/register    | POST   |     True | None       | User               | Create new user               |
    | /auth/login       | POST   |     True | None       | username, password | Log in, get token             |
    | /users/:id        | GET    |     True | Required   | None               | Get user by param ID          |
    | /users/user       | GET    |     True | Required   | None               | Get user by token             |
    | /users/user       | PUT    |     True | Required   | User, password     | Update user by token          |
    | /users/user       | DELETE |     True | Required   | password           | Delete user by token          |
    | /users/user/all   | GET    |     True | Required   | None               | Debug only, return all users  |
    
- ### farms
    | Path              | Type   | Deployed | Auth (JWT) | Body               | Description                     |
    | ----------------- |:------:|:--------:|:---------: |:------------------:| -------------------------------------------------- |
    | /farms/           | POST   |  testing | Required   | None               | Create new farm. Owner by token |
    | /farms/           | GET    |     True | Required   | None               | Get all farms                   |
    | /farms/owners     | GET    |     True | Required   | None               | Get all owners, for debugging and will be disabled |
    | /farms/:id        | GET    |     True | Required   | None               | Get farm by param ID            |
    | /farms/:id/owner  | GET    |     True | Required   | None               | Get owner by farm ID            |
    | /farms/farm       | GET    |     True | Required   | None               | Get farm by token               |

    create
    delete -> delete owner row
    update
    update owner
- ### products
    | Path              | Type   | Deployed | Auth     | Body | Description |
    | ----------------- |:------:|:--------:|:--------:|:----:| ----------- |
- ### supply
    | Path              | Type   | Deployed | Auth     | Body | Description |
    | ----------------- |:------:|:--------:|:--------:|:----:| ----------- |

    create
    get by farm
    get by product name/id
- ### orders
    | Path              | Type   | Deployed | Auth     | Body | Description |
    | ----------------- |:------:|:--------:|:--------:|:----:| ----------- |

    orders by farm- must be employee of farm
    orders by user- must be user
    orders by user by farm- all orders from customer, must be employee of farm