import { getClanMembers, searchClan } from './lib/clan'

const AvaArenaDbAccessor = {
  getClanMembers,
  searchClan,

  // TODO: Get player basic status (eg. name, class, s/d, RP, clan)
  // TODO: Get player match status (eg. name, class, clan, season data(rank, record, kills, score, kill, death, assist, s/d, k/d))
  // TODO: Suggest player name

  // TODO: Get match records
  // TODO: Get win rate by map

};

getClanMembers(59043).then(console.log).catch(console.error);

export default AvaArenaDbAccessor;