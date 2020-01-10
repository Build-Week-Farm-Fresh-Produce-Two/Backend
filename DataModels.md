<!-- | Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown. -->
## farms
| Variable      | Type           | Required |
| ------------- |:--------------:| --------:|
| id            | Auto-generated |     True |
| name          | String         |     True |
| addressStreet | String         |     True |
| addressCity   | String         |     True |
| addressState  | String         |     True |
| zipCode       | Integer        |     True |
>zipCode: Must be a string containing only 5 numbers

## users
| Variable      | Type           | Required |
| ------------- |:--------------:| --------:|
| id            | Auto-generated |     True |
| farmID        | Integer (FKEY) |    False |
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

## farmOwner
| Variable      | Type           | Required |
| ------------- |:--------------:| --------:|
| farmID        | Integer (FKEY) |     True |
| ownerID       | Integer (FKEY) |    False |
>The ownerID allows null in case owner user is deleted, but should be considered required.

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
| farmID          | Integer (FKEY) |     True |
| productID       | Integer (FKEY) |     True |
| measurementType | String         |     True |
| quantity        | Integer        |     True |
| price           | Decimal        |     True |
>price is per unit of measurement

## orders
| Variable          | Type           | Required |
| ----------------- |:--------------:| --------:|
| id                | Auto-generated |     True |
| farmID            | Integer (FKEY) |    False |
| customerID        | Integer (FKEY) |    False |
| farmName          | String         |     True |
| customerName      | String         |     True |
| totalPrice        | Decimal        |     True |
| paymentStatus     | Boolean        |     True |
| fulfillmentStatus | Boolean        |     True |
>The two fkeys allow null in case either thing is deleted, but should be considered required.

>Farm/Customer name is required and separate from other tables to protect order records from updates and deletes to other records.

## orderedProducts
| Variable                 | Type           | Required |
| ------------------------ |:--------------:| --------:|
| orderID                  | Integer (FKEY) |     True |
| supplyID                 | Integer (FKEY) |    False |
| productName              | String         |     True |
| productDescription       | String         |     True |
| productImageURL          | String         |    False |
| purchasedMeasurementType | String         |     True |
| purchasedQuantity        | Integer        |     True |
| purchasedPrice           | Decimal        |     True |
>The supplyID allows null in case owner supply is deleted, but should be considered required.

>Product/Purchased info is required and separate from product tables to protect order records from updates and deletes to product records.