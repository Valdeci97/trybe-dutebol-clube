import Team from '../database/models/Teams';
import ITeam from '../interfaces/team';

class TeamService {
  private _team;

  constructor() { this._team = Team; }

  public async getTeams(): Promise<Team[]> {
    const result = await this._team.findAll();
    return result;
  }

  public async getTeamById(id: number) {
    const result = await this._team.findByPk(id);
    return result as unknown as ITeam;
  }
}

export default new TeamService();
