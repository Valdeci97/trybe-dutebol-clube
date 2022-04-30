import Team from '../database/models/Teams';

class TeamService {
  private _team;

  constructor() { this._team = Team; }

  public async getTeams(): Promise<Team[]> {
    const result = await this._team.findAll();
    return result;
  }
}

export default new TeamService();
