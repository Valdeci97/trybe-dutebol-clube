import Match from '../database/models/Matches';
import Team from '../database/models/Teams';

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
}

export default new MatchService();
