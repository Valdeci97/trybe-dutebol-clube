import { Router, Request, Response, NextFunction } from 'express';

import MatchController from '../controllers/match';

const matchRouter = Router();

matchRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => MatchController.getMatches(req, res, next),
);

export default matchRouter;
