points = {
    '쁘띠' : 50,
    '이르' : 50,
    'Save_the_bilnd' : 20, 
    'nerd_bunny' : 20,
    '꿀벌불량이' : 10,
    '센스' : 30,
    '오돌개' : 30
};

users = [ 
    '쁘띠',
    '이르',
    'Save_the_bilnd',
    'nerd_bunny',
    '꿀벌불량이',
    '센스',
    '오돌개'
];

emojis = ['🪴','🌷','🌵'];

function getRandomElement(array){
    const random = Math.floor(Math.random() * array.length);
    return array[random];
}

function isUserExists(sender){
    const index = users.indexOf(sender);
    if (index!== -1) {
        return true
    } else {
        return false
    }    
}

function response(room, msg, sender, isGroupChat, replier){

    if (msg == '/포인트 현황' && !isUserExists(sender)){
        replier.reply(getRandomElement(emojis) + sender + ' (' + points[sender] + 'points)');
    }

    if (msg == '/오오군'){
        replier.reply('감시반이다 모두들 돔황촤~!!!!!!!!!');
    } else if (msg == '/나굴이'){
        replier.reply('카지노에 가고싶은거냐굴? 갠톡 달라굴^^');
    } else if (msg == '/이르'){
        replier.reply('어쩔티비');
    } else if (msg == '/오돌개'){
        replier.reply('내가 이방을 지배하겠어!!!!!!!')
    }
    
    else if (msg.startsWith('/따라하기')) {
        const result = msg.replace('/따라하기 ', "");

        replier.reply(result);
    }
}