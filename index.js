const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const request = require('request');
const _ = require('lodash');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin: '*'}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post("/", function (req, res) {
    processMix(req.body.actions, 0, {}, response => {
        res.send(response);
    });
});

app.listen(PORT, () => {
   console.log('listen: ' + PORT);
});

function processMix(actions, index, input, callback) {
    if(index >= actions.length) {
        callback(input);
    } else {
        processAction(actions[index], input, result => {
            processMix(actions, index+1, result, callback);
        });
    }
}

function processAction(action, input, callback) {
    const [ type ] = action;
    if (type)

    switch(type) {
        case "loadUrl":
            request(
                { url: action[1], json: true},
                (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        callback(body);
                    }
                }
            );
            break;
        case "pluck":
        case "arrayColumn":
            const prop = action[1];
            callback(Object.keys(input).map(k => input[k][prop]));
            break;
        case "get":
            const path = action[1].split("/");
            let node = input;
            path.forEach(p => {
                node = node[p] || node;
            });
            callback(node);
            break;
        case "keys":
            callback(Object.keys(input));
            break;
    }
}