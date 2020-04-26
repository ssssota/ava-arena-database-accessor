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
  class: string;
  classImageUrl: string;
  sd: number;
  rank?: number;
  exp?: number;
  clanRole?: string;
  clan?: ClanBasicInfo;
}