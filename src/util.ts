import { JSDOM, BaseOptions } from 'jsdom';

// URLからDocumentを取得
export async function getDocumentFromURL(url: string, options?: BaseOptions): Promise<Document> {
  return await JSDOM.
    fromURL(url, options).
    then(dom => dom.window.document);
}

// 半角1、全角2として文字列の長さを数える
export function countByteCharacter(string: string): number {
  return Array.
    from(string).
    reduce((acc, cur) => acc + (cur.match(/[ -~]/)? 1: 2), 0);
}

// 画像と階級を関連付ける
const classUrlMap = new Map([
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_001.jpg', '訓練兵'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_002.jpg', '二等兵'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_003.jpg', '一等兵'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_004.jpg', '上等兵'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_005.jpg', '兵長'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_006.jpg', '伍長1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_007.jpg', '伍長2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_008.jpg', '伍長3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_009.jpg', '伍長4'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_010.jpg', '伍長5'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_011.jpg', '軍曹1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_012.jpg', '軍曹2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_013.jpg', '軍曹3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_014.jpg', '軍曹4'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_015.jpg', '軍曹5'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_016.jpg', '曹長1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_017.jpg', '曹長2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_018.jpg', '曹長3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_019.jpg', '曹長4'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_020.jpg', '曹長5'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_021.jpg', '少尉1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_022.jpg', '少尉2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_023.jpg', '少尉3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_024.jpg', '少尉4'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_025.jpg', '少尉5'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_026.jpg', '中尉1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_027.jpg', '中尉2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_028.jpg', '中尉3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_029.jpg', '中尉4'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_030.jpg', '中尉5'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_031.jpg', '大尉1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_032.jpg', '大尉2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_033.jpg', '大尉3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_034.jpg', '大尉4'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_035.jpg', '大尉5'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_036.jpg', '少佐1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_037.jpg', '少佐2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_038.jpg', '少佐3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_039.jpg', '少佐4'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_040.jpg', '少佐5'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_041.jpg', '中佐1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_042.jpg', '中佐2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_043.jpg', '中佐3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_044.jpg', '中佐4'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_045.jpg', '中佐5'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_046.jpg', '大佐1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_047.jpg', '大佐2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_048.jpg', '大佐3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_049.jpg', '大佐4'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_050.jpg', '大佐5'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_051.jpg', '准将1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_052.jpg', '准将2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_053.jpg', '准将3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_054.jpg', '少将1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_055.jpg', '少将2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_056.jpg', '少将3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_057.jpg', '中将1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_058.jpg', '中将2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_059.jpg', '中将3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_060.jpg', '大将1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_061.jpg', '大将2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_062.jpg', '大将3'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_063.jpg', '元帥1'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_064.jpg', '元帥2'],
  ['https://file.gameon.jp/ava/images/secure/mall/common/images/class//class_065.jpg', '元帥3']
]);
// 階級画像から階級を取得する
export function getClassName(url: string): string {
  return classUrlMap.get(url) || '訓練兵';
}