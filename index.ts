import 'dotenv/config';
import {ExpressClone} from './src/app';

const PORT = Number(process.env.PORT) || 4000;
const app = new ExpressClone();

app.listen(PORT, () => {
  console.log(`Server PORT ${PORT} is running!`);
});
