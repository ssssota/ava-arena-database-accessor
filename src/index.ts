import Clan from './lib/clan'

const AvaArenaDbAccessor = {
  getClanMembers: Clan.getClanMembers,
  searchClan: Clan.searchClan,
  searchPlayer: Clan.searchPlayer,

  // TODO: Get player basic status (eg. name, class, s/d, RP, clan)
  // TODO: Get player match status (eg. name, class, clan, season data(rank, record, kills, score, kill, death, assist, s/d, k/d))
  // TODO: Suggest player name

  // TODO: Get match records
  // TODO: Get win rate by map

};

//Clan.getClanMembers(155233).then(console.log).catch(console.error);
//Clan.searchClan('detonator', {exactMatchOnly: true}).then(console.log).catch(console.error);
Clan.searchPlayer('shaka').then(console.log).catch(console.error);

export default AvaArenaDbAccessor;