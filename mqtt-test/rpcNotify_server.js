const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/notify_test', function (req, res) {
    console.log("%j", req.body);
    res.send('notify received');
});

app.listen(9000, function () {
  console.log('Example app listening on port 9000!')
});
