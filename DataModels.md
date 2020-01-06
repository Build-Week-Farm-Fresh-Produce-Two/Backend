<!-- | Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown. -->
## users
| Variable      | Type           | Required |
| ------------- |:--------------:| --------:|
| id            | Auto-generated |     True |
| farmID        | Integer        |     True |
| isFarmer      | Boolean        |     True |
| email         | String         |     True |
| username      | String         |     True |
| password      | String         |     True |
| name          | String         |     True |
| zipCode       | Integer        |     True |
| addressStreet | String         |    False |
| addressCity   | String         |    False |
| addressState  | String         |    False |
>farmID optional, required if isFarmer true. There will be a get all farms endpoint where you will get this data from.
>zipCode: 5 digits

## farms
| Variable      | Type           | Required |
| ------------- |:--------------:| --------:|
| id            | Auto-generated |     True |
| ownerUserID   | Integer        |     True |
| name          | String         |     True |
| addressStreet | String         |     True |
| addressCity   | String         |     True |
| addressState  | String         |     True |
| zipCode       | Integer        |     True |
>zipCode: 5 digits

## products
| Variable      | Type           | Required |
| ------------- |:--------------:| --------:|
| id            | Auto-generated |     True |
| name          | String         |     True |
| description   | String         |     True |
| imageURL      | String         |    False |
>imageURL optional- I'll give you an endpoint and frontend code for uploading images with Cloudinary

## supply
| Variable        | Type           | Required |
| --------------- |:--------------:| --------:|
| id              | Auto-generated |     True |
| farmID          | Integer        |     True |
| productID       | Integer        |     True |
| measurementType | String         |     True |
| quantity        | Integer        |     True |
| price           | Integer        |     True |
>price is per unit of measurement

## orders
| Variable          | Type           | Required |
| ----------------- |:--------------:| --------:|
| id                | Auto-generated |     True |
| farmID            | Integer        |     True |
| customerID        | Integer        |     True |
| totalPrice        | Integer        |     True |
| paymentStatus     | Boolean        |     True |
| fulfillmentStatus | Boolean        |     True |

## orderedProducts
| Variable      | Type           | Required |
| ------------- |:--------------:| --------:|
| orderID       | Integer        |     True |
| productID     | Integer        |     True |