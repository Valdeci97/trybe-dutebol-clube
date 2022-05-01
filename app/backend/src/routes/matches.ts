import { Router, Request, Response, NextFunction } from 'express';

import MatchController from '../controllers/match';

const matchRouter = Router();

matchRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => MatchController.getMatches(req, res, next),
);

matchRouter.post(
  '/',
  (req: Request, res: Response, next: NextFunction) => MatchController.create(req, res, next),
);

matchRouter.patch(
  '/:id/finish',
  (req: Request, res: Response, next: NextFunction) => MatchController.finish(req, res, next),
);

matchRouter.patch(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => MatchController.updaTeScore(req, res, next),
);

export default matchRouter;
