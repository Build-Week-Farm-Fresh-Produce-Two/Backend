- [] -zip code is getting converted from 00000 to 0, 00010 to 10. this will cause issues down the line
- [] -farmID optional, required if isFarmer true. There will be a get all farms endpoint where you will get this data from.
>check user post/update to make sure this has an error set up, don't think it currently does

products post isFarmer check

supply C/U/D isEmployee check

post order orderedProducts check supplyid exists and its farm matches the farm being bought from and also check the quantity

#### Future problems: 
users currently cannot belong to multiple farms