//API ref: https://api.ghn.vn/home/docs/detail?id=63

const hostname = "dev-online-gateway.ghn.vn";
const token = process.env.GHN_TOKEN;
const shopID = process.env.GHN_SHOPID;


exports.shipment = (request, response) => {    
    //Chame item list structure
    console.log(request.body);
    var itemList = request.body.itemList;
    itemList.map((entry) => {
            entry.quantity = entry.amount;
            delete entry.amount;
            
            if (entry.size === "large") {
                entry.weight = 200;
            }
            else {
                entry.weight = 100;
            }
            delete entry.size;
        }
    )
    
    console.log(itemList);
    
    createShipment(
    request.body.name, request.body.phone,
    request.body.address, request.body.ward , request.body.dist,
    2000, 20, 20, 20,
    itemList
    )
}

const createShipment = (
        //Customer contact
        name, phone,
        //Address
        address, wardCode, distId,
        //Parcel info, unit: cm and gram
        weight, length, width, height,
        //List of all items
        itemList
    ) => {
    const endpoint = "/shiip/public-api/v2/shipping-order/create";
    
    const https = require("https");
    const options = {
      hostname: hostname,
      port: 443,
      path: endpoint,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ShopId": shopID,
        "Token": token
      },
    };
    
    const req = https.request(options, (res) => {
      res.setEncoding("utf8");
      res.on("data", (body) => {
          // console.log(JSON.parse(body));
        console.log('Response: ' + body)
      });
      res.on("end", () => {
        console.log("No more data in response.");
      });
      req.on("error", (e) => {
        console.log(`problem with request: ${e.message}`);
        });
    });
    
    
    
    const requestBody = JSON.stringify({
      to_name: name,
      to_phone: phone,
      to_address: address,
      to_ward_code: wardCode,
      to_district_id: distId,
      weight: weight,
      length: length, 
      width: width,
      height: height,
      service_type_id: 2, //Standard delivery
      payment_type_id: 1,  //Shipping fee paid by shop
      required_note: "KHONGCHOXEMHANG",
      items: itemList
    });
    
    // write data to request body
    req.write(requestBody);
    req.end();
}
