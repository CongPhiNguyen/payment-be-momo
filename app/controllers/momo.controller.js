//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters

exports.payment = (request, response) => {
  var partnerCode = "MOMOFSER20220515"
  var accessKey = "8RpXu2kJUxba68SN"
  var secretKey = "x6BJFWPvmOaO2izlHue6pMpO0900LwlM"
  var requestId = partnerCode + new Date().getTime()
  var orderId = requestId
  var orderInfo = "pay with MoMo"
  var redirectUrl = "https://scan-desktop.netlify.app"
  var ipnUrl = "https://callback.url/notify"
  var requestType = "captureWallet"
  var extraData = "" //pass empty value if your merchant does not have stores
  var amount = request.body.amount

  //before sign HMAC SHA256 with format
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType

  //signature
  const crypto = require("crypto")
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex")
  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "en"
  })

  console.log(requestBody)

  //Create the HTTPS objects
  const https = require("https")
  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody)
    }
  }

  //Send the request and get the response
  const req = https.request(options, (res) => {
    res.setEncoding("utf8")
    res.on("data", (body) => {
      // console.log(JSON.parse(body));
      console.log("body", body)
      response.send(JSON.parse(body).payUrl)
    })
    res.on("end", () => {
      console.log("No more data in response.")
    })
  })

  req.on("error", (e) => {
    console.log(`problem with request: ${e.message}`)
  })

  // write data to request body
  console.log("Sending....")
  req.write(requestBody)
  req.end()
}
