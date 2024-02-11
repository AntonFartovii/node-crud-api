import { ServerResponse } from 'http';

const headers = { 'Content-Type': 'application/json' };

export class HttpError extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }

  getData() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

export const ErrorHandler = (res: ServerResponse, errorData: HttpError) => {
  res.writeHead(errorData.statusCode, headers);
  res.end(JSON.stringify(errorData));
};
