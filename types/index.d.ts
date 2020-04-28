declare interface ClanBasicInfo {
  name: string;
  id: number;
  point?: number;
  createdDate?: Date;
  memberCount?: number;
  clanMarkUrl?: string;
  prMessage?: string;
  homepage?: string;
}
declare interface PlayerBasicInfo {
  name: string;
  class: Class;
  sd: number;
  rank?: number;
  exp?: number;
  clanRole?: string;
  clan?: ClanBasicInfo;
}
declare interface PlayerArenaInfo {
  name: string;
  class: Class;
  clanName?: string;
  arenaRank: string;
  arenaRankImageUrl: string;
  record: {
    total: number;
    wins: number;
    losses: number;
    winRate: number;
  };
  rp: number;
  rpRank: number;
  kill: {
    total: number;
    pm: number;
    rm: number;
    sr: number;
  }
  score: number;
  death: number;
  assist: number;
  sd: number;
  kd: number;
}
declare interface BattleRecord {
  id: number;
  isVictory: boolean;
  arenaRank: ArenaRank;
  rpTransition: number;
  map: string;
  round: {
    total: number;
    wins: number;
    losses: number;
  };
  sd: number;
  kd: number;
  endTime: Date;
  teams: {
    own: TeamMember[];
    enemy: TeamMember[];
  };
}
declare interface TeamMember {
  name: string;
  arenaRank: ArenaRank;
}
declare interface Rank {
  name: string;
  imageUrl: string;
}
declare interface ArenaRank extends Rank {}
declare interface Class extends Rank {}