import { Router, Request, Response, NextFunction } from 'express';

import MatchController from '../controllers/match';

const leaderBoardRouter = Router();

leaderBoardRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => MatchController.leaderBoard(req, res, next),
);

leaderBoardRouter.get(
  '/home',
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => MatchController.homeLeaderBoard(req, res, next),
);

leaderBoardRouter.get(
  '/away',
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => MatchController.homeLeaderBoard(req, res, next),
);

export default leaderBoardRouter;
