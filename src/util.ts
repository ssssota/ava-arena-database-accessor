import { JSDOM, BaseOptions } from 'jsdom';

// URLからDocumentを取得
export async function getDocumentFromURL(url: string | URL, options?: BaseOptions): Promise<Document> {
  if (url instanceof URL) url = url.href;
  return await JSDOM.
    fromURL(url, options).
    then(dom => dom.window.document);
}

export async function getCurrentSeason(): Promise<number> {
  return await JSDOM.
    fromURL('https://ava.pmang.jp/arena/results/').
    then(dom => Number(dom.window.location.pathname.split('/').pop()) || 34/* First Season */);
}

// 半角1、全角2として文字列の長さを数える
export function countByteCharacter(string: string): number {
  return Array.
    from(string).
    reduce((acc, cur) => acc + (cur.match(/[ -~]/)? 1: 2), 0);
}

// 画像URLと名称の関連付け
const nameImageMap: NameImageMap[] = [
  {name:'訓練兵', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_001.jpg'},
  {name:'二等兵', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_002.jpg'},
  {name:'一等兵', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_003.jpg'},
  {name:'上等兵', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_004.jpg'},
  {name:'兵長', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_005.jpg'},
  {name:'伍長1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_006.jpg'},
  {name:'伍長2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_007.jpg'},
  {name:'伍長3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_008.jpg'},
  {name:'伍長4', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_009.jpg'},
  {name:'伍長5', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_010.jpg'},
  {name:'軍曹1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_011.jpg'},
  {name:'軍曹2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_012.jpg'},
  {name:'軍曹3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_013.jpg'},
  {name:'軍曹4', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_014.jpg'},
  {name:'軍曹5', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_015.jpg'},
  {name:'曹長1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_016.jpg'},
  {name:'曹長2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_017.jpg'},
  {name:'曹長3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_018.jpg'},
  {name:'曹長4', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_019.jpg'},
  {name:'曹長5', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_020.jpg'},
  {name:'少尉1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_021.jpg'},
  {name:'少尉2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_022.jpg'},
  {name:'少尉3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_023.jpg'},
  {name:'少尉4', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_024.jpg'},
  {name:'少尉5', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_025.jpg'},
  {name:'中尉1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_026.jpg'},
  {name:'中尉2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_027.jpg'},
  {name:'中尉3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_028.jpg'},
  {name:'中尉4', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_029.jpg'},
  {name:'中尉5', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_030.jpg'},
  {name:'大尉1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_031.jpg'},
  {name:'大尉2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_032.jpg'},
  {name:'大尉3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_033.jpg'},
  {name:'大尉4', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_034.jpg'},
  {name:'大尉5', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_035.jpg'},
  {name:'少佐1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_036.jpg'},
  {name:'少佐2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_037.jpg'},
  {name:'少佐3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_038.jpg'},
  {name:'少佐4', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_039.jpg'},
  {name:'少佐5', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_040.jpg'},
  {name:'中佐1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_041.jpg'},
  {name:'中佐2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_042.jpg'},
  {name:'中佐3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_043.jpg'},
  {name:'中佐4', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_044.jpg'},
  {name:'中佐5', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_045.jpg'},
  {name:'大佐1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_046.jpg'},
  {name:'大佐2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_047.jpg'},
  {name:'大佐3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_048.jpg'},
  {name:'大佐4', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_049.jpg'},
  {name:'大佐5', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_050.jpg'},
  {name:'准将1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_051.jpg'},
  {name:'准将2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_052.jpg'},
  {name:'准将3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_053.jpg'},
  {name:'少将1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_054.jpg'},
  {name:'少将2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_055.jpg'},
  {name:'少将3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_056.jpg'},
  {name:'中将1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_057.jpg'},
  {name:'中将2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_058.jpg'},
  {name:'中将3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_059.jpg'},
  {name:'大将1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_060.jpg'},
  {name:'大将2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_061.jpg'},
  {name:'大将3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_062.jpg'},
  {name:'元帥1', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_063.jpg'},
  {name:'元帥2', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_064.jpg'},
  {name:'元帥3', imageUrl:'https://file.gameon.jp/ava/images/secure/mall/common/images/class/class_065.jpg'},
  {name:'ブロンズ1', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/bronze1.png'},
  {name:'ブロンズ2', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/bronze2.png'},
  {name:'ブロンズ3', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/bronze3.png'},
  {name:'ブロンズ4', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/bronze4.png'},
  {name:'ブロンズ5', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/bronze5.png'},
  {name:'シルバー1', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/silver1.png'},
  {name:'シルバー2', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/silver2.png'},
  {name:'シルバー3', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/silver3.png'},
  {name:'シルバー4', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/silver4.png'},
  {name:'シルバー5', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/silver5.png'},
  {name:'ゴールド1', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/gold1.png'},
  {name:'ゴールド2', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/gold2.png'},
  {name:'ゴールド3', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/gold3.png'},
  {name:'ゴールド4', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/gold4.png'},
  {name:'ゴールド5', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/gold5.png'},
  {name:'プラチナ1', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/platinum1.png'},
  {name:'プラチナ2', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/platinum2.png'},
  {name:'プラチナ3', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/platinum3.png'},
  {name:'プラチナ4', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/platinum4.png'},
  {name:'プラチナ5', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/platinum5.png'},
  {name:'スター1', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/star1.png'},
  {name:'スター2', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/star2.png'},
  {name:'スター3', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/star3.png'},
  {name:'スター4', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/star4.png'},
  {name:'スター5', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/star5.png'},
  {name:'ゴールドスター', imageUrl:'https://file.gameon.jp/ava/images/member/arena/rank_mark/goldstar.png'}
];

export function getUrlFromName(name: string): string {
  return nameImageMap.filter(ni => ni.name === name)[0].imageUrl;
}
export function getNameFromUrl(url: string): string {
  return nameImageMap.filter(ni => ni.imageUrl === url.replace(/(?<!:)\/\//,'/'))[0].name;
}