import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { countByteCharacter, elemFilter, fetcheerio, getClassName } from '../util';

const clansRoute = 'https://ava.pmang.jp/clans';

export async function getClanMembers(clanId: number): Promise<PlayerBasicInfo[]> {
  return new Promise(async (resolve, reject) => {
    clanId = Math.floor(clanId)
    if (clanId < 0) {
      reject(new Error('Invalid clan ID.'));
      return;
    }
    const players: PlayerBasicInfo[] = [];

    const $ = await fetcheerio(`${clansRoute}/${clanId}`).catch(reject) as CheerioStatic;
    // <table class="team">
    //     <tbody>
    //       <tr>
    //         <th width="126">クラン名</th>
    //         <td>{name}</td>
    //       </tr>
    //       <tr>
    //         <th>PRメッセージ</th>
    //         <td>{prMessage}</td>
    //       </tr>
    //       <tr>
    //         <th>クランホームページ</th>
    //         <td>{homepage}</td>
    //       </tr>
    //   </tbody>
    // </table>
    const $clanInfo = $('#main_win .mine-box .team tr');
    const $nameTdFirstChild = $clanInfo[0].children.filter(elemFilter)[1].children[0];
    const $prTdFirstChild = $clanInfo[1].children.filter(elemFilter)[1].children[0];
    const $hpTdFirstElemChild = $clanInfo[2].children.filter(elemFilter)[1].children.filter(elemFilter)[0];
    const clan: ClanBasicInfo = {
      name: $nameTdFirstChild.data || '',
      id: clanId,
      prMessage: ($prTdFirstChild && $prTdFirstChild.data) || undefined,
      homepage: ($hpTdFirstElemChild && $hpTdFirstElemChild.attribs.href) || undefined
    }
    // <tr>
    //   <td>{role}</td>
    //   <td class="name">{name}</td>
    //   <td><img height="20" width="20" src="{classImageUrl}"></td>
    //   <td>{sd}</td>
    // </tr>
    $('#main_win .mine-box .inner .name').each((i, $elem) => {
      const $trChildren = $elem.parent.children.filter(elemFilter);
      const role = $trChildren[0].children[0].data || '';
      const name = $trChildren[1].children[0].data || '';
      const classImageUrl = $trChildren[2].children.filter(elemFilter)[0].attribs.src || '';
      const className = getClassName(classImageUrl);
      const sd = Number($trChildren[3].children[0].data) || 0;
      players.push({
        role, name, classImageUrl, sd, clan,
        class: className
      });
    });
    resolve(players);
  });
}

export function searchClan(searchText: string): Promise<ClanBasicInfo[]> {
  return new Promise(async (resolve, reject) => {
    try {
      if (searchText.length < 3 || 20 < countByteCharacter(searchText)) {
        reject(new Error('Enter the clan name with 3 or more characters, 20 half-width characters, and 10 full-width characters or less.'));
        return;
      }
      let infos: ClanBasicInfo[] = [];

      // 検索URL
      const url = new URL(clansRoute);
      url.searchParams.append('clan_name', searchText);
      url.searchParams.append('sort', '0'); // ポイント順（ランク順）

      
      let $ = await fetcheerio(url).catch(reject) as CheerioStatic;
      infos = infos.concat(getClanInfoInPage($));
      let nextPage = existNextPage($);

      // 次のページがあれば
      while (nextPage != undefined) {
        $ = await fetcheerio(nextPage).catch(reject) as CheerioStatic;
        infos = infos.concat(getClanInfoInPage($));
        nextPage = existNextPage($);
      }

      // searchTextと一致するクランを先頭へ
      infos.sort(v => v.name === searchText? -1: 0);
      resolve(infos);
    } catch (err) {
      reject(err);
    }
  });
}

function existNextPage($: CheerioStatic): URL | undefined {
  // <ul class="pagelist">
  //   <li><strong>1</strong></li>
  //   <li><a href="/clans?clan_name=det&amp;page=2&amp;sort=0&amp;utf8=%E2%9C%93">2</a></li>
  //   <li><a href="/clans?clan_name=det&amp;page=2&amp;sort=0&amp;utf8=%E2%9C%93">次 »</a></li>
  // </ul>
  const $pageUl = $('#main_win ul.pagelist');
  if ($pageUl.length < 1) return undefined;

  const $pageUlChildren = $pageUl[0].children.filter(elemFilter);
  if ($pageUlChildren.length < 1) return undefined;

  const $finalLi = $pageUlChildren.slice(-1)[0];
  if ($finalLi.children == undefined) return undefined;

  const $finalLiChild = $finalLi.children.filter(elemFilter)[0];
  if ($finalLiChild.type !== 'tag' || $finalLiChild.tagName !== 'a') return undefined;

  const nextUrl = $finalLiChild.attribs && $finalLiChild.attribs.href;
  return new URL(clansRoute + nextUrl);
}

function getClanInfoInPage($: CheerioStatic): ClanBasicInfo[] {
  const $teams = $('#main_win .list>table>tbody .team>a');
  const infos: ClanBasicInfo[] = []

  // <tr>
  //   <td class="team">
  //     <span><img height="20" width="20" src="https://file.gameon.jp/ava/images/secure/member/common/images/clan/small/clan_s_000.gif"></span>
  //     <a href="https://ava.pmang.jp/clans/{clanId}">{clanName}</a>
  //   </td>
  //   <td>{point}</td>
  //   <td>{createdDate}</td>
  //   <td>{memberCount}</td>
  // </tr>
  $teams.each((_, $a) => {
    const $trChildren = $a.parent.parent.children.filter(elemFilter);
    const point = Number($trChildren[1].children[0].data) || 0;
    const createdDate = new Date($trChildren[2].children[0].data || '');
    const memberCount = Number($trChildren[3].children[0].data) || 0;

    infos.push({
      name: $a.children[0].data || '',
      id: Number($a.attribs.href.split('/').pop() || ''),
      point, createdDate, memberCount
    });
  })
  return infos;
}
