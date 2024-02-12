import request from 'supertest';
import Server from '../core/Server';
import userRouter from '../router/userRouter';
import {CreateUserDto} from '../models/user.entity';
import {constants as httpConstants} from 'http2';

const app = new Server();
app.useRouter('/api', userRouter);
const testServer = request(app.server);

const mockUser: CreateUserDto = {
  username: 'Anton',
  age: 18,
  hobbies: ['making', 'faking'],
};
describe('Users successfully CRUD', () => {
  it('Get empty users data - 200', async () => {
    const response = await testServer.get('/api/users/');
    expect(response.status).toBe(httpConstants.HTTP_STATUS_OK);
    expect(response.body).toHaveLength(0);
  });

  it('Create user and get by id - 201', async () => {
    const response = await testServer.post('/api/users').send(mockUser);
    expect(response.status).toBe(httpConstants.HTTP_STATUS_CREATED);
    const userId = response.body.id;

    const response2 = await testServer.get(`/api/users/${userId}`);
    expect(response2.status).toBe(httpConstants.HTTP_STATUS_OK);
    expect(response2.body.username).toBe(mockUser.username);
    expect(response2.body.age).toStrictEqual(mockUser.age);
    expect(response2.body.hobbies).toStrictEqual(mockUser.hobbies);
  });

  it('Delete user - 204', async () => {
    const response = await testServer.post('/api/users').send(mockUser);
    expect(response.status).toBe(httpConstants.HTTP_STATUS_CREATED);
    expect(response.body.username).toBe(mockUser.username);
    const userId = response.body.id;
    const {status, body} = await testServer.delete(`/api/users/${userId}`);
    expect(status).toBe(httpConstants.HTTP_STATUS_NO_CONTENT);
    expect(body).toHaveLength(0);
    expect(body).toStrictEqual('');
  });

  it('Put user - 200', async () => {
    const response = await testServer.post('/api/users').send(mockUser);
    expect(response.status).toBe(httpConstants.HTTP_STATUS_CREATED);
    expect(response.body.username).toBe(mockUser.username);
    const userId = response.body.id;
    const {status, body} = await testServer
      .put(`/api/users/${userId}`)
      .send({username: 'Maksim'});
    expect(status).toBe(httpConstants.HTTP_STATUS_OK);
    expect(body.username).toBe('Maksim');
    expect(body.age).toStrictEqual(mockUser.age);
    expect(body.hobbies).toStrictEqual(mockUser.hobbies);
  });
});

describe('Should send 404 when id does not exist', () => {
  it('GET: User does not exist - 404', async () => {
    const id = 'c7abb620-faca-4b54-a9a9-a81b7089967d';
    const {status} = await testServer.get(`/api/users/${id}`);
    expect(status).toBe(httpConstants.HTTP_STATUS_NOT_FOUND);
  });
  it('PUT: User does not exist - 404', async () => {
    const id = '96411eb8-8cd9-4030-8d3c-1c512f80110f';
    const {status} = await testServer.put(`/api/users/${id}`).send({...mockUser, age: '222'});
    expect(status).toBe(httpConstants.HTTP_STATUS_NOT_FOUND);
  });
  it('DELETE: User does not exist - 404', async () => {
    const id = '96411eb8-8cd9-4030-8d3c-1c512f80110f';
    const {status} = await testServer.delete(`/api/users/${id}`);
    expect(status).toBe(httpConstants.HTTP_STATUS_NOT_FOUND);
  });
});

describe('Should send 404 when endpoint does not exist', () => {
  it('Get /apid/users/', async () => {
    const {status} = await testServer.get('/apid/users/');
    expect(status).toBe(httpConstants.HTTP_STATUS_NOT_FOUND);
  });
  it('Get ', async () => {
    const {status} = await testServer.get('/');
    expect(status).toBe(httpConstants.HTTP_STATUS_NOT_FOUND);
  });
  it('Get /', async () => {
    const {status} = await testServer.get('');
    expect(status).toBe(httpConstants.HTTP_STATUS_NOT_FOUND);
  });
  it('Put /api/userssssss', async () => {
    const id = '96411eb8-8cd9-4030-8d3c-1c512f80110f';
    const {status} = await testServer
      .put(`/api/userssssss/${id}`)
      .send({...mockUser, age: '222'});
    expect(status).toBe(httpConstants.HTTP_STATUS_NOT_FOUND);
  });
});

describe('Should send 400 ID is not UUID', () => {
  it('Get, Put, Delete with no valid ID', async () => {
    const noValidUUID = '123-wer123213';

    const {status: statusGet} = await testServer.get(`/api/users/${noValidUUID}`);
    expect(statusGet).toBe(httpConstants.HTTP_STATUS_BAD_REQUEST);

    const {status: statusPut} = await testServer
      .put(`/api/users/${noValidUUID}`)
      .send({...mockUser, age: '222'});
    expect(statusPut).toBe(httpConstants.HTTP_STATUS_BAD_REQUEST);

    const {status: statusDelete} = await testServer.delete(`/api/users/${noValidUUID}`);
    expect(statusDelete).toBe(httpConstants.HTTP_STATUS_BAD_REQUEST);
  });

  describe('server error', () => {
    it('should return status 400', async () => {
      const {body, statusCode} = await testServer.post('/api/users').send(JSON.stringify('test'));
      expect(statusCode).toStrictEqual(400);
    });
  });
});
