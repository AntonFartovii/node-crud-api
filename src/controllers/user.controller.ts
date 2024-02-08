import userService from '../services/user.service';
import {IncomingMessage, ServerResponse} from 'http';
import {HandlerOptions} from '../Router';

export class UserController {

  constructor() {
  }

  async create(req: IncomingMessage, res: ServerResponse, options?: HandlerOptions) {
    return await userService.create();
  }

  async getAll(req: IncomingMessage, res: ServerResponse, options?: HandlerOptions) {
    const data = await userService.getAll();
    res.writeHead(200, {'Content-type': 'application/json'});
    res.end(JSON.stringify(data));
  }

  async getOne(req: IncomingMessage, res: ServerResponse, options?: HandlerOptions) {
    console.log(req);
    return await userService.getOne();
  }

  async update(req: IncomingMessage, res: ServerResponse, options?: HandlerOptions) {
    return await userService.put();
  }

  async delete(req: IncomingMessage, res: ServerResponse, options?: HandlerOptions) {
    return await userService.delete();
  }
}