import {Router} from '../Router';


const router = new Router();
router.get('/users', () => {
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