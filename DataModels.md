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
| username      | String         |     True |
| password      | String         |     True |
| name          | String         |     True |
| zip code(5)   | Integer        |     True |
| address       | String         |    False |
>farmID optional, required if isFarmer true. There will be a get all farms endpoint where you will get this data from.

## farms
id
ownerUserID required
name required
address required
5 digit zip code required

## products
id
name required
description required
imageURL optional

## supply
farmID required
productID required
string measurement type (pounds, ounces, etc) required
int quantity required
int price required

## orders
id
int farmID required
int customerID required
int total price required
bool paymentStatus required
bool fulfillmentStatus required 

## orderedProducts
orderID required
productID required
