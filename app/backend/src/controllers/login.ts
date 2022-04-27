import { Request, Response } from 'express';

import LoginService from '../services/login';

class LoginController {
  public login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    const result = await LoginService.login(email, password);
    console.log(result);
    return res.status(200).send({ message: 'OK' });
  };
}

export default new LoginController();
