import { Router, Request, Response, NextFunction } from 'express';

import LoginController from '../controllers/login';
import LoginValidate from '../middlewares/login';

const loginRouter = Router();

loginRouter.post(
  '/',
  (req: Request, res: Response, next: NextFunction) => LoginValidate.email(req, res, next),
  (req: Request, res: Response, next: NextFunction) => LoginValidate.password(req, res, next),
  (req: Request, res: Response, next: NextFunction) => LoginController.login(req, res, next),
);

loginRouter.get('/validate', LoginController.checkToken);

export default loginRouter;
