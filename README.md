# pokemon-go-helper

포켓몬의 이름에 IV값과 진화가능여부를 표시해줍니다.

| BEFORE | AFTER |
|--------|-------|
| <img src="/sample/img/pokemons-before.jpeg" width="400"> | <img src="/sample/img/pokemons-after.jpeg" width="400"> |

### Requirements
- Install nodejs : http://nodejs.org/
(; 'brew install node' is possible)

### Install node packages
```
$ git clone https://github.com/bluewings/pokemon-go-helper
$ cd pokemon-go-helper
$ npm install
```

### Run
```
$ node index.js --username:GMAIL_USERNAME --password:GMAIL_PASSWORD
```
```
[i] Logging with user: GMAIL_USERNAME
[i] Received Google access token!
[i] Received API Endpoint: https://pgorelease.nianticlabs.com/plfe/323/rpc
[i] updateing 5 items.
[i] update nickname: 야도란 88 A
[i] update nickname: 콘치 75 B •
[i] update nickname: 아쿠스타 97 SS
[i] update nickname: 마그마 55 C
[i] update nickname: 쁘사이저 95 SS
```

IV GO 앱에 표시되는 내용과 이름이 동일한 것을 확인<br>
<img src="/sample/img/iv-go.jpeg" width="300">
