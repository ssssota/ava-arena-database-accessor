import { getClanMembersName } from './lib/clan'

const AvaArenaDbAccessor = {
  // TODO: Get clan member
  // TODO: Suggest clan name
  getClanMembersName

  // TODO: Get player basic status (eg. name, class, s/d, RP, clan)
  // TODO: Get player match status (eg. name, class, clan, season data(rank, record, kills, score, kill, death, assist, s/d, k/d))
  // TODO: Suggest player name

  // TODO: Get match records
  // TODO: Get win rate by map

};

getClanMembersName('BONDS').then(console.log);

export default AvaArenaDbAccessor;