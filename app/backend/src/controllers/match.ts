import { Request, Response, NextFunction } from 'express';

import MatchService from '../services/matches';
import HttpException from '../exceptions/httpException';

class MatchController {
  public getMatches = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { inProgress } = req.query;
      if (inProgress) {
        const filteredMatches = await MatchService.getMatchesByQuery(inProgress as string);
        if (filteredMatches.length === 0) return next(new HttpException(404, 'No match found'));
        return res.status(200).send(filteredMatches);
      }
      const matches = await MatchService.getMatches();
      if (matches.length === 0) return next(new HttpException(404, 'No match found'));
      return res.status(200).send(matches);
    } catch (err) {
      next(err);
    }
  };
}

export default new MatchController();
