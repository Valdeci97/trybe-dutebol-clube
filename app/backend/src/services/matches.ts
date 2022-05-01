import Match from '../database/models/Matches';
import Team from '../database/models/Teams';
import IMatches from '../interfaces/matches';
import TeamService from './teams';

class MatchService {
  private _match;

  constructor() { this._match = Match; }

  public async getMatches(): Promise<Match[]> {
    const result = await this._match.findAll({
      include: [{ model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } }],
    });
    return result;
  }

  public async getMatchesByQuery(query: string): Promise<Match[]> {
    const inProgress = query === 'true';
    const result = await this._match.findAll({
      where: { inProgress },
      include: [{ model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } }],
    });
    return result;
  }

  public create = async (match: IMatches) => {
    const [home, away] = await Promise.all(
      [TeamService.getTeamById(match.homeTeam), TeamService.getTeamById(match.awayTeam)],
    );
    if (!home || !away) return undefined;
    const createdMatch = await this._match.create(match);
    return createdMatch;
  };

  public async finish(id: number) {
    const result = await this._match.update({ inProgress: false }, { where: { id } });
    return result;
  }
}

export default new MatchService();
