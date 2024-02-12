import * as http from 'http';
import {Router, Routes} from './Router';
import {parsePathExpress} from './utils';
import {HttpError} from '../exeptions';

export interface RoutesServer {
    [path: string]: Routes;
}

const headers = {'Content-Type': 'application/json'};

class Server {
  routes: RoutesServer;
  private server: http.Server;

  constructor() {
    this.server = http.createServer();
    this.routes = {};
  }

  public listen(port: number, cb?: () => void): void {
    this.server.listen(port, cb);
  }

  public useRouter(path: string, router: Router) {
    this.routes = {...this.routes, [path]: router.routes};
    this.server.on('request', this.handlerRequest.bind(this));
  }

  private async handlerRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const {url, method} = req;
    const [mainPath, routePath] = parsePathExpress(url);
    try {
      if (mainPath && routePath && method) {
        const routes = this.routes[mainPath] && this.routes[mainPath][method!];

        if (routes) {
          const matchedRoute = Object.keys(routes).find((pathString) => {
            const routeRegExp = new RegExp(pathString);
            return routeRegExp.test(routePath!);
          });
          if (matchedRoute) {
            await routes[matchedRoute](req, res);
          } else {
            throw new HttpError(404, 'This endpoint does not exist!');
          }
        } else {
          throw new HttpError(404, 'This endpoint does not exist!');
        }
      } else {
        throw new HttpError(404, 'This endpoint does not exist!');
      }
    } catch (error) {
      if (error instanceof HttpError) {
        res.writeHead(error.statusCode, headers);
        res.end(JSON.stringify(error.getData()));
      } else {
        res.writeHead(404, headers);
        res.end(JSON.stringify({error: 'This endpoint does not exist!'}));
      }
    }
  }
}

export default Server;
