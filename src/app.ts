import * as http from 'http';
import {Router, Routes} from './Router';
import {parsePathExpress} from './utils';

export interface RoutesExpress {
    [path: string]: Routes;
}

class ExpressClone {
  routes: RoutesExpress;
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

  private handlerRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const {url, method} = req;
    const [mainPath, routePath] = parsePathExpress(url);

    if (mainPath && routePath && method) {
      const routes = this.routes[mainPath][method!];

      const matchedRoute = Object.keys(routes).find((pathString) => {
        const routeRegExp = new RegExp(pathString);
        return routeRegExp.test(routePath!);
      });

      if (matchedRoute) {
        routes[matchedRoute](req, res);
      } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'This endpoint does not exist!'}));
      }
    }
  }
}

export default ExpressClone;