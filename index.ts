import * as http from 'http';
import 'dotenv/config';
import {ExpressClone} from './src/app';

const PORT = Number(process.env.PORT) || 4000;
const app = new ExpressClone();

function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  const {url, method} = req;
  console.log(method, ' ', url);
}


app.on('request', handleRequest);
app.listen(PORT, () => {
  console.log(`Server PORT ${PORT} is running!`);
});
