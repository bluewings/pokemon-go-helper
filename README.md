## 기존 사용자들 중요 공지!

[receive endpoint가 null 로 나옵니다](https://github.com/bluewings/pokemon-go-helper/issues/4) 이슈 해결을 위해 API 연동 라이브러리를 [Pokemon-GO-node-api](https://github.com/Armax/Pokemon-GO-node-api)에서 [pogobuf](https://github.com/cyraxx/pogobuf)로 변경하였습니다.

[[관련 수정사항 보기]](https://github.com/bluewings/pokemon-go-helper/commit/8ed339d5968b76588b9c82de8fd239df03074327)

동일한 증상을 겪으시는 사용자 분들은 아래 명령 실행 후에 다시 하시면 됩니다.

```
git pull
npm install
```

*. 신규로 설치하시는 분은 상관없습니다.

---

# pokemon-go-helper

포켓몬고에 도움이 되는 스크립트 모음입니다.

1. 포켓몬의 이름에 IV값과 진화가능여부를 표시해줍니다.

2. 현재 보유한 포켓몬과 캔디을 기준으로 진화시 얻을 수 있는 경험치를 계산해줍니다.

3. 내가 가지고 있는 포켓몬 상세 목록을 엑셀로 다운로드합니다.

### Requirements
- Install nodejs : http://nodejs.org/ - ver. 6.9.2 ↑
<br>(; 'brew install node' is possible)

### Install node packages
```
$ git clone https://github.com/bluewings/pokemon-go-helper
$ cd pokemon-go-helper
$ npm install
```

### Run
- 지메일, 패스워드를 prompt 로 입력 (권장)
```
$ node index.js 혹은 npm start
```

- 지메일, 패스워드를 파라미터로 넘기는 경우 (crontab 등 배치 작업 시 이용)
```
$ node index.js --username:GMAIL_USERNAME --password:GMAIL_PASSWORD
```

----------

### #1 포켓몬 닉네임 변경 (IV값, 랭크, 진화여부 표시)

| BEFORE | AFTER |
|--------|-------|
| <img src="/sample/img/pokemons-before.jpeg" width="400"> | <img src="/sample/img/pokemons-after.jpeg" width="400"> |

```
$ npm start
[Pokémon Go Helper] gmail: youraccount@gmail.com
[Pokémon Go Helper] password: **********
[Pokémon Go Helper] location: 

Please select an action to perform.
1. 포켓몬의 닉네임을 변경합니다. (default)
2. 진화로 획득가능한 경험치를 계산합니다.
3. 포켓몬 목록을 엑셀로 다운로드합니다.

[Pokémon Go Helper] task number: 1

[i] Logging with user: youraccount@gmail.com
[i] Received Google access token!
[i] Received API Endpoint: https://pgorelease.nianticlabs.com/plfe/313/rpc
[i] Current location: 경기도 성남시 분당구 정자동
[i] lat/long/alt: : 37.3638388 127.1163207 0
[i] execute 'rename' task. : 포켓몬의 닉네임을 변경합니다.
[i] updateing 5 items.
[i] update nickname: 야도란 88 A
[i] update nickname: 콘치 75 B •
[i] update nickname: 아쿠스타 97 SS
[i] update nickname: 마그마 55 C
[i] update nickname: 쁘사이저 95 SS
```

### #2 포켓몬 닉네임 변경

현재 보유한 포켓몬과 캔디을 기준으로 진화시 얻을 수 있는 경험치를 계산해줍니다.

<img src="/sample/img/simulate-evolution.png">

엑셀 파일로 내보낼까요? 질문에 y 로 답하면, 결과를 xlsx 폴더 하위에 엑셀파일로 만들어줍니다.

<img src="/sample/img/simulate-evolution-xlsx.png">
