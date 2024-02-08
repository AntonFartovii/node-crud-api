import {Router} from '../Router';
import {IncomingMessage, ServerResponse} from 'http';


const router = new Router();
router.get('/users', function (req: IncomingMessage, res: ServerResponse) {
  console.log('get users');
});
router.get('/users/:userId', () => {
  console.log('get user');
});
router.post('/users', () => {
  console.log('post user');
});
router.update('/users/:userId', () => {
  console.log('put user');
});
router.delete('/users/:userId', () => {
  console.log('delete user');
});

export default router;