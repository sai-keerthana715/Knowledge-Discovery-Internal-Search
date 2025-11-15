
const express = require('express');
const cors = require('cors');
const app = express();
const uploadRoute = require('./routes/upload');
const searchRoute = require('./routes/search');

app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRoute);
app.use('/api/search', searchRoute);

app.listen(4000, () => {
  console.log('Server running at http://localhost:4000');
});
