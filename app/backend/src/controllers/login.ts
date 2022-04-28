import { Request, Response, NextFunction } from 'express';

import LoginService from '../services/login';

class LoginController {
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const [status, payload] = await LoginService.login(email, password);
      return res.status(status).send(payload);
    } catch (err) {
      next(err);
    }
  };
}

export default new LoginController();
