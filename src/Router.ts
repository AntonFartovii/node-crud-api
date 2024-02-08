import http, {IncomingMessage, ServerResponse} from 'http';

export enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export interface HandlerOptions {
    [key: string]: any;
}

export type Callback = (req: IncomingMessage, res: ServerResponse, options?: HandlerOptions) => void;

export interface Routes {
    [method: string]: {
        [path: string]: Callback;
    };
}

export class Router {
  public routes: Routes;

  constructor() {
    this.routes = {
      [METHODS.GET]: {},
      [METHODS.POST]: {},
      [METHODS.PUT]: {},
      [METHODS.DELETE]: {},
    };
  }

  addRoute(method: METHODS, path: string, cb: Callback) {
    const chunks = path.split('/').reduce((acc: string[], chunk) => {
      const match = chunk.match(/(?<param>(?<=\$\{|\{)\S+(?=\}))/);
      const paramName = match?.groups?.param;
      acc.push(paramName ? `(?<${paramName}>\\S+)` : chunk);
      return acc;
    }, []);
    const pathString = `^${chunks.join('/')}\\/?$`;
    this.routes[method][pathString] = cb;
  }

  public get(path: string, cb: http.RequestListener): void {
    this.addRoute(METHODS.GET, path, cb);
  }

  public post(path: string, cb: http.RequestListener): void {
    this.addRoute(METHODS.POST, path, cb);
  }

  public delete(path: string, cb: http.RequestListener): void {
    this.addRoute(METHODS.DELETE, path, cb);
  }

  public update(path: string, cb: http.RequestListener): void {
    this.addRoute(METHODS.PUT, path, cb);
  }
}