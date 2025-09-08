const app = require("./src/app");
const mongoose = require("mongoose");

require('dotenv').config();

const port = process.env.PORT;

(async() => {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongodb connected!");
})();

app.get('/', (req, res) => {
    if (req.header('Authorization').split(' ')[1]) {
        console.log(`headers => ${req.header('Authorization').split(' ')[1]}`);
        res.send("Welcome to the API!");
    } else {
        console.log(`headers => ${req.header('Authorization')}`);
        res.send("Welcome to the API!");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});