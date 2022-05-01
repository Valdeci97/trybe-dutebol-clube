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
      if (teams.length === 0) return next(new HttpException(404, 'Any Team found in database'));
      return res.status(200).send(teams);
    } catch (err) {
      next(err);
    }
  };

  public getTeamById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const team = await TeamService.getTeamById(+id);
      if (!team) return next(new HttpException(404, 'Team not found'));
      return res.status(200).send(team.dataValues);
    } catch (err) {
      next(err);
    }
  };
}

export default new TeamController();
