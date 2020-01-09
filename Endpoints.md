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

    update called on order, check quantities
    delete- remove product supply from farm
- ### orders
    | Path              | Type   | Deployed | Auth     | Body | Description |
    | ----------------- |:------:|:--------:|:--------:|:----:| ----------- |

    c
    r
    u
    d

    orders by farm- must be employee of farm
    orders by user- must be user
    orders by user by farm- all orders from customer, must be employee of farm