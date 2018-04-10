const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/', function (req, res) {
    console.log('---req body--');
    console.log(req.body);
    res.send('notify received');
});

app.listen(8888, function () {
  console.log('Example app listening on port 8888!')
});
