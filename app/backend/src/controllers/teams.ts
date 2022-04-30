import { Request, Response, NextFunction } from 'express';

import TeamService from '../services/teams';
import HttpException from '../exceptions/httpException';

class TeamController {
  public getTeams = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const teams = await TeamService.getTeams();
      if (!teams) return next(new HttpException(404, 'Any Team are found in database'));
      return res.status(200).send(teams);
    } catch (err) {
      next(err);
    }
  };
}

export default new TeamController();
