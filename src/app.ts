import * as http from 'http';
import {RequestListener} from 'http';
import {Router, Routes} from './Router';

export interface RoutesExpress {
    [path: string]: Routes;
}

export class ExpressClone {
  routes: RoutesExpress;
  private server: http.Server;

  constructor() {
    this.server = http.createServer();
    this.routes = {};
    this.server.on('request', this.handlerRequest);
  }

  public on(event: 'request', listener: RequestListener) {
    this.server.on('request', listener);
  }

  public listen(port: number, cb?: () => void): void {
    this.server.listen(port, cb);
  }

  public useRouter(path: string, router: Router) {
    this.routes[path] = router.routes;
  }

  private handlerRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const {url, method} = req;
    console.log(method, ' ', url);
  }
}
