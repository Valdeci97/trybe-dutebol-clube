import { Request, Response, NextFunction } from 'express';

import LoginService from '../services/login';
import HttpException from '../exceptions/httpException';

class LoginController {
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const user = await LoginService.login(email, password);
      if (user.status) {
        return res.status(user.status).send({ message: user.message });
      }
      return res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  };

  public checkToken = (req: Request, res: Response, next: NextFunction): Response | void => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        next(new HttpException(404, 'Token not found'));
      } else {
        const token = LoginService.getRoleByToken(authorization);
        return res.status(200).send(token.role);
      }
    } catch (err) {
      next(new HttpException(400, 'Invalid token'));
    }
  };
}

export default new LoginController();
