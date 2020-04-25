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
  role: string;
  name: string;
  class: string;
  classImageUrl: string;
  sd: number;
  clan?: ClanBasicInfo;
}