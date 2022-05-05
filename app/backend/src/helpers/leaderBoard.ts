import Team from '../database/models/Teams';
import Match from '../database/models/Matches';
import IStatistics from '../interfaces/matchStatistics';

export default class Leaderboard {
  private static getHomeResults(team: Team, matches: Match[]) {
    const results = matches.reduce(((acc, match: Match) => {
      if (team.id === match.homeTeam) {
        return {
          totalVictories: match.homeTeamGoals > match.awayTeamGoals
            ? acc.totalVictories + 1 : acc.totalVictories,
          totalDraws: match.homeTeamGoals === match.awayTeamGoals
            ? acc.totalDraws + 1 : acc.totalDraws,
          totalLosses: match.homeTeamGoals < match.awayTeamGoals
            ? acc.totalLosses + 1 : acc.totalLosses,
        };
      }
      return Leaderboard.getAwayResults(acc, match);
    }), { totalVictories: 0, totalDraws: 0, totalLosses: 0 });
    return { ...results, totalPoints: results.totalVictories * 3 + results.totalDraws };
  }

  private static getAwayResults(statistics: IStatistics, match: Match) {
    return {
      totalVictories: match.awayTeamGoals > match.homeTeamGoals
        ? statistics.totalVictories + 1 : statistics.totalVictories,
      totalDraws: match.awayTeamGoals === match.homeTeamGoals
        ? statistics.totalDraws + 1 : statistics.totalDraws,
      totalLosses: match.awayTeamGoals < match.homeTeamGoals
        ? statistics.totalLosses + 1 : statistics.totalLosses,
    };
  }

  private static getGoals(team: Team, matches: Match[]) {
    const goals = matches.reduce(((acc, match: Match) => {
      if (team.id === match.homeTeam) {
        return {
          goalsFavor: acc.goalsFavor + match.homeTeamGoals,
          goalsOwn: acc.goalsOwn + match.awayTeamGoals,
        };
      }
      return {
        goalsFavor: acc.goalsFavor + match.awayTeamGoals,
        goalsOwn: acc.goalsOwn + match.homeTeamGoals,
      };
    }), { goalsFavor: 0, goalsOwn: 0 });
    return { ...goals, goalsBalance: goals.goalsFavor - goals.goalsOwn };
  }

  public static generate(teams: Team[], matches: Match[]) {
    const leaderBoard = teams.map((team: Team) => {
      const matchesUnfinished = matches.filter((match) => (
        match.inProgress === false && (team.id === match.homeTeam || team.id === match.awayTeam)));
      const totalWins = Leaderboard.getHomeResults(team, matchesUnfinished);
      const totalGoals = Leaderboard.getGoals(team, matchesUnfinished);
      const table = {
        name: team.teamName,
        ...totalWins,
        ...totalGoals,
        totalGames: matchesUnfinished.length,
        efficiency: ((totalWins.totalPoints / (matchesUnfinished.length * 3)) * 100).toFixed(2),
      };
      return table;
    });
    return leaderBoard;
  }

  public static generateHome(teams: Team[], matches: Match[]) {
    const leaderBoard = teams.map((team: Team) => {
      const matchesUnfinished = matches.filter((match) => (
        match.inProgress === false && team.id === match.homeTeam));
      const totalWins = Leaderboard.getHomeResults(team, matchesUnfinished);
      const totalGoals = Leaderboard.getGoals(team, matchesUnfinished);
      const table = {
        name: team.teamName,
        ...totalWins,
        ...totalGoals,
        totalGames: matchesUnfinished.length,
        efficiency: ((totalWins.totalPoints / (matchesUnfinished.length * 3)) * 100).toFixed(2),
      };
      return table;
    });
    return leaderBoard;
  }

  public static generateAway(teams: Team[], matches: Match[]) {
    const leaderBoard = teams.map((team: Team) => {
      const matchesUnfinished = matches.filter((match) => (
        match.inProgress === false && team.id === match.awayTeam));
      const totalWins = Leaderboard.getHomeResults(team, matchesUnfinished);
      const totalGoals = Leaderboard.getGoals(team, matchesUnfinished);
      const table = {
        name: team.teamName,
        ...totalWins,
        ...totalGoals,
        totalGames: matchesUnfinished.length,
        efficiency: ((totalWins.totalPoints / (matchesUnfinished.length * 3)) * 100).toFixed(2),
      };
      return table;
    });
    return leaderBoard;
  }
}
