const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Seong-A:tjddk2514@seeing-a.xulub9e.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World! 하욤'));

app.listen(port, () => console.log(`Example app listening on port ${port}`));
