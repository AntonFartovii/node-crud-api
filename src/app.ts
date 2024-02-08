import * as http from 'http';
import {RequestListener} from 'http';

export class ExpressClone {
  private server: http.Server;

  constructor() {
    this.server = http.createServer();
  }

  public on(event: 'request', listener: RequestListener) {
    this.server.on('request', listener);
  }

  public listen(port: number, cb?: () => void): void {
    this.server.listen(port, cb);
  }

  public use() {

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
