import { createServer as createHttpServer, request as httpRequest } from 'http';
import { countCPUs, PORT } from '../../index';
import process from 'node:process';

const host = process.env.HOST;

export class Balancer {
  requestIteration: number;
  startPort: number;
  i: number;

  constructor(startPort: number) {
    this.requestIteration = 1;
    this.startPort = startPort;
    this.i = 1;
  }

  getNextPort(startPort: number) {
    this.requestIteration = this.requestIteration === countCPUs ? 1 : this.requestIteration + 1;
    return startPort + this.requestIteration;
  }

  start() {
    const server = createHttpServer(async (request, response) => {
      const nextPort = this.getNextPort(PORT);

      console.log(`Request to proxy port ${nextPort}`);
      const options = {
        hostname: host,
        port: PORT + this.i,
        path: request.url,
        method: request.method,
        headers: request.headers,
      };

      const requestToCP = httpRequest(options, (responseFromCP) => {
        response.statusCode = responseFromCP.statusCode || 500;
        response.setHeader('Content-Type', 'application/json');
        let body = '';
        responseFromCP.on('data', (chunk) => {
          body += chunk.toString();
          response.write(chunk);
        });
        responseFromCP.on('end', () => {
          response.end();
        });
      });

      request.on('data', (chunk) => {
        requestToCP.write(chunk);
      });
      request.on('end', () => {
        requestToCP.end();
      });

      this.i === countCPUs ? (this.i = 1) : this.i++;
    });

    server.listen(PORT, host, () => {
      console.log(`Multi server is running at http://${host}:${PORT}/`);
    });
  }
}
