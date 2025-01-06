const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const log = require('./models/log');
const hello = require('./models/hello');
const pageRoutes = require('./routes/pageRoute');
const userRoutes = require('./routes/userRoute');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

// MW
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route  
app.use('/', pageRoutes);
app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  log(`RUNNING SERVER: http://localhost:${PORT}/`);
  hello("LKLJ");
});