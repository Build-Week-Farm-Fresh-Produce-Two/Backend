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
    #### Future:
    >Require authorization from owner of farm to be able to join as an employee

    >Validate address/zip code
    
- ### farms
    | Path              | Type   | Deployed | Auth (JWT) | Body           | Description                                       |
    | ----------------- |:------:|:--------:|:---------: |:--------------:| ------------------------------------------------- |
    | /farms/           | POST   |     True | Required   | None           | Create new farm. Owner by token                   |
    | /farms/           | GET    |     True | Required   | None           | Get all farms                                     |
    | /farms/owners     | GET    |     True | Required   | None           | Get all owners, for debugging and may be disabled |
    | /farms/farm       | GET    |     True | Required   | None           | Get farm by token                                 |
    | /farms/:id        | GET    |     True | Required   | None           | Get farm by param ID                              |
    | /farms/:id/owner  | GET    |     True | Required   | None           | Get owner by farm ID                              |
    | /farms/:id        | PUT    |     True | Required   | Farm, password | Update farm by id- user must be owner of farm.    |
    | /farms/:id        | DELETE |     True | Required   | password       | Delete farm by id- user must be owner of farm.    |
    >Deleting farm also deletes the farmOwner table row

    >Owner can be updated with /farms/:id if newOwnerID is included.

    #### Future:
    >Validate address/zip code

- ### products
    | Path                 | Type   | Deployed | Auth (JWT) | Body     | Description                        |
    | -------------------- |:------:|:--------:|:---------: |:--------:| ---------------------------------- |
    | /products/           | POST   |     True | Required   | Product  | Create new product                 |
    | /products/           | GET    |     True | Required   | None     | Get all products                   |
    | /products/id/:id     | GET    |     True | Required   | None     | Get product by param ID            |
    | /products/name/:name | GET    |     True | Required   | None     | Search/get products by param name  |
    | /products/desc/:desc | GET    |     True | Required   | None     | Search/get products by param desc  |
    #### Update/Delete: disabled. 
    >If products can be sold by different farms they shouldn't be allowed to be updated by anyone. If a change needs to be made create a new product. 

    #### Future:
    >List of global products managed by us for all farms to use, then farms can create custom products tied to their farm that they can control fully.

- ### supply
    | Path                 | Type   | Deployed | Auth (JWT) | Body     | Description                        |
    | -------------------- |:------:|:--------:|:---------: |:--------:| ---------------------------------- |
    | /supply/             | POST   |     True | Required   | Supply   | Create new supply                  |
    | /supply/             | GET    |     True | Required   | None     | Get all supplies                   |
    | /supply/farm/        | GET    |     True | Required   | None     | Get supply by farm by token        |
    | /supply/farm/:id     | GET    |     True | Required   | None     | Get supply by farm by ID           |
    | /supply/product/:id  | GET    |     True | Required   | None     | Get farms and supply by product ID |
    | /supply/:id          | PUT    |     True | Required   | Supply   | Update supply by supply ID.        |
    | /supply/:id          | DELETE |     True | Required   | password | Delete supply by supply ID.        |

- ### orders
    | Path                 | Type   | Deployed | Auth (JWT) | Body                     | Description                          |
    | -------------------- |:------:|:--------:|:---------: |:------------------------:| ------------------------------------ |
    | /orders/             | POST   |    false | Required   | Order, OrderedProducts[] | Create new order                     |
    | /orders/             | GET    |     True | Required   | None                     | Get all orders (debug only, remove)  |
    | /orders/farm/        | GET    |    false | Required   | None                     | Get order by farm by token           |
    | /orders/user/        | GET    |    false | Required   | None                     | Get order by user by token           |
    | /orders/user/farm    | GET    |    false | Required   | None                     | Get order by user and farm by params |
    | /orders/:id          | PUT    |    false | Required   | Order, OrderedProducts[] | Update supply by supply ID.          |
    | /orders/:id          | DELETE |    false | Required   | password                 | Delete supply by supply ID.          |

    create- loop through product in req.body, test for bad entries and then add to OP table (after creating order) use a transaction so if one fails nothing is added

    read- 
    get all orders, debug only
    getbyorderid(user is employee or customer), 
    getbycustomerid(token, user is customer only), 
    getbyfarmid(token)(user is employee), 
    getbyfarmid(token) and customer id(user === customer or farm employee)
    
    update- only allowed by employee for like if something was refunded.. maybe add this in future

    delete by orderid, delete all orderid rows in OP

    orders by farm- must be employee of farm
    orders by user- must be user
    orders by user by farm- all orders from customer, must be employee of farm