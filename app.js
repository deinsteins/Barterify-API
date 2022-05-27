const express = require('express');
const cors = require('cors');

const app = express();


const corsOptions = {
    origin: 'http://localhost:3000',
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Barterify REST API'
    })
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
