let express = require('express');

let app = express();

app.use(express.static(__dirname));
app.listen(4001);
console.log('Page up at localhost:4001');

app.post('localhost:4000', (req, res) => {
    res.send('post'); //make a graphql query
})