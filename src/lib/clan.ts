import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { countByteCharacter } from '../util';

const clansRoute = 'https://ava.pmang.jp/clans';

type TClanSearchResult = {
  type: 'correct' | 'suggest' | 'no-result';
  clanId?: number;
  suggestedClans?: string[];
  members?: string[];
}
export async function getClanMembersName(clanName: string): Promise<TClanSearchResult> {
  return new Promise(async (resolve, reject) => {
    const searchResult = await clanSearch(clanName).catch(reject) as TClanSearchResult;

    // 該当クランがなければその旨を返却
    if (searchResult.type !== 'correct') {
      resolve(searchResult);
      return;
    }
    if (!searchResult.clanId) {
      reject(new Error('Unexpected response.'));
      return;
    }

    const members = await getMembers(searchResult.clanId).catch(reject);
    resolve(Object.assign(searchResult, { members }));
  })
}

function clanSearch(clanName: string): Promise<TClanSearchResult> {
  return new Promise(async (resolve, reject) => {
    clanName = clanName.trim().toLowerCase();
    // クラン名は3文字以上、半角20文字（全角10文字）以内
    if (clanName.length < 3 || 20 < countByteCharacter(clanName)) {
      reject(new Error('Enter the clan name with 3 or more characters, 20 half-width characters, and 10 full-width characters or less.'));
      return;
    }

    // 検索URL
    const url = new URL(clansRoute);
    url.searchParams.append('clan_name', clanName);
    url.searchParams.append('sort', '0'); // ポイント順（ランク順）

    const html = await fetch(url).then(res => res.text()).catch(reject) as string;
    const $ = cheerio.load(html);
    const $teams = $('.list>table>tbody .team>a');

    // 検索結果0件
    if ($teams.length === 0) {
      resolve({ type: 'no-result' });
      return;
    }
    // 検索結果1件
    if ($teams.length === 1) {
      const $anchor = $teams[0]
      const $child = $anchor.firstChild;
      const childData = ($child && $child.data) || '';
      const clanId = Number($anchor.attribs && $anchor.attribs.href && $anchor.attribs.href.split('/').pop());

      // 検索結果とクラン名が一致
      if (childData.toLowerCase() === clanName && !Number.isNaN(clanId)) {
        resolve({ type: 'correct', clanId });
        return;
      }
    }

    const suggestedClans: string[] = [];
    $teams.each((i, $elem) => $elem.data && suggestedClans.push($elem.data));
    resolve({ type: 'suggest', suggestedClans });
  });
}

function getMembers(clanId: number): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    const url = new URL(`${clansRoute}/${clanId}`);
    const html = await fetch(url).then(res => res.text()).catch(reject) as string;
    const $ = cheerio.load(html);
    const $names = $('.mine-box .inner table td.name');

    const members: string[] = [];
    $names.each((i, $elem) => $elem.firstChild.data && members.push($elem.firstChild.data));
    resolve(members);
  });
}