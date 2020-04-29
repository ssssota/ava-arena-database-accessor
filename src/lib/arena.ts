import { getDocumentFromURL, getCurrentSeason, getNameFromUrl } from '../util';

export default class Arena {
  private static arenaRoute = 'https://ava.pmang.jp/arena/results';

  static getPlayerInfo(playerName: string, season?: number): Promise<PlayerArenaInfo> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = await Arena.getPlayerUrl(playerName, season);
        const document = await getDocumentFromURL(url).catch(reject) as Document;
        const [ $name, $class, $clan ] = Array.from(document.querySelectorAll('#chara .chara-data dl.chara-data__item dd.chara-data__inner')) as HTMLElement[];
        const [ $rank, $record, $kill ] = Array.from(document.querySelectorAll('#season .season-data dl.season-data__item dd.season-data__inner')) as HTMLElement[];
        const [ $score, $totalKill, $death, $assist, $sd, $kd ] = Array.from(document.querySelectorAll('#season .season-detail dl.season-detail__item dd.season-detail__inner')) as HTMLElement[];
        const classImageUrl = $class?.getElementsByTagName('img')?.item(0)?.src || '';
        const arenaRankImageUrl = $rank?.getElementsByTagName('img')?.item(0)?.src || '';
        const [ total, wins, losses ] = Array.
          from($record.querySelectorAll('.season-data__result .season-data__result-num')).
          map($e => Number($e?.textContent) || 0);
        const [ winRate, rp, rpRank ] = Array.
          from($record.querySelectorAll('.season-data__result-rate span')).
          map($e => Number($e?.textContent) || 0);
        const [ pm, rm, sr ] = Array.
          from($kill.getElementsByTagName('span')).
          map($e => Number($e?.textContent) || 0);
  
        resolve({
          name: $name?.textContent || playerName,
          class: {
            name: getNameFromUrl(classImageUrl),
            imageUrl: classImageUrl,
          },
          clanName: $clan?.getElementsByTagName('p')?.item(0)?.textContent || undefined,
          arenaRankImageUrl, arenaRank: getNameFromUrl(arenaRankImageUrl),
          record: {
            total, wins, losses,
            winRate: wins/total || winRate
          },
          rp, rpRank,
          kill: {
            total: Number($totalKill.getElementsByClassName('season-detail__rate')?.item(0)?.textContent) || 0 || (pm+rm+sr),
            pm, rm, sr
          },
          score: Number($score.getElementsByClassName('season-detail__rate')?.item(0)?.textContent) || 0,
          death: Number($death.getElementsByClassName('season-detail__rate')?.item(0)?.textContent) || 0,
          assist: Number($assist.getElementsByClassName('season-detail__rate')?.item(0)?.textContent) || 0,
          sd: Number($sd.getElementsByClassName('season-detail__rate')?.item(0)?.textContent) || 0,
          kd: Number($kd.getElementsByClassName('season-detail__rate')?.item(0)?.textContent) || 0
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  static getBattleRecords(playerName: string, season?: number): Promise<BattleRecord[]> {
    return new Promise(async (resolve, reject) => {
      try {
        season = season || await getCurrentSeason().catch(reject) as number;
        const url = await Arena.getPlayerUrl(playerName, season);
        const document = await getDocumentFromURL(url);

        const battleCount = Number(document.querySelector('#season .season-data .season-data__result-num')?.textContent) || 0;
        if (battleCount < 1) resolve([]);
        const pageCount = Math.ceil(battleCount / 10/* battle count per page */);

        const result: BattleRecord[] = [];
        for (let i of Array(pageCount).fill(0).map((_, i) => i)) {
          const url = await Arena.getPlayerUrl(playerName);
          url.searchParams.append('page', `${i + 1}`);
          const document = await getDocumentFromURL(url);

          const winSelector = '#result .result__item--lose';
          const loseSelector = '#result .result__item--win';
          document.querySelectorAll(`${winSelector},${loseSelector}`).forEach($elem => {
            const id = Number(
              $elem.getElementsByClassName('result__btn-accodion')?.item(0)?.
              getAttribute('onclick')?.match(/\('(?<id>\d*)'\)/)?.groups?.id
            ) || 0;
            const winOrLose = $elem.getElementsByClassName('result__ttl')?.item(0)?.textContent || 'LOSE';
            const isVictory = (winOrLose.toUpperCase() === 'WIN')? true: false;
            const $arenaRank = $elem.getElementsByClassName('result__item-icon')?.item(0);
            const arenaRankImageUrl = ($arenaRank?.getElementsByTagName('img')?.item(0) as HTMLImageElement | undefined)?.src || '';
            const rpTransition = Number($arenaRank?.parentElement?.getElementsByTagName('p')?.item(1)?.textContent?.match(/(?<num>-?[0-9]+)/)?.groups?.num);
            const map = $elem.getElementsByClassName('result__strategy')?.item(0)?.textContent || '';
            const [ $round, $sdkd ] = Array.from($elem.getElementsByClassName('result__detail-block')) as HTMLElement[];
            const [ wins, losses ] = Array.from($round.getElementsByTagName('span')).map($e => Number($e?.textContent) || 0);
            const [ sd, kd ] = Array.from($sdkd.getElementsByTagName('span')).map($e => Number($e?.textContent) || 0);
            const { date, time } = $elem.querySelector('.result__detail-date > span')?.textContent?.match(/(?<date>[0-9/]+)([^0-9:/]+)(?<time>[0-9:]+)/)?.groups as {date: string | undefined, time: string | undefined};
            const endTime = new Date(`${date} ${time}`);
            const [ own, enemy ] = Array.from($elem.getElementsByClassName('result__team-members')).map($members => [
              ...Array.from($members.getElementsByClassName('result__team-member')).map($member => {
                const arenaRankImageUrl = $member.getElementsByTagName('img')?.item(0)?.src || '';
                return {
                  name: $member.textContent?.trim() || '',
                  arenaRank: {
                    name: getNameFromUrl(arenaRankImageUrl),
                    imageUrl: arenaRankImageUrl
                  }
                } as TeamMember;
              })
            ]);
            result.push({
              id, isVictory, rpTransition, map, sd, kd, endTime,
              round: {
                total: wins + losses,
                wins, losses
              },
              arenaRank: {
                name: getNameFromUrl(arenaRankImageUrl),
                imageUrl: arenaRankImageUrl
              },
              teams: { own, enemy }
            })
          });
        }
        resolve(result);
      } catch (err) {
        reject(err);
      }
    })
  }

  private static getPlayerUrl(playerName: string, season?: number): Promise<URL> {
    return new Promise(async (resolve, reject) => {
      playerName = playerName.trim();
      const url = new URL(`${Arena.arenaRoute}/${season || await getCurrentSeason().catch(reject)}`);
      url.searchParams.append('char_name', playerName);
      resolve(url);
    });
  }
}