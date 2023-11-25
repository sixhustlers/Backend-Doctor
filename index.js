const express = require('express');
const app = express();
require('dotenv').config();
const routes= require('./routes/apiRoutes');
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', routes);





app.listen(port, () => {
    console.log('Server is running at port ' + port);
});