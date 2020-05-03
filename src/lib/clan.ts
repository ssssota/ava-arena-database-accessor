import { countByteCharacter, getNameFromUrl, getDocumentFromURL } from '../util';

class InvalidSearchTextError extends Error {}
export default class Clan {
  private static clansRoute = 'https://ava.pmang.jp/clans';

  static async getClanMembers(clanId: number): Promise<PlayerBasicInfo[]> {
    return new Promise(async (resolve, reject) => {
      try {
        clanId = Math.floor(clanId)
        if (clanId < 0) {
          reject(new Error('Invalid clan ID.'));
          return;
        }
        const document = await getDocumentFromURL(`${Clan.clansRoute}/${clanId}`).catch(reject) as Document;
        const clan = Clan.getClanBasicInfo(document, clanId);
        // <tr>
        //   <td>{role}</td>
        //   <td class="name">{name}</td>
        //   <td><img height="20" width="20" src="{classImageUrl}"></td>
        //   <td>{sd}</td>
        // </tr>
        const $names = Array.from(document.querySelectorAll('#main_win .mine-box .inner .name'));
        resolve($names.map($name => {
          const $tr = $name.parentElement as HTMLElement;
          const [ $roleTd, $nameTd, $classTd, $sdTd ] = Array.from($tr.getElementsByTagName('td'));
          const $classImg = $classTd?.getElementsByTagName('img')[0];
          const classImageUrl = $classImg?.src || '';
  
          return {
            name: $nameTd?.textContent || '',
            class: {
              name: getNameFromUrl(classImageUrl),
              imageUrl: classImageUrl
            },
            sd: Number($sdTd?.textContent) || 0,
            clanRole: $roleTd?.textContent || undefined,
            clan
          };
        }));
      } catch (err) {
        reject(err);
      }
    });
  }

  private static getClanBasicInfo(document: Document, clanId: number): ClanBasicInfo {
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
    //         <td><a href="{homepage}">{homepage}</a></td>
    //       </tr>
    //   </tbody>
    // </table>
    const $clanInfoTr = document.querySelectorAll('#main_win .mine-box .team tr td');
    const $nameTd = $clanInfoTr.item(0) as HTMLElement;
    const $prTd = $clanInfoTr.item(1) as HTMLElement;
    const $hpAnchor = $clanInfoTr.item(2)?.getElementsByTagName('a')?.item(0);
    return {
      name: $nameTd?.textContent || '',
      id: clanId,
      prMessage: $prTd?.textContent || undefined,
      homepage: $hpAnchor?.href || undefined
    };
  }

  static searchClan(searchText: string): Promise<ClanBasicInfo[]>;
  static searchClan(searchText: string, options: { exactMatchOnly: false }): Promise<ClanBasicInfo[]>;
  static searchClan(searchText: string, options: { exactMatchOnly: true }): Promise<ClanBasicInfo>;
  static searchClan(searchText: string, options = { exactMatchOnly: false }): Promise<ClanBasicInfo[] | ClanBasicInfo> {
    return new Promise(async (resolve, reject) => {
      try {
        searchText = searchText.trim();
        if (searchText.length < 3 || 20 < countByteCharacter(searchText)) {
          reject(new InvalidSearchTextError('Enter the clan name with 3 or more characters, 20 half-width characters, and 10 full-width characters or less.'));
          return;
        }
        let infos: ClanBasicInfo[] = [];

        // 検索URL
        const url = new URL(Clan.clansRoute);
        url.searchParams.append('clan_name', searchText);
        url.searchParams.append('sort', '0'); // ポイント順（ランク順）
        let nextPage: string | undefined = url.href;

        // 次のページがあれば
        while (nextPage != undefined) {
          const document = await getDocumentFromURL(nextPage).catch(reject) as Document;
          infos = infos.concat(Clan.getClansInfoInPage(document));
          if (options.exactMatchOnly && infos.filter(clan => clan.name === searchText).length === 1) break;
          nextPage = Clan.existNextPage(document);
        }

        // searchTextと一致するクランを先頭へ
        infos.sort(clan => clan.name === searchText? -1: 0);
        resolve(options.exactMatchOnly? infos[0]: infos);
      } catch (err) {
        reject(err);
      }
    });
  }

  static searchPlayer(searchText: string): Promise<PlayerBasicInfo[]>;
  static searchPlayer(searchText: string, options: { exactMatchOnly: false }): Promise<PlayerBasicInfo[]>;
  static searchPlayer(searchText: string, options: { exactMatchOnly: true }): Promise<PlayerBasicInfo>;
  static searchPlayer(searchText: string, options = { exactMatchOnly: false }): Promise<PlayerBasicInfo[] | PlayerBasicInfo> {
    return new Promise(async (resolve, reject) => {
      try {
        searchText = searchText.trim();
        if (searchText.length < 3) {
          reject(new InvalidSearchTextError('Enter the clan name with 3 or more characters.'));
          return;
        }
        let infos: PlayerBasicInfo[] = [];

        // 検索URL
        const url = new URL(`${Clan.clansRoute}/ranking`);
        url.searchParams.append('keyword', searchText);
        url.searchParams.append('type', 'user');
        let nextPage: string | undefined = url.href;

        // 次のページがあれば
        while (nextPage != undefined) {
          const document = await getDocumentFromURL(nextPage).catch(reject) as Document;
          infos = infos.concat(Clan.getPlayersInfoInPage(document));
          if (options.exactMatchOnly && infos.filter(player => player.name === searchText).length === 1) break;
          nextPage = Clan.existNextPage(document);
        }

        // searchTextと一致するプレイヤーを先頭へ
        infos.sort(player => player.name === searchText? -1: 0);
        resolve(options.exactMatchOnly? infos[0]: infos);
      } catch (err) {
        reject(err);
      }
    });
  }

  private static existNextPage(document: Document): string | undefined {
    // <ul class="pagelist">
    //   <li><strong>1</strong></li>
    //   <li><a href="/clans?clan_name={searchText}&page=2&sort=0&utf8=%E2%9C%93">2</a></li>
    //   <li><a href="/clans?clan_name={searchText}&page=2&sort=0&utf8=%E2%9C%93">次 »</a></li>
    // </ul>
    const $pageList = Array.from(document.querySelectorAll('#main_win ul.pagelist li'));
    if ($pageList.length === 0) return undefined;
    
    return $pageList.pop()?.getElementsByTagName('a')?.item(0)?.href || undefined;
  }

  private static getClansInfoInPage(document: Document): ClanBasicInfo[] {
    // <tr>
    //   <td class="team">
    //     <span><img height="20" width="20" src="https://file.gameon.jp/ava/images/secure/member/common/images/clan/small/clan_s_000.gif"></span>
    //     <a href="https://ava.pmang.jp/clans/{clanId}">{clanName}</a>
    //   </td>
    //   <td>{point}</td>
    //   <td>{createdDate}</td>
    //   <td>{memberCount}</td>
    // </tr>
    const $teams = Array.from(document.querySelectorAll('#main_win .list>table>tbody .team'));
    return $teams.map($team => {
      const $tr = $team.parentElement as HTMLElement;
      const [ $teamTd, $pointTd, $dateTd, $countTd ] = Array.from($tr.getElementsByTagName('td'));
      const $anchor = $teamTd.getElementsByTagName('a')?.item(0);
  
      return {
        name: $anchor?.textContent,
        id: Number($anchor?.href?.split('/').pop()) || -1,
        point: Number($pointTd?.textContent) || 0,
        createdDate: new Date($dateTd?.textContent || 0),
        memberCount: Number($countTd?.textContent) || 0
      } as ClanBasicInfo;
    });
  }

  private static getPlayersInfoInPage(document: Document): PlayerBasicInfo[] {
    // <tr>
    //   <td class="left">{rank}</td>
    //   <td><img height="20" width="20" src="{classImageUrl}"></td>
    //   <td class="name">{name}</td>
    //   <td class="text-right">{exp}</td>
    //   <td class="text-right">{roundRp}</td>
    //   <td class="text-right">{escortRp}</td>
    //   <td class="text-right">{sd}</td>
    //   <td class="left">
    //     <span><img height="20" width="20" src="https://file.gameon.jp/ava/images/secure/member/common/images/clan/small/clan_s_000.gif"></span>
    //     <a href="https://ava.pmang.jp/clans/{clanId}">{clanName}</a>
    //   </td>
    // </tr>
    const $names = Array.from(document.querySelectorAll('#main_win .ranking>table>tbody .name'));
    return $names.map($name => {
      const $tr = $name.parentElement as HTMLElement;
      const [ $rankTd, $classTd, $nameTd, $expTd, $roundRpTd, $escortRpTd, $sdTd, $clanTd ] = Array.from($tr.getElementsByTagName('td'));
      const $anchor = $clanTd.getElementsByTagName('a')?.item(0);
      const classImageUrl = $classTd.getElementsByTagName('img')?.item(0)?.src || '';
  
      return {
        name: $nameTd?.textContent,
        rank: Number($rankTd?.textContent?.split('(')[0]) || -1,
        class: {
          name: getNameFromUrl(classImageUrl),
          imageUrl: classImageUrl,
        },
        exp: Number($expTd?.textContent) || 0,
        roundRp: Number($roundRpTd?.textContent) || 0,
        escortRp: Number($escortRpTd?.textContent) || 0,
        sd: Number($sdTd?.textContent) || 0,
        clan: (!$anchor)? undefined: {
          name: $anchor?.textContent || '',
          id: Number($anchor?.href?.split('/').pop()) || -1
        }
      } as PlayerBasicInfo;
    });
  }
}