let express = require('express');
let app = express();
//let bodyParser = require('body-parser'); 
//app.use(bodyParser.json());
//If you are using Express 4.17 or greater, instead of the "body-parser" module, you can adding the following lines of code：（取消上面的2行代码）
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//DB initial code
let Datastore = require('nedb');
let db = new Datastore('thing.db');
db.loadDatabase();


let thingsTracker = [];

//app.get('/',(request, response)=> {
//   response.send('this is the main page');
//})

//add a route on server, that is listening for a post request
app.post('/noThings', (request, response) => {
    let currentDate = Date();
    let mydate = new Date();
    let year = mydate.getFullYear();
    let month = mydate.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let day = mydate.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    let datea = year + "-" + month + "-" + day;
    let obj = {
        date: currentDate,
        datea: datea,
        task: request.body.tasktask
    }
    console.log(obj);
    //insert task  data into the database
    db.insert(obj, (err, newDocs) => {
        if (err) {
            response.json({ task: "task failed" });
        } else {
            response.json({ task: "success" });
        }

    })
})

//modify task
app.post("/update", (request, response) => {
    console.log("revised",request.body._id,request.body.tasktask)
    db.update({ _id: request.body._id }, { $set: { task: request.body.tasktask } }, { multi: true }, function (err, numReplaced) {
 
        response.json({ task: "task failed" });
      });
})

//serve the static files in public
app.use('/', express.static('public'));


//add route to get all track information
app.get('/getThings', (request, response) => {
    db.find({}, (err, docs) => {
        if (err) {
            response.json({ task: "task failed" })
        } else {
            let obj = { data: docs };
            response.json(obj);
        }

    })

})

//listen at port 3000
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening at ', port);
})