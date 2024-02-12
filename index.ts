import Server from './src/core/Server';
import userRouter from './src/router/userRouter';
import 'dotenv/config';
import {cpus} from 'node:os';
import cluster, {Worker} from 'cluster';
import process from 'node:process';
import {createServer as createHttpServer, request as httpRequest} from 'http';

export const countCPUs = cpus().length;
export const PORT = Number(process.env.PORT) || 4000;
const host = process.env.HOST;
const app = new Server();
app.useRouter('/api', userRouter);


let requestIteration = 0;
const getNextPor = (startPort: number): number => {
  requestIteration = requestIteration === countCPUs ? 1 : requestIteration + 1;
  return startPort + requestIteration;
};

if (cluster.isPrimary) {
  const workers: Worker[] = [];

  for (let i = 1; i <= countCPUs; i++) {
    const childWorker = cluster.fork({HOST: host, PORT: PORT + i});

    workers.push(childWorker);
    childWorker.on('message', (data) => {
      workers.forEach((worker) => worker.send(data));
    });
  }

  cluster.on('exit', (worker, code) => {
    console.log(`Worker ${worker.id} finished. Exit code: ${code}`);
  });

  let i = 1;
  const server = createHttpServer(async (request, response) => {
    const nextPort = getNextPor(PORT);

    console.log(`Request to proxy port ${nextPort}`);
    const options = {
      hostname: host,
      port: PORT + i,
      path: request.url,
      method: request.method,
      headers: request.headers,
    };
    console.log(options);
    const requestToCP = httpRequest(options, (responseFromCP) => {
      response.statusCode = responseFromCP.statusCode || 500;
      responseFromCP.on('data', chunk => {
        response.write(chunk);
      });
      responseFromCP.on('end', () => {
        response.end();
      });
    });

    request.on('data', chunk => {
      requestToCP.write(chunk);
    });
    request.on('end', () => {
      requestToCP.end();
    });

    i === countCPUs ? i = 1 : i++;
  });

  server.listen(PORT, host, () => {
    console.log(`Multi server is running at http://${host}:${PORT}/`);
  });

} else {
  app.listen(PORT, () => {
    console.log(`Server PORT ${PORT} is running!`);
  });
}