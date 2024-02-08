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

export type Callback = (req: IncomingMessage, res: ServerResponse, options: HandlerOptions) => void;

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

  public get(path: string, cb: http.RequestListener): void {
  }

  public post(path: string, cb: http.RequestListener): void {
  }

  public delete(path: string, cb: http.RequestListener): void {
  }

  public update(path: string, cb: http.RequestListener): void {
  }
}