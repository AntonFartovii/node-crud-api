import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { HttpError } from './exeptions';
import { IncomingMessage, ServerResponse } from 'http';
import { CreateUserDto, User } from './models/user.entity';

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
  data?: User | User[] | string | null
) => {
  res.writeHead(statusCode, { 'Content-type': 'application/json' });
  res.end(JSON.stringify(data));
};

export const getRequestBody = async (req: IncomingMessage) => {
  return new Promise((res, rej) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      res(JSON.parse(body) as CreateUserDto);
    });
    req.on('error', (err) => {
      rej(err);
    });
  });
};

export const getRequestParamId = (req: IncomingMessage) => {
  const id = req.url?.split('/').at(-1);
  if (!id) {
    throw new HttpError(400, 'ID is not UUID');
  }
  uuidValidateV4(id);
  return id;
};
