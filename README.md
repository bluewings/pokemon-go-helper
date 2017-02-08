# pokemon-go-helper

포켓몬의 이름에 IV값과 진화가능여부를 표시해줍니다.

| BEFORE | AFTER |
|--------|-------|
| <img src="/sample/img/pokemons-before.jpeg" width="400"> | <img src="/sample/img/pokemons-after.jpeg" width="400"> |

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
- 지메일, 패스워드를 prompt 로 입력
```
$ node index.js 혹은 npm start
```

- 지메일, 패스워드를 파라미터로 넘기는 경우 배치 작업 시 이용
```
$ node index.js --username:GMAIL_USERNAME --password:GMAIL_PASSWORD
```
```
[Pokémon Go Helper] gmail: youraccount@gmail.com
[Pokémon Go Helper] password: ********
[Pokémon Go Helper] location: 
[i] Logging with user: youraccount@gmail.com
[i] Received Google access token!
[i] Received API Endpoint: https://pgorelease.nianticlabs.com/plfe/323/rpc
[i] updateing 5 items.
[i] update nickname: 야도란 88 A
[i] update nickname: 콘치 75 B •
[i] update nickname: 아쿠스타 97 SS
[i] update nickname: 마그마 55 C
[i] update nickname: 쁘사이저 95 SS
```

> IV GO 앱에 표시되는 내용과 이름이 동일한 것을 확인
> 
> <img src="/sample/img/iv-go.jpeg" width="360">
