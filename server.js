const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const log = require('./models/log');
const hello = require('./models/hello');
const pageRoutes = require('./routes/pageRoute');
const userRoutes = require('./routes/userRoute');
const dataRoutes = require('./routes/dataRoute');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', pageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  log(`RUNNING SERVER: http://localhost:${PORT}/`);
  hello("LKLJ");
});
