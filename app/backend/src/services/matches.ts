import Match from '../database/models/Matches';
import Team from '../database/models/Teams';
import IMatches from '../interfaces/matches';
import TeamService from './teams';
import IScore from '../interfaces/score';
import Leaderboard from '../helpers/leaderBoard';
import ILeaderBoard from '../interfaces/leaderBoard';

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

  public async updateScore(match: IScore) {
    const result = await this._match.update({ ...match }, { where: { id: match.id } });
    return result;
  }

  private static sortLeaderBoard(a: ILeaderBoard, b: ILeaderBoard) {
    if (a.totalPoints === b.totalPoints && a.totalVictories === b.totalVictories) {
      if (a.goalsBalance === b.goalsBalance && a.goalsFavor === b.goalsFavor) {
        return b.goalsOwn - a.goalsOwn;
      }
      if (a.goalsBalance === b.goalsBalance) return b.goalsFavor - a.goalsFavor;
      return b.goalsBalance - a.goalsBalance;
    }
    if (a.totalPoints === b.totalPoints) return b.totalVictories - a.totalVictories;
    return b.totalPoints - a.totalPoints;
  }

  public async generateLeaderBoard() {
    const teams = await TeamService.getTeams();
    const matches = await this.getMatches();
    const leaderBoard = Leaderboard.generate(teams, matches);
    const sortedLeaderBoard = leaderBoard.sort((a, b) => MatchService.sortLeaderBoard(a, b));
    return sortedLeaderBoard;
  }

  public async generateHomeLeaderBoard() {
    const teams = await TeamService.getTeams();
    const matches = await this.getMatches();
    const homeLeaderBoard = Leaderboard.generateHome(teams, matches);
    const sortedHomeLeaderBoard = homeLeaderBoard.sort(
      (a, b) => MatchService.sortLeaderBoard(a, b),
    );
    return sortedHomeLeaderBoard;
  }

  public async generateAwayLeaderBoard() {
    const teams = await TeamService.getTeams();
    const matches = await this.getMatches();
    const awayLeaderBoard = Leaderboard.generateAway(teams, matches);
    const sortedAwayLeaderBoard = awayLeaderBoard.sort(
      (a, b) => MatchService.sortLeaderBoard(a, b),
    );
    return sortedAwayLeaderBoard;
  }
}

export default new MatchService();
