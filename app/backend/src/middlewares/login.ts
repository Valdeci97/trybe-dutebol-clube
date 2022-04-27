import { Request, Response, NextFunction } from 'express';

import { emailSchema, passwordSchema } from '../joiSchemas/login';

class LoginValidate {
  public email = (req: Request, res: Response, next: NextFunction): Response | void => {
    const { email } = req.body;
    const { error } = emailSchema.validate({ email });
    if (error) {
      const [status, message] = error.message.split('/');
      return res.status(parseInt(status, 10)).send({ error: message });
    }
    next();
  };

  public password = (req: Request, res: Response, next: NextFunction): Response | void => {
    const { password } = req.body;
    const { error } = passwordSchema.validate({ password });
    if (error) {
      const [status, message] = error.message.split('/');
      return res.status(parseInt(status, 10)).send({ error: message });
    }
    next();
  };
}

export default new LoginValidate();
