import Clan from './lib/clan'
import Arena from './lib/arena';

const AvaArenaDbAccessor = {
  getClanMembers: Clan.getClanMembers,
  searchClan: Clan.searchClan,
  searchPlayer: Clan.searchPlayer,

  getPlayerArenaInfo: Arena.getPlayerInfo,
  getBattleRecords: Arena.getBattleRecords

  // TODO: Get match records
  // TODO: Get win rate by map

};

export default AvaArenaDbAccessor;