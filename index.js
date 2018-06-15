const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin: '*'}));


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(PORT, () => {
   console.log('listen: ' + PORT);
});