import Server from './src/core/Server';
import userRouter from './src/router/userRouter';
import 'dotenv/config';
import { cpus } from 'node:os';
import cluster, { Worker } from 'cluster';
import process from 'node:process';
import { Balancer } from './src/core/Balancer';

const isMultiMode = process.argv.includes('--multi');

export const countCPUs = cpus().length;
export const PORT = Number(process.env.PORT);
const host = process.env.HOST;
const app = new Server();
app.useRouter('/api', userRouter);

if (isMultiMode && cluster.isPrimary) {
  const workers: Worker[] = [];

  for (let i = 1; i <= countCPUs; i++) {
    const childWorker = cluster.fork({ HOST: host, PORT: PORT + i });

    workers.push(childWorker);
    childWorker.on('message', (data) => {
      workers.forEach((worker) => worker.send(data));
    });
  }

  cluster.on('exit', (worker, code) => {
    console.log(`Worker ${worker.id} died. Exit code: ${code}`);
  });

  const balancer = new Balancer(PORT);
  balancer.start();
} else {
  app.listen(PORT, () => {
    console.log(`Server PORT ${PORT} is running!`);
  });
}
