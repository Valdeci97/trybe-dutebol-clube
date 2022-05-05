import { Request, Response, NextFunction } from 'express';

import MatchService from '../services/matches';
import HttpException from '../exceptions/httpException';
import JWT from '../helpers/jwt';

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

  public create = async (req: Request, res: Response, next: NextFunction):
  Promise<Response | void> => {
    try {
      const { authorization } = req.headers;
      const { homeTeam, awayTeam } = req.body;
      if (!authorization) return next(new HttpException(404, 'Token not found'));
      JWT.verifyToken(authorization);
      if (homeTeam === awayTeam) {
        return res.status(401).send({
          message: 'It is not possible to create a match with two equal teams',
        });
      }
      const match = await MatchService.create(req.body);
      if (!match) return res.status(404).send({ message: 'There is no team with such id!' });
      return res.status(201).send(match);
    } catch (err) {
      next(new HttpException(400, 'Invalid token'));
    }
  };

  public finish = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const [match] = await MatchService.finish(+id);
      return res.status(200).send({ id, dbResponse: match });
    } catch (err) {
      next(err);
    }
  };

  public updaTeScore = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const { homeTeamGoals, awayTeamGoals } = req.body;
      const currentResult = { id: parseInt(id, 10), homeTeamGoals, awayTeamGoals };
      const updatedMatch = await MatchService.updateScore(currentResult);
      return res.status(200).send(updatedMatch);
    } catch (err) {
      next(err);
    }
  };

  public leaderBoard = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await MatchService.generateLeaderBoard();
      return res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  };

  public homeLeaderBoard = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await MatchService.generateHomeLeaderBoard();
      return res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  };

  public awayLeaderBoard = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = await MatchService.generateAwayLeaderBoard();
      return res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  };
}

export default new MatchController();
