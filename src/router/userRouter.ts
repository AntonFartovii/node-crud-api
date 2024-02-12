import {Router} from '../core/Router';
import {UserController} from '../controllers/user.controller';

const userController = new UserController();

const router = new Router();
router.get('/users', userController.getAll);
router.get('/users/${userId}', userController.getOne);
router.post('/users', userController.create);
router.update('/users/${userId}', userController.update);
router.delete('/users/${userId}', userController.delete);

export default router;
