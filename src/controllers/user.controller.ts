import userService from '../services/user.service';
import { IncomingMessage, ServerResponse } from 'http';
import { CreateUserDto, UpdateUserDto } from '../models/user.entity';
import { getRequestBody, getRequestParamId, responseData } from '../utils';
import { HttpError } from '../exeptions';

export class UserController {
  constructor() {}

  async create(req: IncomingMessage, res: ServerResponse) {
    try {
      const { age, hobbies, username } = (await getRequestBody(req)) as CreateUserDto;
      if (!age || !hobbies || !username) {
        throw new HttpError(400, 'request body does not contain required fields');
      }
      const dto = { age, hobbies, username } as CreateUserDto;
      const data = await userService.create(dto);
      responseData(res, 201, data);
    } catch (error) {
      throw error;
    }
  }

  async getAll(req: IncomingMessage, res: ServerResponse) {
    try {
      const data = await userService.getAll();
      responseData(res, 200, data);
    } catch (error) {
      throw error;
    }
  }

  async getOne(req: IncomingMessage, res: ServerResponse) {
    try {
      const id = getRequestParamId(req);
      const data = await userService.getOne(id);
      responseData(res, 200, data);
    } catch (error) {
      throw error;
    }
  }

  async update(req: IncomingMessage, res: ServerResponse) {
    try {
      const id = getRequestParamId(req);
      const { age, hobbies, username } = (await getRequestBody(req)) as UpdateUserDto;
      const dto: UpdateUserDto = {};
      if (age) dto.age = age;
      if (username) dto.username = username;
      if (hobbies) dto.hobbies = hobbies;
      const data = await userService.put(id, dto);
      responseData(res, 200, data);
    } catch (error) {
      throw error;
    }
  }

  async delete(req: IncomingMessage, res: ServerResponse) {
    try {
      const id = getRequestParamId(req);
      const data = await userService.delete(id);
      responseData(res, 204, data);
    } catch (error) {
      throw error;
    }
  }
}
