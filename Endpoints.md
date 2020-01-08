Endpoints:
BaseURL:
https://bestfarm.herokuapp.com/api/

- ### users
    | Path              | Type   | Deployed | Auth     | Body               | Description                   |
    | ----------------- |:------:|:--------:|:--------:|:------------------:| ----------------------------- |
    | /auth/register    | POST   |     True | None     | User               | Create new user               |
    | /auth/login       | POST   |     True | None     | username, password | Log in, get token             |
    | /users/:id        | GET    |     True | Required | None               | Get user by ID                |
    | /users/user       | GET    |     True | Required | None               | Get user by token             |
    | /users/user       | PUT    |     True | Required | User, password     | Update user by id in req.body |
    | /users/user       | DELETE |     True | Required | password           | Delete user by id in req.body |
    | /users/user/all   | GET    |     True | Required | None               | Debug only, return all users  |
    
- ### farms
    | Path              | Type   | Deployed | Auth     | Body               | Description                   |
    | ----------------- |:------:|:--------:|:--------:|:------------------:| ----------------------------- |
    | /farms/all        | GET    |     True | Required | None               | Get all farms                 |

    create
    read
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