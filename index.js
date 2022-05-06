Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, "wakelock")

const FS = FileStream;
const path = 'sdcard/BotGame01';
const owner = ''; //!hash 입력 후 받은 값을 적용하세요.
let reload;
let game = {};
const settings = {
    chance: 0,
    chance1: 20,
    chance2: 1,
    reward: ['🦎',
               '🪨',
               '🍭',
               '🧁',
               '🍦',
               '🍮', 
               '🍰'],
    reward2: [-5, 0, 3, 5, 10, 15, 20],
    ranks: '프렌즈,멤버,패밀리'.split(','), 
    day: [0, 20, 30]};

function response(room, msg, sender, igc, replier, imageDB) {

    if (!reload) {
        game = JSON.parse(FS.read(path));
        if (!game)
            game = {
                game: {},
                player: {}
            };
        reload = true;
    }
    let hash = java.lang.String(imageDB.getProfileBase64()).hashCode() + [];
    if (msg == '!hash')
        replier.reply(hash);
    if (msg.startsWith('/')) {
        msg = msg.slice(1).trim();
        if (hash == owner) {
            if (/^포인트 .+ -?\d+$/.test(msg)) {
                let a = msg.replace(/^포인트 (.+) -?\d+$/, '$1');
                let b = msg.replace(/^포인트 .+ -?(\d+)$/, '$1');
                game.player[a].xp += +b;
                replier.reply('완료.');
            }
        }
        let day = new Date().getDay();
        if (msg == '입장') {
            if (!game.player[sender])
                game.player[sender] = {
                    rank: settings.ranks[0],
                    level: 0,
                    xp: 0,
                    point: 0,
                    day: -1,
                    chance: 0};
            else {
                replier.reply(sender + '님은 이미 입장하셨습니다!👻');
                return;
            }
            replier.reply(sender + '님!💡불량식품 세계에 오신것을 환영합니다!💡이제 놀러가기를 입력해주세요🌌');
        }
        let info = game.player[sender];
        if (!info) {
            if ('내큐브/채집/교환/게임포인트'.split('/').includes(msg)) 
                replier.reply(sender + '님\n입장을 먼저 입력해주세요💖');
            return;
        }
        if (msg == '내큐브')
            replier.reply(sender + '님의 정보\n💠큐브에 저장된 💕행복지수 : ' + info.xp + '\n🎁포인트 : ' + info.level + '0p\n🎫채집가능횟수 : ' + info.chance);
        if (msg == '놀러가기') {
            if (day != info.day) {
                game.player[sender].day = day;
                replier.reply(sender + '님\n채집 준비가되었습니다! 20회 획득!');
                game.player[sender].chance += settings.chance1;
            } else 
                replier.reply(sender + '님\n두번을 놀러갈수 없습니다');
        }
        if (msg == '채집') {
            if (info.chance == -1) {
                replier.reply(sender + '님\n 내일 다시 오세요!');
                return
            }
            if (info.chance >= settings.chance2) {
                game.player[sender].chance -= settings.chance2;
                let num = (Math.random() * 7 | 0) + 1;
                let a = settings.reward[num - 1];
                let b = settings.reward2[num - 1];
                replier.reply('🎉' + sender + '님이 ' + a + '발견했어요! ('+ b + 'p)🎉');
                game.player[sender].xp += b;
                if(info.xp >= 1000){
                  info.level++;
                  (info.xp -= 1000)
                  replier.reply(sender + '님 행복지수가 1000에 도달하여 10포인트로 전환되었습니다');
               }
            } else
                replier.reply(sender + '님\n내일 다시 오세요!');
        }
        if (msg == '게임포인트') {
            let a = game.player;
            let b = Object.keys(a);
            let c = b.sort((s, d) => a[d].level - a[s].level).map((s, i) => ++i + '. ' + s + ' (' + a[s].level + '0p)').join('\n');
            replier.reply('[ 🌷게임 포인트 현황🌷 ]\n' + c);
        }
    }
    FS.write(path, JSON.stringify(game));
}