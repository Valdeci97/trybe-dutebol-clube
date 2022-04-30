import { Request, Response, NextFunction } from 'express';

import MatchService from '../services/matches';

class MatchController {
  public getMatches = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const matches = await MatchService.getMatches();
      return res.status(200).send(matches);
    } catch (err) {
      next(err);
    }
  };
}

export default new MatchController();
