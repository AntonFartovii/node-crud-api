import ExpressClone from './src/app';
import userRouter from './src/router/userRouter';
import 'dotenv/config';

const PORT = Number(process.env.PORT) || 4000;
const app = new ExpressClone();

app.useRouter('/api', userRouter);

app.listen(PORT, () => {
  console.log(`Server PORT ${PORT} is running!`);
});
