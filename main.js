import 'dotenv/config';
import express from 'express';
import bootstrap from './src/setup/bootstrap.js';
import { connection } from './database/connection.js';

const app = express();
const port = process.env.PORT;
connection
	.then(() => console.log('connented to db successfully'))
	.catch(() => console.log('connection to db didnt work'));

await bootstrap(app);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
