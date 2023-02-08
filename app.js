const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
  const firstName = req.body.fName
  const lastName = req.body.lName
  const emails = req.body.email

  const data = {                                      //1.  Create data to send it to the Mailchimp.
    members: [
      {
        email_address: emails,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data)                                      //2. convert our data into json format.

  const url = "https://us21.api.mailchimp.com/3.0/lists/6fbdcb1cce"          //4. Set mailchimp user and list id.

  const options = {                                                           //5. Set options( set api key also .)
    method: "POST",           
    auth: "Pawan1:6c1b88796e2217c388e01bc4c18c52f8-us21"

  }

  const request = https.request(url, options, function(response){               //3.  Make a http post request.
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")                                 //7. Set success & failure Page.
    } else  {
      res.sendFile(__dirname + "/failure.html")
    }
    
    response.on("data", function(data){
      console.log(JSON.parse(data))
    })
  })

  request.write(jsonData)                                             //6. Send the data to mailchimp with these line.
  request.end()
})

app.post("/failure", function(req, res){                          //9. set redirect location on buttons
  res.redirect("/")
})

app.post("/success", function(req, res){
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running")
});







