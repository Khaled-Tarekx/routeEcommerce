import 'dotenv/config';
import express from 'express';
import bootstrap from './src/setup/bootstrap.js';
import { connection } from './database/connection.js';

const app = express();
await connection;

const port = process.env.PORT || 3000;
app.use(express.static('./uploads'));

app.get('/', (req, res) => res.send('Hello World!'));

bootstrap(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
