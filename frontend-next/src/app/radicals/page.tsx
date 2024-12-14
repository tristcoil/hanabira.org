'use client';


// pages/radicals.js

import React from 'react';
//import RadicalList from '../components/RadicalList';

const RadicalsPage = () => {
  const radicals = [
    {no: 1, symbol: '一', variants: [], strokeCount: 1, meaning: 'one', readings: '(いち,ichi,一)', frequency: 42, joyoFrequency: 50, examples: '七三丈不丘世', group: ''},
    {no: 2, symbol: '丨', variants: [], strokeCount: 1, meaning: 'line,stick', readings: '(ぼう,bō,棒)', frequency: 21, joyoFrequency: '-', examples: '中', group: ''},
    {no: 3, symbol: '丶', variants: [], strokeCount: 1, meaning: 'dot', readings: '(てん,ten,点)', frequency: 10, joyoFrequency: '-', examples: '丸主', group: ''},
    {no: 4, symbol: '丿', variants: [], strokeCount: 1, meaning: 'bend,possessive-particle-no', readings: '(の,no,ノ)', frequency: 33, joyoFrequency: '-', examples: '久之乎', group: ''},
    {no: 5, symbol: '乙', variants: ['乚'], strokeCount: 1, meaning: 'second,latter', readings: '(おつ,otsu,乙)', frequency: 42, joyoFrequency: '-', examples: '九也', group: ''},
    {no: 6, symbol: '亅', variants: [], strokeCount: 1, meaning: 'hook,hooked-stick', readings: '(はねぼう,hanebō,撥棒)', frequency: 19, joyoFrequency: '-', examples: '了事', group: ''},
    {no: 7, symbol: '二', variants: [], strokeCount: 2, meaning: 'two', readings: '(に,ni,二)', frequency: 29, joyoFrequency: '-', examples: '五井些亞', group: ''},
    {no: 8, symbol: '亠', variants: [], strokeCount: 2, meaning: 'pot,lid', readings: '(なべぶた,nabebuta,鍋蓋)', frequency: 38, joyoFrequency: '-', examples: '亡交京', group: ''},
    {no: 9, symbol: '人', variants: ['亻','𠆢'], strokeCount: 2, meaning: 'human', readings: '(ひと,hito,人)', frequency: 794, joyoFrequency: 83, examples: '仁休位今', group: ''},
    {no: 10, symbol: '儿', variants: [], strokeCount: 2, meaning: 'legs,human-underneath', readings: '(にんにょう,ninnyō,人繞)', frequency: 52, joyoFrequency: '-', examples: '兄元', group: ''},
    {no: 11, symbol: '入', variants: ['𠆢'], strokeCount: 2, meaning: 'enter', readings: '(いる,iru,入)', frequency: 28, joyoFrequency: '-', examples: '入全兩', group: ''},
    {no: 12, symbol: '八', variants: ['ハ'], strokeCount: 2, meaning: 'eight,eight-head', readings: '(はちがしら,hachigashira,八頭)', frequency: 44, joyoFrequency: '-', examples: '公六共兵', group: ''},
    {no: 13, symbol: '冂', variants: [], strokeCount: 2, meaning: 'inverted-box,window-frame', readings: '(まきがまえ,makigamae,牧構)', frequency: 50, joyoFrequency: '-', examples: '内再', group: ''},
    {no: 14, symbol: '冖', variants: [], strokeCount: 2, meaning: 'cover,wa-crown', readings: '(わかんむり,wakanmuri,ワ冠)', frequency: 30, joyoFrequency: '-', examples: '冗冠', group: ''},
    {no: 15, symbol: '冫', variants: [] , strokeCount: 2, meaning: 'ice,2-stroke-water', readings: '(にすい,nisui,二水)', frequency:  115, joyoFrequency: '-', examples: '冬冶冷凍', group: ''},
    {no: 16, symbol: '几', variants: [], strokeCount: 2, meaning: 'desk', readings: '(つくえ,tsukue,机)', frequency: 38, joyoFrequency: '-', examples: '凡', group: ''},
    {no: 17, symbol: '凵', variants: [], strokeCount: 2, meaning: 'container,inbox', readings: '(うけばこ,ukebako,受け箱)', frequency: 23, joyoFrequency: '-', examples: '凶出函', group: ''},
    {no: 18, symbol: '刀', variants: ['刂','⺈'], strokeCount: 2, meaning: 'sword', readings: '(かたな,katana,刀)', frequency: 377, joyoFrequency: 37, examples: '刀分切初利刻則前', group: ''},
    {no: 19, symbol: '力', variants: [], strokeCount: 2, meaning: 'power,force', readings: '(ちから,chikara,力)', frequency: 163, joyoFrequency: '-', examples: '力加助勉', group: ''},
    {no: 20, symbol: '勹', variants: [], strokeCount: 2, meaning: 'embrace,wrap-frame', readings: '(つつみがまえ,tsutsumigamae,包構)', frequency: 64, joyoFrequency: '-', examples: '勾包', group: ''},
    {no: 21, symbol: '匕', variants: [], strokeCount: 2, meaning: 'spoon-hi', readings: '(さじのひ,sajinohi,匕のヒ)', frequency: 19, joyoFrequency: '-', examples: '化北', group: ''},
    {no: 22, symbol: '匚', variants: [], strokeCount: 2, meaning: 'box,frame', readings: '(はこがまえ,hakogamae,匚構)', frequency: 64, joyoFrequency: '-', examples: '匣', group: ''},
    {no: 23, symbol: '亡', variants: ['匸'], strokeCount: 3, meaning: 'dead,hiding,frame', readings: '(かくしがまえ,kakushigamae,隠構)', frequency: 17, joyoFrequency: '-', examples: '亡妄忙忘盲荒望慌網', group: ''},
    {no: 24, symbol: '十', variants: [], strokeCount: 2, meaning: 'ten,complete', readings: '(じゅう,jū,十)', frequency: 55, joyoFrequency: 35, examples: '十千午半博', group: ''},
    {no: 25, symbol: '卜', variants: ['⼘','⺊'], strokeCount: 2, meaning: 'divination-to', readings: '(ぼくのと,bokunoto,卜のト)', frequency: 45, joyoFrequency: '-', examples: '占卦', group: ''},
    {no: 26, symbol: '卩', variants: ['㔾'], strokeCount: 2, meaning: 'seal', readings: '(ふしづくり,fushidzukuri,節旁)', frequency: 40, joyoFrequency: '-', examples: '印危卵', group: ''},
    {no: 27, symbol: '厂', variants: [], strokeCount: 2, meaning: 'cliff', readings: '(がんだれ,gandare,雁垂)', frequency: 129, joyoFrequency: '-', examples: '厚原', group: ''},
    {no: 28, symbol: '厶', variants: [], strokeCount: 2, meaning: 'private', readings: '(む,mu)', frequency: 40, joyoFrequency: '-', examples: '去參', group: ''},
    {no: 29, symbol: '又', variants: [], strokeCount: 2, meaning: 'again,right-hand', readings: '(また,mata)', frequency: 91, joyoFrequency: '-', examples: '友反取受', group: ''},
    {no: 30, symbol: '口', variants: [], strokeCount: 3, meaning: 'mouth,opening', readings: '(くち,kuchi)', frequency: 1146, joyoFrequency: 100, examples: '口古可名君否呉告周味命和哲唐善器', group: ''},
    {no: 31, symbol: '囗', variants: [], strokeCount: 3, meaning: 'enclosure', readings: '(くにがまえ,kunigamae,国構)', frequency: 118, joyoFrequency: '-', examples: '四回図国', group: ''},
    {no: 32, symbol: '土', variants: [], strokeCount: 3, meaning: 'earth', readings: '(つち,tsuchi)', frequency: 580, joyoFrequency: 42, examples: '土在地型城場壁壓', group: ''},
    {no: 33, symbol: '士', variants: [], strokeCount: 3, meaning: 'scholar,bachelor', readings: '(さむらい,samurai,侍)', frequency: 24, joyoFrequency: '-', examples: '士壹', group: ''},
    {no: 34, symbol: '夂', variants: [], strokeCount: 3, meaning: 'winter', readings: '(ふゆがしら,fuyugashira,冬頭)', frequency: 34, joyoFrequency: '-', examples: '夏夆', group: ''},
    {no: 35, symbol: '夊', variants: [], strokeCount: 3, meaning: 'winter-variant', readings: '(すいにょう,suinyou,夊繞)', frequency: '-', joyoFrequency: '-', examples: '-' , group: ''},
    {no: 36, symbol: '夕', variants: [], strokeCount: 3, meaning: 'evening,sunset', readings: '(ゆうべ,yūbe)', frequency: 34, joyoFrequency: '-', examples: '夕外多夜', group: ''},
    {no: 37, symbol: '大', variants: [], strokeCount: 3, meaning: 'big,very', readings: '(だい,dai)', frequency: 132, joyoFrequency: '-', examples: '大天奈奧', group: ''},
    {no: 38, symbol: '女', variants: [], strokeCount: 3, meaning: 'woman,female', readings: '(おんな,onna)', frequency: 681, joyoFrequency: 31, examples: '女好妄妻姉始姓姫', group: ''},
    {no: 39, symbol: '子', variants: [], strokeCount: 3, meaning: 'child,seed', readings: '(こ,ko)', frequency: 83, joyoFrequency: '-', examples: '子孔字學', group: ''},
    {no: 40, symbol: '宀', variants: [], strokeCount: 3, meaning: 'roof', readings: '(うかんむり,ukanmuri,ウ冠)', frequency: 246, joyoFrequency: 37, examples: '守家寒實', group: ''},
    {no: 41, symbol: '寸', variants: [], strokeCount: 3, meaning: 'sun(unit-of-measurement)', readings: '(すん,sun)', frequency: 40, joyoFrequency: '-', examples: '寸寺尊將', group: ''},
    {no: 42, symbol: '小', variants: ['⺌','⺍'], strokeCount: 3, meaning: 'small,insignificant', readings: '(ちいさい,chīsai,小さい)', frequency: 41, joyoFrequency: '-', examples: '小少', group: ''},
    {no: 43, symbol: '尢', variants: ['尤','尣'], strokeCount: 3, meaning: 'lame', readings: '(まげあし,mageashi)', frequency: 66, joyoFrequency: '-', examples: '就', group: ''},
    {no: 44, symbol: '尸', variants: [], strokeCount: 3, meaning: 'corpse', readings: '(しかばね,shikabane,屍)', frequency: 148, joyoFrequency: '-', examples: '尺局', group: ''},
    {no: 45, symbol: '屮', variants: [], strokeCount: 3, meaning: 'sprout', readings: '(てつ,tetsu)', frequency: 38, joyoFrequency: '-', examples: '屯', group: ''},
    {no: 46, symbol: '山', variants: [], strokeCount: 3, meaning: 'mountain', readings: '(やま,yama)', frequency: 636, joyoFrequency: '-', examples: '山岡岩島', group: ''},
    {no: 47, symbol: '巛', variants: ['川','巜'], strokeCount: 3, meaning: 'river', readings: '(かわ,kawa)', frequency: 26, joyoFrequency: '-', examples: '川州巡', group: ''},
    {no: 48, symbol: '工', variants: [], strokeCount: 3, meaning: 'work', readings: '(たくみ,takumi)', frequency: 17, joyoFrequency: '-', examples: '工左巫差', group: ''},
    {no: 49, symbol: '已', variants: ['己','巳'], strokeCount: 3, meaning: 'oneself', readings: '(おのれ,onore)', frequency: 20, joyoFrequency: '-', examples: '己巳', group: ''},
    {no: 50, symbol: '巾', variants: [], strokeCount: 3, meaning: 'cloth,turban,scarf', readings: '(はば,haba)', frequency: 295, joyoFrequency: '-', examples: '市布帝常', group: ''},
    {no: 51, symbol: '干', variants: [], strokeCount: 3, meaning: 'dry', readings: '(ほし,hoshi)', frequency: 9, joyoFrequency: '-', examples: '平年', group: ''},
    {no: 52, symbol: '幺', variants: [], strokeCount: 3, meaning: 'short-thread', readings: '(いとがしら,itogashira,糸頭)', frequency: 50, joyoFrequency: '-', examples: '幻幼', group: ''},
    {no: 53, symbol: '广', variants: [], strokeCount: 3, meaning: 'dotted-cliff', readings: '(まだれ,madare,麻垂)', frequency: 15, joyoFrequency: '-', examples: '序店府度座庭廣廳', group: ''},
    {no: 54, symbol: '廴', variants: [], strokeCount: 3, meaning: 'long-stride', readings: '(いんにょう,innyō,延繞)', frequency: 9, joyoFrequency: '-', examples: '延', group: ''},
    {no: 55, symbol: '廾', variants: [], strokeCount: 3, meaning: 'two-hands,twenty', readings: '(にじゅうあし,nijūashi,二十脚)', frequency: 50, joyoFrequency: '-', examples: '弁', group: ''},
    {no: 56, symbol: '弋', variants: [], strokeCount: 3, meaning: 'ceremony,shoot,arrow', readings: '(しきがまえ,shikigamae,式構)', frequency: 15, joyoFrequency: '-', examples: '式弑', group: ''},
    {no: 57, symbol: '弓', variants: [], strokeCount: 3, meaning: 'bow', readings: '(ゆみ,yumi)', frequency: 165, joyoFrequency: '-', examples: '弓引弟弱彌', group: ''},
    {no: 58, symbol: '彐', variants: ['彑'], strokeCount: 3, meaning: 'pig`s-head', readings: '(けいがしら,keigashira,彑頭)', frequency: 25, joyoFrequency: '-', examples: '彖', group: ''},
    {no: 59, symbol: '彡', variants: [], strokeCount: 3, meaning: 'hair,bristle,stubble,beard', readings: '(さんづくり,sandzukuri,三旁)', frequency: 62, joyoFrequency: '-', examples: '形彦', group: ''},
    {no: 60, symbol: '彳', variants: [], strokeCount: 3, meaning: 'step', readings: '(ぎょうにんべん,gyouninben,行人偏)', frequency: 215, joyoFrequency: '-', examples: '役彼後得徳徼', group: ''},
    {no: 61, symbol: '心', variants: ['忄','⺗'], strokeCount: 4, meaning: 'heart', readings: '(りっしんべん,risshinben,立心偏)', frequency: 1115, joyoFrequency: 67, examples: '必忙忌性悪情想', group: ''},
    {no: 62, symbol: '戈', variants: [], strokeCount: 4, meaning: 'spear,halberd', readings: '(かのほこ,kanohoko)', frequency: 116, joyoFrequency: '-', examples: '成式弐戦', group: ''},
    {no: 63, symbol: '戸', variants: ['戶','户'], strokeCount: 4, meaning: 'door,house', readings: '(とびらのと,tobiranoto)', frequency: 44, joyoFrequency: '-', examples: '戸戻所', group: ''},
    {no: 64, symbol: '手', variants: ['扌','龵'], strokeCount: 4, meaning: 'hand', readings: '(て,te)', frequency: 1203, joyoFrequency: 68, examples: '手才挙拜拳掌掣擧(持掛打批技抱押)', group: ''},
    {no: 65, symbol: '支', variants: [], strokeCount: 4, meaning: 'branch', readings: '(しにょう,shinyō,支繞)', frequency: 26, joyoFrequency: '-', examples: '攱攲', group: ''},
    {no: 66, symbol: '攵', variants: ['攴'], strokeCount: 4, meaning: 'strike,whip', readings: '(のぶん,nobun,ノ文)', frequency: 296, joyoFrequency: '-', examples: '收敍數斅', group: ''},
    {no: 67, symbol: '文', variants: [], strokeCount: 4, meaning: 'script,literature', readings: '(ぶん,bun)', frequency: 26, joyoFrequency: '-', examples: '文斊斈斌斐斑斕', group: ''},
    {no: 68, symbol: '斗', variants: [], strokeCount: 4, meaning: 'dipper,measuring-scoop', readings: '(とます,tomasu)', frequency: 32, joyoFrequency: '-', examples: '料斡', group: ''},
    {no: 69, symbol: '斤', variants: [], strokeCount: 4, meaning: 'axe', readings: '(おの,ono,斧)', frequency: 55, joyoFrequency: '-', examples: '斦斧新斥斬斷', group: ''},
    {no: 70, symbol: '方', variants: [], strokeCount: 4, meaning: 'way,square,raft', readings: '(ほう,hō)', frequency: 92, joyoFrequency: '-', examples: '方放旅族', group: ''},
    {no: 71, symbol: '无', variants: ['旡'], strokeCount: 4, meaning: 'have-not', readings: '(むにょう,munyō)', frequency: 12, joyoFrequency: '-', examples: '无旡既旣', group: ''},
    {no: 72, symbol: '日', variants: [], strokeCount: 4, meaning: 'sun,day', readings: '(にち,nichi)', frequency: 453, joyoFrequency: 51, examples: '日白百明的映時晩', group: ''},
    {no: 73, symbol: '曰', variants: [], strokeCount: 4, meaning: 'say', readings: '(いわく,iwaku)', frequency: 37, joyoFrequency: '-', examples: '書最晉曷曹曾', group: ''},
    {no: 74, symbol: '月', variants: ['⺝'], strokeCount: 4, meaning: 'moon,month;body,flesh', readings: '(つき,tsuki)', frequency: 69, joyoFrequency: 47, examples: '有服青朝', group: ''},
    {no: 75, symbol: '木', variants: [], strokeCount: 4, meaning: 'tree', readings: '(き,ki)', frequency: 1369, joyoFrequency: 86, examples: '木杢板相根森楽機末本杉林', group: ''},
    {no: 76, symbol: '欠', variants: [], strokeCount: 4, meaning: 'yawn,lack', readings: '(あくび,akubi)', frequency: 235, joyoFrequency: '-', examples: '欣欽欧欲歌', group: ''},
    {no: 77, symbol: '止', variants: [], strokeCount: 4, meaning: 'stop', readings: '(とめる,tomeru)', frequency: 99, joyoFrequency: '-', examples: '正歩此步武歪歲', group: ''},
    {no: 78, symbol: '歹', variants: ['歺'], strokeCount: 4, meaning: 'death,decay', readings: '(がつへん,gatsuhen,歹偏)', frequency: 231, joyoFrequency: '-', examples: '死列殕', group: ''},
    {no: 79, symbol: '殳', variants: [], strokeCount: 4, meaning: 'weapon,lance', readings: '(ほこつくり,hokotsukuri)', frequency: 93, joyoFrequency: '-', examples: '役投殴殷', group: ''},
    {no: 80, symbol: '毋', variants: ['母','⺟'], strokeCount: 4, meaning: 'do-not;mother', readings: '(なかれ-nakare;はは,haha)', frequency: 16, joyoFrequency: '-', examples: '毋母毎姆梅', group: ''},
    {no: 81, symbol: '比', variants: [], strokeCount: 4, meaning: 'compare,compete', readings: '(くらべる,kuraberu)', frequency: 21, joyoFrequency: '-', examples: '皆批毕毖毘毚', group: ''},
    {no: 82, symbol: '毛', variants: [], strokeCount: 4, meaning: 'fur,hair', readings: '(け,ke)', frequency: 211, joyoFrequency: '-', examples: '毟毡毦毫毳耗', group: ''},
    {no: 83, symbol: '氏', variants: [], strokeCount: 4, meaning: 'clan', readings: '(うじ,uji)', frequency: 10, joyoFrequency: '-', examples: '氏民紙婚氓', group: ''},
    {no: 84, symbol: '气', variants: [], strokeCount: 4, meaning: 'steam,breath', readings: '(きがまえ,kigamae,気構)', frequency: 17, joyoFrequency: '-', examples: '気汽氧', group: ''},
    {no: 85, symbol: '水', variants: ['氵','氺'], strokeCount: 4, meaning: 'water', readings: '(みず,mizu)', frequency: 1595, joyoFrequency: 98, examples: '水永泳決治海演漢瀬', group: ''},
    {no: 86, symbol: '火', variants: ['灬'], strokeCount: 4, meaning: 'fire', readings: '(ひ,hi)', frequency: 639, joyoFrequency: '-', examples: '火灯毯爆(烈烹焦然煮)', group: ''},
    {no: 87, symbol: '爪', variants: ['爫','⺥','⺤'], strokeCount: 4, meaning: 'claw,nail,talon', readings: '(つめ,tsume)', frequency: 36, joyoFrequency: '-', examples: '爬爯爭爰爲', group: ''},
    {no: 88, symbol: '父', variants: [], strokeCount: 4, meaning: 'father', readings: '(ちち,chichi)', frequency: 10, joyoFrequency: '-', examples: '斧釜', group: ''},
    {no: 89, symbol: '爻', variants: [], strokeCount: 4, meaning: 'mix,twine,cross', readings: '(こう,kō)', frequency: 16, joyoFrequency: '-', examples: '爼爽爾', group: ''},
    {no: 90, symbol: '爿', variants: ['丬'], strokeCount: 4, meaning: 'split-wood', readings: '(しょうへん,shōhen,爿偏)', frequency: 48, joyoFrequency: '-', examples: '牀奘牃', group: ''},
    {no: 91, symbol: '片', variants: [], strokeCount: 4, meaning: '(a)-slice', readings: '(かた,kata)', frequency: 77, joyoFrequency: '-', examples: '版牌牒', group: ''},
    {no: 92, symbol: '牙', variants: [], strokeCount: 4, meaning: 'fang', readings: '(きばへん,kibahen,牙偏)', frequency: 9, joyoFrequency: '-', examples: '芽呀牚', group: ''},
    {no: 93, symbol: '牛', variants: ['牜','⺧'], strokeCount: 4, meaning: 'cow', readings: '(うし,ushi)', frequency: 233, joyoFrequency: '-', examples: '告牟牧物特解', group: ''},
    {no: 94, symbol: '犬', variants: ['犭'], strokeCount: 4, meaning: 'dog', readings: '(いぬ,inu)', frequency: 444, joyoFrequency: '-', examples: '犬犯狂狙狗献獣', group: ''},
    {no: 95, symbol: '玄', variants: [], strokeCount: 5, meaning: 'dark,profound', readings: '(げん,gen)', frequency: 6, joyoFrequency: '-', examples: '弦玆', group: ''},
    {no: 96, symbol: '王', variants: ['玉','玊','⺩'], strokeCount: 4, meaning: 'king;ball,jade', readings: '(おう-ō;たま,tama)', frequency: 473, joyoFrequency: '-', examples: '王玉主弄皇理差聖', group: ''},
    {no: 97, symbol: '瓜', variants: [], strokeCount: 5, meaning: 'melon', readings: '(うり,uri)', frequency: 55, joyoFrequency: '-', examples: '呱瓞', group: ''},
    {no: 98, symbol: '瓦', variants: [], strokeCount: 5, meaning: 'tile', readings: '(かわら,kawara)', frequency: 174, joyoFrequency: '-', examples: '瓧瓮甄', group: ''},
    {no: 99, symbol: '甘', variants: [], strokeCount: 5, meaning: 'sweet', readings: '(あまい,amai)', frequency: 22, joyoFrequency: '-', examples: '柑甜酣', group: ''},
    {no: 100, symbol: '生', variants: [], strokeCount: 5, meaning: 'life', readings: '(うまれる,umareru)', frequency: 22, joyoFrequency: '-', examples: '牲笙甥', group: ''},
    {no: 101, symbol: '用', variants: ['甩'], strokeCount: 5, meaning: 'use;(throw)', readings: '(もちいる,mochīru)', frequency: 10, joyoFrequency: '-', examples: '佣甬甯', group: ''},
    {no: 102, symbol: '田', variants: [], strokeCount: 5, meaning: 'field', readings: '(た,ta)', frequency: 192, joyoFrequency: '-', examples: '田町思留略番', group: ''},
    {no: 103, symbol: '疋', variants: ['⺪'], strokeCount: 5, meaning: 'bolt-of-cloth', readings: '(ひき,hiki)', frequency: 15, joyoFrequency: '-', examples: '疏楚胥延', group: ''},
    {no: 104, symbol: '疒', variants: [], strokeCount: 5, meaning: 'sickness', readings: '(やまいだれ,yamaidare,病垂)', frequency: 526, joyoFrequency: '-', examples: '病症痛癌癖', group: ''},
    {no: 105, symbol: '癶', variants: [], strokeCount: 5, meaning: 'footsteps', readings: '(はつがしら,hatsugashira,発頭)', frequency: 15, joyoFrequency: '-', examples: '発登', group: ''},
    {no: 106, symbol: '白', variants: [], strokeCount: 5, meaning: 'white', readings: '(しろ,shiro)', frequency: 109, joyoFrequency: '-', examples: '皃的皆皇', group: ''},
    {no: 107, symbol: '皮', variants: [], strokeCount: 5, meaning: 'skin', readings: '(けがわ,kegawa,毛皮)', frequency: 94, joyoFrequency: '-', examples: '披彼波', group: ''},
    {no: 108, symbol: '皿', variants: [], strokeCount: 5, meaning: 'dish', readings: '(さら,sara)', frequency: 129, joyoFrequency: '-', examples: '盂盉盍監蘯', group: ''},
    {no: 109, symbol: '目', variants: [], strokeCount: 5, meaning: 'eye', readings: '(め,me)', frequency: 647, joyoFrequency: '-', examples: '目見具省眠眼観覧', group: ''},
    {no: 110, symbol: '矛', variants: [], strokeCount: 5, meaning: 'spear,pike', readings: '(むのほこ,munohoko)', frequency: 65, joyoFrequency: '-', examples: '茅矜', group: ''},
    {no: 111, symbol: '矢', variants: [], strokeCount: 5, meaning: 'arrow', readings: '(や,ya)', frequency: 64, joyoFrequency: '-', examples: '医族矩', group: ''},
    {no: 112, symbol: '石', variants: [], strokeCount: 5, meaning: 'stone', readings: '(いし,ishi)', frequency: 499, joyoFrequency: '-', examples: '石岩砂破碑碧', group: ''},
    {no: 113, symbol: '示', variants: ['礻'], strokeCount: 5, meaning: 'altar,display', readings: '(しめす,shimesu)', frequency: 213, joyoFrequency: '-', examples: '示奈祭禁礼社神視福', group: ''},
    {no: 114, symbol: '禸', variants: [], strokeCount: 5, meaning: 'track', readings: '(ぐうのあし,gūnoashi)', frequency: 12, joyoFrequency: '-', examples: '禹禺禽', group: ''},
    {no: 115, symbol: '禾', variants: [], strokeCount: 5, meaning: 'two-branch-tree', readings: '(のぎ,nogi,ノ木)', frequency: 431, joyoFrequency: '-', examples: '利私季和科香秦穀', group: ''},
    {no: 116, symbol: '穴', variants: [], strokeCount: 5, meaning: 'cave', readings: '(あな,ana)', frequency: 298, joyoFrequency: '-', examples: '空突窅窘窩窶竇', group: ''},
    {no: 117, symbol: '立', variants: [], strokeCount: 5, meaning: 'stand,erect', readings: '(たつ,tatsu)', frequency: 101, joyoFrequency: '-', examples: '立音産翌意新端親競', group: ''},
    {no: 118, symbol: '竹', variants: ['⺮'], strokeCount: 6, meaning: 'bamboo', readings: '(たけ,take)', frequency: 953, joyoFrequency: '-', examples: '竺笑第等簡', group: ''},
    {no: 119, symbol: '米', variants: [], strokeCount: 6, meaning: 'rice', readings: '(こめ,kome)', frequency: 318, joyoFrequency: '-', examples: '料断奥糊麟', group: ''},
    {no: 120, symbol: '糸', variants: ['糹'], strokeCount: 6, meaning: 'thread,string', readings: '(いと,ito)', frequency: 823, joyoFrequency: 49, examples: '系級紙素細組終絵紫', group: ''},
    {no: 121, symbol: '缶', variants: [], strokeCount: 6, meaning: 'can,earthenware-jar', readings: '(かん,kan)', frequency: 77, joyoFrequency: '-', examples: '缶缸窑陶', group: ''},
    {no: 122, symbol: '罒', variants: ['网','罓','⺲','⺳'], strokeCount: 5, meaning: 'net', readings: '(あみがしら,amigashira,網頭)', frequency: 163, joyoFrequency: '-', examples: '買置羅', group: ''},
    {no: 123, symbol: '羊', variants: ['⺶','⺷'], strokeCount: 6, meaning: 'sheep', readings: '(ひつじ,hitsuji)', frequency: 156, joyoFrequency: '-', examples: '着羚翔着', group: ''},
    {no: 124, symbol: '羽', variants: [], strokeCount: 6, meaning: 'feather,wing', readings: '(はね,hane)', frequency: 220, joyoFrequency: '-', examples: '習翀翁翔', group: ''},
    {no: 125, symbol: '耂', variants: ['老','⺹'], strokeCount: 4, meaning: 'old', readings: '(ろう,rō)', frequency: 22, joyoFrequency: '-', examples: '耆孝耋', group: ''},
    {no: 126, symbol: '而', variants: [], strokeCount: 6, meaning: 'rake,beard', readings: '(しかして,shikashite)', frequency: 22, joyoFrequency: '-', examples: '耎耐耑', group: ''},
    {no: 127, symbol: '耒', variants: [], strokeCount: 6, meaning: 'plow', readings: '(らいすき,raisuki)', frequency: 84, joyoFrequency: '-', examples: '耔耝耨耰', group: ''},
    {no: 128, symbol: '耳', variants: [], strokeCount: 6, meaning: 'ear', readings: '(みみ,mimi)', frequency: 172, joyoFrequency: '-', examples: '取聞職叢', group: ''},
    {no: 129, symbol: '聿', variants: ['⺻'], strokeCount: 6, meaning: 'brush', readings: '(ふでづくり,fudezukuri,聿旁)', frequency: 19, joyoFrequency: '-', examples: '律書建', group: ''},
    {no: 130, symbol: '肉', variants: ['⺼','月'], strokeCount: 6, meaning: 'meat', readings: '(にく,niku)', frequency: 674, joyoFrequency: '-', examples: '肉肖股胃腅脤', group: ''},
    {no: 131, symbol: '臣', variants: [], strokeCount: 7, meaning: 'minister,official', readings: '(しん,shin)', frequency: 16, joyoFrequency: '-', examples: '臥宦蔵', group: ''},
    {no: 132, symbol: '自', variants: [], strokeCount: 6, meaning: 'oneself', readings: '(みずから,mizukara)', frequency: 34, joyoFrequency: '-', examples: '自臫臬臲', group: ''},
    {no: 133, symbol: '至', variants: [], strokeCount: 6, meaning: 'arrive', readings: '(いたる,itaru)', frequency: 24, joyoFrequency: '-', examples: '致臸臺', group: ''},
    {no: 134, symbol: '臼', variants: [], strokeCount: 6, meaning: 'mortar', readings: '(うす,usu)', frequency: 71, joyoFrequency: '-', examples: '桕舅舂鼠插', group: ''},
    {no: 135, symbol: '舌', variants: [], strokeCount: 6, meaning: 'tongue', readings: '(した,shita)', frequency: 31, joyoFrequency: '-', examples: '乱适話舍', group: ''},
    {no: 136, symbol: '舛', variants: [], strokeCount: 7, meaning: 'opposite', readings: '(ます,masu)', frequency: 10, joyoFrequency: '-', examples: '舛舜舞', group: ''},
    {no: 137, symbol: '舟', variants: [], strokeCount: 6, meaning: 'boat', readings: '(ふね,fune)', frequency: 197, joyoFrequency: '-', examples: '航船艦', group: ''},
    {no: 138, symbol: '艮', variants: [], strokeCount: 6, meaning: 'stopping', readings: '(うしとら,ushitora,丑寅)', frequency: 5, joyoFrequency: '-', examples: '良飲很', group: ''},
    {no: 139, symbol: '色', variants: [], strokeCount: 6, meaning: 'colour,prettiness', readings: '(いろ,iro)', frequency: 21, joyoFrequency: '-', examples: '色艴艷', group: ''},
    {no: 140, symbol: '艹', variants: ['艸','䒑'], strokeCount: 3, meaning: 'grass,vegetation', readings: '(くさ,kusa,草)', frequency: 1902, joyoFrequency: '-', examples: '共花(37)英苦草茶落幕靴鞄薬', group: ''},
    {no: 141, symbol: '虍', variants: [], strokeCount: 6, meaning: 'tiger-stripes', readings: '(とらかんむり,torakanmuri,虎冠)', frequency: 114, joyoFrequency: '-', examples: '虎虐彪虒', group: ''},
    {no: 142, symbol: '虫', variants: [], strokeCount: 6, meaning: 'insect', readings: '(むし,mushi)', frequency: 1067, joyoFrequency: '-', examples: '蚯蚓強触蟻蟹', group: ''},
    {no: 143, symbol: '血', variants: [], strokeCount: 6, meaning: 'blood', readings: '(ち,chi)', frequency: 60, joyoFrequency: '-', examples: '洫衁衅衆', group: ''},
    {no: 144, symbol: '行', variants: [], strokeCount: 6, meaning: 'go,do', readings: '(ぎょう,gyō)', frequency: 53, joyoFrequency: '-', examples: '行衍術衝', group: ''},
    {no: 145, symbol: '衣', variants: ['衤'], strokeCount: 6, meaning: 'clothes', readings: '(ころも,koromo)', frequency: 607, joyoFrequency: '-', examples: '衣装裁(初被複)', group: ''},
    {no: 146, symbol: '西', variants: ['襾','覀'], strokeCount: 6, meaning: 'west', readings: '(にし,nishi)', frequency: 29, joyoFrequency: '-', examples: '西要覊', group: ''},
    {no: 147, symbol: '見', variants: [], strokeCount: 7, meaning: 'see', readings: '(みる,miru)', frequency: 161, joyoFrequency: '-', examples: '規親覺觀', group: ''},
    {no: 148, symbol: '角', variants: [], strokeCount: 7, meaning: 'horn', readings: '(つの,tsuno)', frequency: 158, joyoFrequency: '-', examples: '觚解觕觥觸', group: ''},
    {no: 149, symbol: '言', variants: ['訁'], strokeCount: 7, meaning: 'speech', readings: '(げん,koto)', frequency: 861, joyoFrequency: 54, examples: '誁詋詔評詗詥試詧', group: ''},
    {no: 150, symbol: '谷', variants: [], strokeCount: 7, meaning: 'valley', readings: '(たに,tani)', frequency: 54, joyoFrequency: '-', examples: '谿豀谸', group: ''},
    {no: 151, symbol: '豆', variants: [], strokeCount: 7, meaning: 'bean', readings: '(まめ,mame)', frequency: 68, joyoFrequency: '-', examples: '豈豐豎', group: ''},
    {no: 152, symbol: '豕', variants: [], strokeCount: 7, meaning: 'pig', readings: '(いのこ,inoko,猪子)', frequency: 148, joyoFrequency: '-', examples: '豕豚象', group: ''},
    {no: 153, symbol: '豸', variants: [], strokeCount: 7, meaning: 'cat,badger', readings: '(むじな,mujina,狢)', frequency: 140, joyoFrequency: '-', examples: '豹貌貓貉', group: ''},
    {no: 154, symbol: '貝', variants: [], strokeCount: 7, meaning: 'shell', readings: '(かい,kai)', frequency: 277, joyoFrequency: 32, examples: '財賊賜贛貧貨貫貿', group: ''},
    {no: 155, symbol: '赤', variants: [], strokeCount: 7, meaning: 'red,bare', readings: '(あか,aka)', frequency: 31, joyoFrequency: '-', examples: '赫赭', group: ''},
    {no: 156, symbol: '走', variants: ['赱'], strokeCount: 7, meaning: 'run', readings: '(はしる,hashiru)', frequency: 285, joyoFrequency: '-', examples: '赴起超', group: ''},
    {no: 157, symbol: '足', variants: ['⻊'], strokeCount: 7, meaning: 'foot', readings: '(あし,ashi)', frequency: 580, joyoFrequency: '-', examples: '跑跨跟跪路', group: ''},
    {no: 158, symbol: '身', variants: [], strokeCount: 7, meaning: 'body', readings: '(み,mi)', frequency: 97, joyoFrequency: '-', examples: '躬躲軀', group: ''},
    {no: 159, symbol: '車', variants: [], strokeCount: 7, meaning: 'cart,car', readings: '(くるま,kuruma)', frequency: 361, joyoFrequency: '-', examples: '軌軟較軍載', group: ''},
    {no: 160, symbol: '辛', variants: [], strokeCount: 7, meaning: 'spicy,bitter', readings: '(からい,karai)', frequency: 36, joyoFrequency: '-', examples: '辜辟辣辦辨', group: ''},
    {no: 161, symbol: '辰', variants: [], strokeCount: 7, meaning: 'morning', readings: '(しんのたつ,shinnotatsu,辰のたつ)', frequency: 15, joyoFrequency: '-', examples: '辱農', group: ''},
    {no: 162, symbol: '⻌', variants: ['辵','辶'], strokeCount: 3, meaning: 'walk', readings: '(しんにゅう／しんにょう,shinnyū,shinnyō)之繞', frequency: 381, joyoFrequency: '38', examples: '巡迎通追逃迎進', group: ''},
    {no: 163, symbol: '邑', variants: ['⻏','阝'], strokeCount: 3, meaning: 'town(阝right)', readings: '(むら,mura)', frequency: 350, joyoFrequency: 30, examples: '那邦郎部郭都鄉', group: ''},
    {no: 164, symbol: '酉', variants: [], strokeCount: 7, meaning: 'sake-(rice-based-alcoholic-beverage)', readings: '(とり,tori)', frequency: 290, joyoFrequency: '-', examples: '酒醉油醒酸', group: ''},
    {no: 165, symbol: '釆', variants: [], strokeCount: 7, meaning: 'divide,distinguish,choose', readings: '(のごめ,nogome,ノ米)', frequency: 14, joyoFrequency: '-', examples: '釉釋', group: ''},
    {no: 166, symbol: '里', variants: [], strokeCount: 7, meaning: 'village,mile', readings: '(さと,sato)', frequency: 14, joyoFrequency: '-', examples: '野野', group: ''},
    {no: 167, symbol: '金', variants: ['釒'], strokeCount: 8, meaning: 'metal,gold', readings: '(かね,kane)', frequency: 806, joyoFrequency: '-', examples: '銀銅釘銳鋞鋙鉒鉍鉗鈡鈠', group: ''},
    {no: 168, symbol: '長', variants: ['镸'], strokeCount: 8, meaning: 'long,grow;leader', readings: '(ながい-nagai;ちょう,chō)', frequency: 55, joyoFrequency: '-', examples: '長', group: ''},
    {no: 169, symbol: '門', variants: [], strokeCount: 8, meaning: 'gate', readings: '(もん,mon)', frequency: 246, joyoFrequency: '-', examples: '間閑関闘閉開閏間', group: ''},
    {no: 170, symbol: '阜', variants: ['⻖','阝'], strokeCount: 3, meaning: 'mound,dam(阝left)', readings: '(ぎふのふ,gifunofu,岐阜の阜)', frequency: 348, joyoFrequency: 30, examples: '阪防阻陆陘院险陳', group: ''},
    {no: 171, symbol: '隶', variants: [], strokeCount: 8, meaning: 'slave,capture', readings: '(れいづくり,reidzukuri,隷旁)', frequency: 12, joyoFrequency: '-', examples: '隸隺', group: ''},
    {no: 172, symbol: '隹', variants: [], strokeCount: 8, meaning: 'old-bird', readings: '(ふるとり,furutori,古鳥)', frequency: 233, joyoFrequency: '-', examples: '雀集雁难雀雅', group: ''},
    {no: 173, symbol: '雨', variants: ['⻗'], strokeCount: 8, meaning: 'rain', readings: '(あめ,ame)', frequency: 298, joyoFrequency: '-', examples: '雾霜雪霸雲霧', group: ''},
    {no: 174, symbol: '青', variants: ['靑'], strokeCount: 8, meaning: 'green,blue', readings: '(あお,ao)', frequency: 17, joyoFrequency: '-', examples: '靕靖靜', group: ''},
    {no: 175, symbol: '非', variants: [], strokeCount: 8, meaning: 'wrong', readings: '(あらず,arazu)', frequency: 25, joyoFrequency: '-', examples: '靠靠靟', group: ''},
    {no: 176, symbol: '面', variants: ['靣'], strokeCount: 9, meaning: 'face', readings: '(めん,men)', frequency: 66, joyoFrequency: '-', examples: '靦靨', group: ''},
    {no: 177, symbol: '革', variants: [], strokeCount: 9, meaning: 'leather,rawhide', readings: '(かくのかわ,kakunokawa)', frequency: 305, joyoFrequency: '-', examples: '靴鞍鞅鞍鞭', group: ''},
    {no: 178, symbol: '韋', variants: [], strokeCount: 9, meaning: 'tanned-leather', readings: '(なめしがわ,nameshigawa)', frequency: 100, joyoFrequency: '-', examples: '韋韓韜', group: ''},
    {no: 179, symbol: '韭', variants: [], strokeCount: 9, meaning: 'leek', readings: '(にら,nira)', frequency: 20, joyoFrequency: '-', examples: '韱韲', group: ''},
    {no: 180, symbol: '音', variants: [], strokeCount: 9, meaning: 'sound', readings: '(おと,oto)', frequency: 43, joyoFrequency: '-', examples: '韶韻韾', group: ''},
    {no: 181, symbol: '頁', variants: [], strokeCount: 9, meaning: 'big-shell', readings: '(おおがい,ōgai,大貝)', frequency: 372, joyoFrequency: '-', examples: '頃項順須領頭頩頂', group: ''},
    {no: 182, symbol: '風', variants: ['𠘨'], strokeCount: 9, meaning: 'wind', readings: '(かぜ,kaze)', frequency: 182, joyoFrequency: '-', examples: '風颱飄颿颪', group: ''},
    {no: 183, symbol: '飛', variants: [], strokeCount: 9, meaning: 'fly', readings: '(とぶ,tobu)', frequency: 92, joyoFrequency: '-', examples: '飜飝', group: ''},
    {no: 184, symbol: '食', variants: ['飠','𩙿'], strokeCount: 9, meaning: 'eat,food', readings: '(しょく,shoku)', frequency: 403, joyoFrequency: '-', examples: '飯飲餓餘餐養', group: ''},
    {no: 185, symbol: '首', variants: [], strokeCount: 9, meaning: 'neck,head', readings: '(くび,kubi)', frequency: 20, joyoFrequency: '-', examples: '馗馘', group: ''},
    {no: 186, symbol: '香', variants: [], strokeCount: 9, meaning: 'fragrant', readings: '(においこう,nioikō)', frequency: 37, joyoFrequency: '-', examples: '馨', group: ''},
    {no: 187, symbol: '馬', variants: [], strokeCount: 10, meaning: 'horse', readings: '(うま,uma)', frequency: 472, joyoFrequency: '-', examples: '馮馴馳駐驚', group: ''},
    {no: 188, symbol: '骨', variants: [], strokeCount: 10, meaning: 'bone', readings: '(ほね,hone)', frequency: 185, joyoFrequency: '-', examples: '骼髒髀骿骾', group: ''},
    {no: 189, symbol: '高', variants: ['髙'], strokeCount: 10, meaning: 'tall,high', readings: '(たかい,takai)', frequency: 34, joyoFrequency: '-', examples: '髚髛', group: ''},
    {no: 190, symbol: '髟', variants: [], strokeCount: 10, meaning: 'hair', readings: '(かみがしら,kamigashira,髪頭)', frequency: 243, joyoFrequency: '-', examples: '髮鬚鬆鬍髦', group: ''},
    {no: 191, symbol: '鬥', variants: [], strokeCount: 10, meaning: 'fight', readings: '(とうがまえ,tōgamae,闘構)', frequency: 23, joyoFrequency: '-', examples: '鬧鬪', group: ''},
    {no: 192, symbol: '鬯', variants: [], strokeCount: 10, meaning: 'herbs,sacrificial-wine', readings: '(ちょう,chō)', frequency: 8, joyoFrequency: '-', examples: '鬰鬱', group: ''},
    {no: 193, symbol: '鬲', variants: [], strokeCount: 10, meaning: 'tripod,cauldron', readings: '(かなえ,kanae)', frequency: 73, joyoFrequency: '-', examples: '鬶鬷鬸', group: ''},
    {no: 194, symbol: '鬼', variants: [], strokeCount: 10, meaning: 'ghost,demon', readings: '(おに,oni)', frequency: 141, joyoFrequency: '-', examples: '魂魁鬽魄', group: ''},
    {no: 195, symbol: '魚', variants: [], strokeCount: 11, meaning: 'fish', readings: '(うお,uo)', frequency: 571, joyoFrequency: '-', examples: '鯉鮑魛魜魝魞魟魠', group: ''},
    {no: 196, symbol: '鳥', variants: [], strokeCount: 11, meaning: 'bird', readings: '(とり,tori)', frequency: 750, joyoFrequency: '-', examples: '鳫鳮鳱鳳鳴鳿雞鳴鴻鴛', group: ''},
    {no: 197, symbol: '鹵', variants: [], strokeCount: 11, meaning: 'salt', readings: '(ろ,ro)', frequency: 44, joyoFrequency: '-', examples: '鹹鹼鹽', group: ''},
    {no: 198, symbol: '鹿', variants: [], strokeCount: 11, meaning: 'deer', readings: '(しか,shika)', frequency: 104, joyoFrequency: '-', examples: '塵麃麋麉麟', group: ''},
    {no: 199, symbol: '麦', variants: ['麥'], strokeCount: 7, meaning: 'wheat', readings: '(むぎ,mugi,麦)', frequency: 131, joyoFrequency: '-', examples: '麴麵麱麨麺', group: ''},
    {no: 200, symbol: '麻', variants: [], strokeCount: 11, meaning: 'hemp,flax', readings: '(あさ,asa)', frequency: 34, joyoFrequency: '-', examples: '麼魔', group: ''},
    {no: 201, symbol: '黄', variants: ['黃'], strokeCount: 11, meaning: 'yellow', readings: '(きいろ,kīro,黄色)', frequency: 42, joyoFrequency: '-', examples: '黊黌', group: ''},
    {no: 202, symbol: '黍', variants: [], strokeCount: 12, meaning: 'millet', readings: '(きび,kibi)', frequency: 46, joyoFrequency: '-', examples: '黏黎', group: ''},
    {no: 203, symbol: '黒', variants: ['黑'], strokeCount: 11, meaning: 'black', readings: '(くろ,kuro)', frequency: 172, joyoFrequency: '-', examples: '點黛黱黨', group: ''},
    {no: 204, symbol: '黹', variants: [], strokeCount: 12, meaning: 'embroidery,needlework', readings: '(ふつ,futsu,黻)', frequency: 8, joyoFrequency: '-', examples: '黼黻', group: ''},
    {no: 205, symbol: '黽', variants: [], strokeCount: 13, meaning: 'frog,amphibian', readings: '(べん,ben)', frequency: 40, joyoFrequency: '-', examples: '黿鼈', group: ''},
    {no: 206, symbol: '鼎', variants: [], strokeCount: 13, meaning: 'sacrificial-tripod', readings: '(かなえ,kanae)', frequency: 14, joyoFrequency: '-', examples: '鼏鼒', group: ''},
    {no: 207, symbol: '鼓', variants: [], strokeCount: 13, meaning: 'drum', readings: '(つづみ,tsudzumi)', frequency: 46, joyoFrequency: '-', examples: '鼗鼘', group: ''},
    {no: 208, symbol: '鼠', variants: [], strokeCount: 13, meaning: 'rat,mouse', readings: '(ねずみ,nezumi)', frequency: 92, joyoFrequency: '-', examples: '鼢鼣鼤', group: ''},
    {no: 209, symbol: '鼻', variants: [], strokeCount: 14, meaning: 'nose', readings: '(はな,hana)', frequency: 49, joyoFrequency: '-', examples: '鼼鼽鼿', group: ''},
    {no: 210, symbol: '齊', variants: [], strokeCount: 14, meaning: 'even,uniformly', readings: '(せい,sei,斉)', frequency: 18, joyoFrequency: '-', examples: '齋齏齏', group: ''},
    {no: 211, symbol: '歯', variants: ['齒'], strokeCount: 12, meaning: 'tooth,molar', readings: '(は,ha)', frequency: 162, joyoFrequency: '-', examples: '齡齠齗', group: ''},
    {no: 212, symbol: '竜', variants: ['龍'], strokeCount: 10, meaning: 'dragon', readings: '(りゅう,ryū)', frequency: 14, joyoFrequency: '-', examples: '龖龘', group: ''},
    {no: 213, symbol: '亀', variants: ['龜'], strokeCount: 11, meaning: 'turtle,tortoise', readings: '(かめ,kame)', frequency: 24, joyoFrequency: '-', examples: '龝', group: ''},
    {no: 214, symbol: '龠', variants: [], strokeCount: 17, meaning: 'flute', readings: '(やく,yaku)', frequency: 19, joyoFrequency: '-', examples: '龣', group: ''}
    ];

  
  // [
  //   {
  //     no: 1,
  //     symbol: '一',
  //     variants: [],
  //     strokeCount: 1,
  //     meaning: 'one',
  //     readings: 'いち (ichi), 一',
  //     frequency: 42,
  //     joyoFrequency: 50,
  //     examples: '七, 三, 丈, 不, 丘, 世',
  //     group: '',
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Kanji Radicals</h1>
        <p className="text-xs text-center mb-8">
        Learning Kanji radicals can be highly beneficial while studying Kanji. 
        Radicals are the building blocks of Kanji characters, and understanding them can help you break down complex characters into simpler, recognizable parts. 
        This not only makes Kanji easier to remember but also aids in deciphering the meanings and pronunciations of unfamiliar characters by identifying their component parts.
        Knowing radicals can help you creating your own Kanji mnemonic hints.
      </p>
        <RadicalList radicals={radicals} />
      </div>
    </div>
  );
};

export default RadicalsPage;


// ---------------------------------------------------------- //


// components/RadicalList.js

//import React from 'react';
//import RadicalCard from './RadicalCard';

const RadicalList = ({ radicals }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {radicals.map((radical) => (
        <RadicalCard key={radical.no} radical={radical} />
      ))}
    </div>
  );
};

//export default RadicalList;




// -----------------------------------


// components/RadicalCard.js

//import React from 'react';

const RadicalCard = ({ radical }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-semibold">No. {radical.no}</div>
        <div className="text-sm text-gray-600">Stroke Count: {radical.strokeCount}</div>
      </div>
      <div className="flex flex-col items-center mb-4">
        <div className="text-5xl mb-2">{radical.symbol}</div>
        {radical.variants.length > 0 && (
          <div className="text-lg text-gray-500 mb-2">
            Variants: {radical.variants.join(', ')}
          </div>
        )}
        <div className="text-xl font-semibold mb-2">{radical.meaning}</div>
        <div className="text-gray-600 mb-2">Readings: {radical.readings}</div>
      </div>
      <div className="text-gray-700 mb-2">
        <strong>Examples:</strong> {radical.examples}
      </div>
      {radical.group && (
        <div className="text-gray-500 italic mb-2">Group: {radical.group}</div>
      )}
      <div className="flex justify-between text-sm text-gray-600">
        <div>Frequency: {radical.frequency}</div>
        {radical.joyoFrequency && <div>Jōyō Freq: {radical.joyoFrequency}</div>}
      </div>
    </div>
  );
};

//export default RadicalCard;










