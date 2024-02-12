import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { HttpError } from '../exeptions';
import { IncomingMessage, ServerResponse } from 'http';
import { User } from '../models/user.entity';

export function parsePathExpress(path?: string) {
  if (!path) {
    return '';
  }
  const chunks = path.split('/');
  const mainPath = '/' + chunks[1];
  const routePath = '/' + chunks.slice(2).join('/');

  return [mainPath, routePath];
}

export const uuidValidateV4 = (uuid: string): boolean => {
  const isValid = uuidValidate(uuid) && uuidVersion(uuid) === 4;
  if (!isValid) {
    throw new HttpError(400, 'ID is not UUID');
  }
  return isValid;
};

export const responseData = (
  res: ServerResponse,
  statusCode: number,
  data?: User | User[] | { message: string } | null
) => {
  res.writeHead(statusCode, { 'Content-type': 'application/json' });
  res.end(JSON.stringify(data));
};

export const getRequestBody = async (request: IncomingMessage): Promise<User | undefined> => {
  const boby = [];

  for await (const chunk of request) {
    boby.push(chunk);
  }

  const data = Buffer.concat(boby).toString();

  if (data) {
    return JSON.parse(data);
  }
};

export const getRequestParamId = (req: IncomingMessage) => {
  const id = req.url?.split('/').at(-1);
  if (!id) {
    throw new HttpError(400, 'ID is not UUID');
  }
  uuidValidateV4(id);
  return id;
};
