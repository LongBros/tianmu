package com.longbro.doranote.util;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;
/**
 * 账单分类、歌曲名及id数组
 * @author 赵成龙
 * @website www.longqcloud.cn & www.zy52113.com
 * @date 2019年8月3日 下午2:07:45
 * @description
 * @version
 */
public class Strings {
	public static String category[]={"交通","早餐","午餐","晚餐","生活","话费","娱乐","日常","零食","饮料","服装","学习"};
	public static String Incate[]={"刷单","工资","兼职","软件","代缴电费","其他"};

	/**
	 * 使用递归得到歌曲的所有时间点，并作为一个数组链表返回
	 * @desc 
	 * @author zcl
	 * @date 2019年5月3日
	 * @param lrc
	 * @param times
	 * @return
	 */
	public static ArrayList<String> getTime(String lrc,ArrayList<String> times){
		String time=lrc.substring(lrc.indexOf("<")+1, lrc.indexOf(">"));
		times.add(time);
		lrc=lrc.substring(lrc.indexOf(">")+1);
		if(lrc.contains(">")){
			getTime(lrc, times);
		}
		return times;
	}
	public static String name[]={
		
		"以后的以后","一万个舍不得","走着走着就散了","余生都是你","余生都是你","你一定要幸福","童话","成都","伤心的人别听慢歌","求佛 (2017)","想把我唱给你听","痴心绝对","答案","走心","再见只是陌生人","凌晨三点","白狐","你到底爱谁","做你的新娘","心醉","一定要爱你","忘不掉的伤","丢了幸福的猪","我就是最爱你的人","最爱的人伤我最深","慢慢喜欢你","都要好好的","最幸福的人","铁血丹心","为了谁","新贵妃醉酒","刚好遇见你","当我想你的时候","北京北京","存在","再见青春","像梦一样自由","勇敢的心","春天里","怒放的生命","一起摇摆","摇啊摇 (DJ版)","真的爱你","光辉岁月 (粤语)","海阔天空","月亮惹的祸 ","雨一直下","没有什么不同","我的歌声里","领悟","我是不是你最疼爱的人","坏女人","新回心转意","回心转意","凉凉","国王与乞丐 (Live)","分手在那个秋天","不要再来伤害我","情人","冲动的惩罚","十一年","浮夸","单车","红玫瑰","好久不见","十年","没有你陪伴真的好孤单","爱情买卖","爱情乞丐","最炫民族风","月亮之上","我和草原有个约定","我从草原来","自由飞翔","郎的诱惑","荷塘月色","全是爱","狼爱上羊","愤怒的情人","爱大了受伤了","有一种爱叫做放手","怎么忍心放开手","残缺的美丽","如果爱能早些说出来","从相爱到分开","甜蜜的伤口","我们的无奈","分开不一定分手","伤心太平洋","别想她","终于等到你","我只在乎你","那些花儿","心痛2011","多喜欢你","当我唱起这首歌","说好了不见面","心痛2009","得到你的人却得不到你的心","伤心的时候可以听情歌","其实很寂寞","多情的人总被无情的伤","如果没有他你还爱我吗","错错错","我好喜欢你","相爱分开都是罪","被伤过的心还可以爱谁","不要在我寂寞的时候说爱我","披着羊皮的狼","爱情里没有谁对谁错","擦肩而过","一万个理由","怎么会狠心伤害我","打工行","爱情码头","包容","珊瑚海","发如雪","红尘客栈","听妈妈的话","给我一首歌的时间","稻香","晴天","说好的幸福呢","告白气球","等你下课","一个人的寂寞两个人的错","不仅仅是喜欢","体面","别把疼你的人弄丢了","多幸运","小幸运 (Live)","云烟成雨","栀子花开","信仰","后来","无颜女","和平分手","情话","犯贱","红装","那时雨","抽离","客官不可以","七秒钟的记忆","不想长大","只对你有感觉","情侣装","棉花糖","最后一次的温柔","秋殇别恋","红昭愿","7538(Me U-Remix)","9420","出卖","不将就","自拍","太坦白","模特","作曲家","老街","李白","我不是没脸的男孩","微情歌","那些学校没有教过的事儿","一千个分手的理由","最简单的声音","致命的甜蜜","毕业后你不是我的","认错","多余的解释","素颜","有何不可","可不可以","不再联系","我配不上你","太多","为你写诗","起风了","有多少爱可以重来","当我孤独时还可以抱你","丑八怪","认真的雪","刚刚好","其实","绅士","演员","秋天不回来","死了都要爱","Util You","Only Love","Breathless","One Day","Despacito (Remix)","有没有人告诉你","三国杀","Faded","三国恋","2002年的第一场雪","往后余生","沙漠骆驼","sugar","what are words","superheroes","逍遥叹","爱的华尔兹","让我为你唱首歌","大鱼","谢谢你的爱","擦肩而过","想你的夜","空空如也","说散就散","Fairy Tale","窗外","夏至未至","追光者","消愁","像我这样的人","机器铃 砍菜刀","倍儿爽","童话镇","9277","可惜没如果","我们","余香","断点","不在","分手会难过","我们的爱","不染","剑伤","青春你好","炙热的青春","爱情转移","不要说话","歌者","只只","听说你也回来过","爱如潮水","感谢你曾来过","写给黄淮","匆匆那年","类似爱情","别说我的眼泪你无所谓","一个人的北京","枷锁","天亮以前说再见","不想说再见","只是没有如果","该死的温柔","预谋","你会遇见更好的人","有一种悲伤","别爱太满别睡太晚","如果有一天","如果，我","谢谢你","浪子回头","原来占据你内心的人不是我","请先说你好","盗将行","放你走","男人背后","让一切随风","记事本","美了美了","一亩田","假装","绿色","可乐","左手指月","晚安","一生有你","关不上的窗","黄昏","弱水三千","冬天的秘密","以后别做朋友","十万毫升泪水","要不要投降 ","变成陌生人","路人","够幸福了","对不起我爱你","爱情错位","只为遇见你","寻人启事","等一分钟","老男孩","偷偷的哭","父亲","男人就是累","可惜不是你","酒干倘卖无","Always Online","醉赤壁","江南","背对背拥抱","小酒窝","一千年以后","曹操","错过的情人","再会无缘的情人","时间煮雨","等不到的爱","我想大声告诉你","一生所爱","我们都一样","何必在一起","量身订做","他不懂","天下","这,就是爱","最美的太阳","勿忘心安","年轻的战场","剑心","逆战","高飞","搁浅","过火","别怕我伤心","找一个字代替","红豆","唯一","龙的传人","火力全开","花田错","我们的歌","依然爱你","大城小爱","爱一点","好心分手","改变自己","倔强","后来的我们","他她回忆录","我不配做你男朋友","爱的供养","王妃","说谎","从开始到现在","越来越不懂","感动天感动地","寂寞才说爱","寂寞","高三那段路","Ready for war","Adventure (Battle Edit)","Bironnex","No Joke","精彩才刚刚开始","Purple Dragons","二胡-自由","青春修炼手册","宠爱","大梦想家","同桌的你","闻鸡起舞","过桥","Thinking Out Loud","昨日青空","去年夏天","但是我决定不忘掉他","你不知道的事","富士山下","乌托邦","遥远的她","岁月如歌","无悔无愧","落错车","今生无憾","明知做戏","喜欢你","约定","光年之外","BINGBIAN病变","Whiskey and Morphine","No Roots","Sofía","PLANET","Boom Clap","为你而活","Star Time","想着你亲爱的","等你等了那么久","听着情歌流眼泪","爱情错觉","IF YOU","사랑비","เจอกับตัวเอง...ถึงรู้","蓝精灵","遇到","做你的男人","专属味道","有点甜","小星星","不分手的恋爱","苦笑","风度","你还要我怎样","海阔天空","我不配","讲真的","流浪","曾经最美","最近","浪人琵琶","侧脸","最美婚礼","放心去飞","犯错","那些年","还有我","做我老婆好不好","怀念青春","在心里从此永远有个你","EMANG Aku Syantik","听说当初你找过我","C哩C哩","C哩C哩高考版","文爱","尽头","樱花树下的约定","一帘幽梦","一百万个可能","百年不合","Turn Down for What","Freaks (Radio Edit)","The Spook","DADDY","Please Don","We No Speak Americano","Floating","年轮","遗憾","记得咱的家","孤独患者","爱情专属权","告白","逼得太紧","祝君好","十指紧扣","我想我不够好","错位节拍","凌乱的华丽","Time","Don't Wanna Know","Animals","Something Just Like This","My Love","Psycho","Shape of You","你还怕大雨吗","生日礼物","如果当时","当","如果当时","七里香","只是太爱你","吻得太逼真","一言难尽","曲终人散","给你们","用心良苦","趁早","失去才懂","回忆总想哭","远走高飞","最后我们没在一起","早该","欠我个未来","一次就好","洋葱","红尘来去一场梦","我比较想给你快乐","相依为命","亲","痛彻心扉","爱死了昨天","喜欢","城府","断桥残雪","其实都没有","黎明前的黑暗","Звезда","平凡之路","我们能不能不分手","分手后不要做朋友","征服","你是我的眼","天使的翅膀","我相信","真心英雄","童年","爱你","独家记忆","心要让你听见","千纸鹤","九百九十九朵玫瑰","路灯下的小姑娘","至少还有你","唐人","全世界宣布爱你","隐身守候","突然好想你","追梦赤子心","如果我是DJ你会爱我吗 (DJ版)","电音之王","摇摆哥","主宰未来","最美丽的花","如果的事","丫头","七月七日晴","爱我的人和我爱的人","流浪歌","离家的孩子","流浪兄弟","望故乡","新打工谣","打工情歌","情锁","伤心泪","决不回头","北郊","钞票","铁窗泪","愁啊愁","十不该","打工十二月","伤心泪","你别走","百鸟朝凤 ","好想好想","两只蝴蝶","你是我的玫瑰花","爱要怎么说出口","不是因为寂寞才想你","红日","时间都去哪儿了","一物降一物","四块五","你把爱情给了谁","欢喜就好","爱拼才会赢","没那么简单","姑娘我爱你","一起走过的日子 (粤)","爱囚","遇见","花桥流水","甘心情愿","此生不换","忘记时间","生生世世爱","再见","偏爱","小情歌","淘汰","I MISS YOU","老鼠爱大米","丁香花","香水有毒","从头到尾","从头再来","天堂","九妹","爱笑的眼睛","青藏高原","那片海","天亮了","家乡","我怀念的","绿光","在那遥远的地方","一场游戏一场梦","你好陌生人","闹够了没有","一不小心","爱的世界只有你","雅俗共赏","我又想你了"," 情非得已","让我一次爱个够","有没有一首歌会让你想起我","勇气","宁夏","火苗","芒种","红色高跟鞋","遗憾","归去来兮","我们的纪念","多想在平庸的生活拥抱你","会呼吸的痛","光荣","我为自己代言","虐心","再也没有","你就不要想起我","Move Your Body","牡丹花和放羊娃","分手那天","世间美好与你环环相扣","不想让你哭","梦中的婚礼(钢琴曲)","大鱼(钢琴版)","遇见(钢琴版)","夜空中最亮的星 (钢琴版)","时间煮雨 (钢琴版)","高山流水","童话 (钢琴版)","十年 (钢琴版)","夜的钢琴曲5","父亲 (钢琴版伴奏)","小幸运(钢琴版)","莫失莫忘(钢琴版)","凉凉(钢琴版)","后来的我们 (钢琴版)","背对背拥抱 (钢琴版)","富士山下(钢琴版)","听海 (钢琴版伴奏)","天空之城 (钢琴版)","夜空的寂静 (钢琴曲)","美丽的神话","说散就散 (钢琴版)","至少还有你","一次就好 (钢琴版)","隐形的翅膀(钢琴版)","千与千寻(钢琴版)","为爱痴狂","万爱千恩","奔跑","遗憾","北京东路的日子","寂寞沙洲冷","蓝色土耳其","因为爱情","Hey Jude","Dancin","好想你","好想再爱你","情话微甜","一直陪着他","大王叫我来巡山","分手快乐","暖暖","有幸","我们只差一点点","说好不哭","蜗牛","心太软","一壶老酒","纸短情长","桥边姑娘","给不了的幸福","一生与你擦肩而过","愿得一心人","菊花台","你是风儿我是沙","父亲","父亲","野狼disco","来自天堂的魔鬼","忘情水","忘情牛肉面","下山","你的答案","哈尼宝贝","悬溺","耳听爱情","好可惜","但愿余生都是你","让全世界知道我爱你","这么多年了","痒","某人","那个男孩","埋葬冬天","万有引力","一笑倾城","停止跳动","生生","幸福万年长","你笑起来真好看","母亲","明天会更好","年少有为","理想三旬","Sometimes I Cry","隔壁泰山","盛夏的果实","清新的小女孩","我是如此相信","七子之歌-澳门","你知道我在等你吗","句号","麻雀","Victory","这一生关于你的风景","一荤一素","烟火里的尘埃","爱你不是两三天","除了春天 爱情和樱花","像鱼","好想爱这个世界啊","微光","剩下的盛夏","豆浆油条","生日快乐","哪吒","该","小生不才","太阳","嚣张","Merry Christmas","新年大吉","新年好","最后是我开了口","我做不到不想你","朋友名义","小三","看透爱情看透你","那就这样吧","你若三冬","念旧","责无旁贷","悠殇叹","对不起，我爱你","将故事写成我们","We Will Rock You","Rindu Semalam","粉红色的回忆","修炼爱情","三百六十五个祝福","自信","Trouble Is A Friend","情深深雨濛濛","广寒宫","你，有没有过","Love U U","清新的小女孩","爱的魔力转圈圈","Time Back","假情真爱","处处吻","勇往直前恋上你","好姑娘","不负时代","从无到有","唯一","默默","逃爱","你不是真正的快乐","空城","我愿意平凡的陪在你身旁","小黄","月亮代表我的心","曾经这样爱过你","做你的爱人","불꽃 (火花)","故事细腻","El Dorado","雪见-仙凡之旅","火红的萨日朗","请你给我好一点的情敌","突然的自我","I love Poland","Hold On","冬眠","被风吹过的夏天","不存在的情人","青城山下白素贞","想见你想见你想见你","Someday or One Day","一天","美","这就是爱吗","对不起 谢谢","百花香","两个人的错","时间的过客","大约在冬季","画","我的一个道姑朋友","余香 (纯音乐)","心愿便利贴","大雨还在下","一直很安静","最美情侣","Samsara","说谎","献世","春泥","自从有了你","弹唱","好嗨哦","小半","四点四十四","灰色头像","天使","爱你","记得","房间-新版","爱是你我","就是爱你","恋人未满","嫁给爱情","少年","幻听","无尽的思念","突然累了","耿耿于怀","烟花易冷","不二臣","后来遇见他","西海情歌","光点","丢了你","倩女幽魂","当你","下完这场雨","特别的爱给特别的你","岁月神偷","那女孩对我说","多年以后","夏天的风","点歌的人","微微","说我爱你的一百种方式","天下有情人","北京欢迎你","招牌动作","欧若拉","给我一个理由忘记","最美的期待","笔记","给陌生的你听","小薇","我的梦","假如","着魔","伪装","为你我受冷风吹","迷人的危险","春野","蓝色天际","清晨","神秘园","宏愿","终于我们","一事无成","够钟","Mojito","灵魂相认","隐形的翅膀","MY WAY","伤心1999","来生缘","水手","星星点灯","电话情缘","明天你好","我很快乐","爱","我爱你你却爱着他","被情伤过的女人","那些爱过的事","心酸","无人之岛","心思","追","靠近一点点","你是人间四月天","一剪梅","日不落","七友","阳光总在风雨后","山楂树之恋","和你一样","桃花朵朵开","情人","陷阱","即兴","我们终究是错过","过客","歌声与微笑","不要忘记我爱你","勇气","后继者","默","百花香","余情未了","曾经的你","走马","吻别","无与伦比的美丽","目不转睛","失","最长的电影","清明雨上","东风破","千里之外","安静","外婆的澎湖湾","ドラえもんのうた(大杉久美子版／TVサイズ)","ドラえも～ん！","爱江山更爱美人","追光者(粤语版)","化蝶飞","下个,路口,见"
		
	};
	
	public static String id[]={

		"0000CutN1dwZm4.html","0000ToZZ3h38l6.html","0002fr701wX6uz.html","0003f03o2qG5P5.html","0003mXKU3KZ34F.html","0005fPEv1d3D1b.html","0005SkmK4AhQj8.html","0006Wwt50IMiGr.html","0008fiVc42hHtf.html","0008Xbt23AGrr6.html","0009kDV81svES9.html","000a2bMl33mXkU.html","000ApIyy0ff0qs.html","000Au1br45AXA1.html","000chTkT1DVOyU.html","000d4JFS40FIwM.html","000ddTHO1mmXOM.html","000E4JDC2co8yb.html","000E7XC60YyAzx.html","000Foied2MchaC.html","000fYliH3Yokl0.html","000GXpyo1CKKbf.html","000H3L9R1fk6DM.html","000JATzt4MqJqP.html","000L8lFG0tU3yw.html","000LBcVm0d9raf.html","000lhxPp0qLmsJ.html","000Md1wq0vnwzE.html","000n5FNN32EXHo.html","000NFWSQ0Yw7sj.html","000O75fp2iuRV8.html","000oby7d2ESye6.html","000ocSdp4SSl6P.html","000Ofo232soTDI.html","000ogOhu4QDz13.html","000pDHmH1GLRac.html","000QQdwq1siwHc.html","000R0no40AQ6v3.html","000rthMY4SRqM0.html","000rV4Ng040NwQ.html","000S7TGL43hhBO.html","000SBMxP3IK4ey.html","000T2LP908lQ6C.html","000t7dhP0tQaSi.html","000Tmn2f0Nw4vj.html","000TYWRb4RWJay.html","000Tz7Eg2oXZ5j.html","000u8bXy3TEy3J.html","000un7wL3j7hyx.html","000UnflD1SQq6f.html","000UO3jv0UcS3m.html","000utfWj3Ew3cG.html","000VHofZ4BkjL5.html","000VZXMm2emJno.html","000WeVwu0ooShw.html","000WlPv93e8cAT.html","000wYRrK4BAeR3.html","000X8RgD0FO49o.html","000xdt5M3OQlR7.html","000xRG4E4diqXD.html","000XyM5Z23ds7t.html","000zQiKM16gZGn.html","000zUuBN4Z6Zjq.html","0012neBK2hwKGu.html","0012qZwz22SKoE.html","0013N7WL4YxcRU.html","00153HPQ1Ovp65.html","0016O4Oh1WQB2A.html","00171CUM1DoG3A.html","0019gCB61VcvH2.html","0019poBi3UjGCV.html","001AawD621YSQm.html","001an8ju3IkKLW.html","001b3yxJ17AH7C.html","001B6Z2d1y7hmh.html","001bL8sY0kW9dj.html","001BR1tg1j9xGj.html","001BuTZL4O2ilo.html","001CaZI424HKlx.html","001cKnEx3zMgtp.html","001cP3t82HI31e.html","001Dh0lz2uBO2c.553","001dsnaq0z9dYk.html","001dxwSX448FAp.html","001EVWKR2Eg0JP.html","001EZ44F0uQpa9.html","001fkWNw2eaEYT.html","001FOt7p33gCRq.html","001G0SLj4YjhTA.html","001GAAVj1GjW8F.html","001GCsGH2vhsDY.html","001h3RI01PUYte.html","001hdfMm3ikrxL.html","001hFjNj1ORwnD.html","001Hp44V3pCQ53.html","001HpRje2QX5M4.html","001IIARo3EMkLS.html","001IqrdV4AqcyV.html","001kAb3L4GzJWY.html","001L18rH37RI5T.html","001l6Dag1sIs4l.html","001LMj8V1Leoxy.html","001mEXRf1arIpW.html","001Oiqp13OhZWl.html","001Omr3t1hyXiU.html","001pbXyo4J3wMH.html","001pSNcG2XcFvl.html","001Q5es30XG6Zo.html","001qLrWJ2JEIrK.html","001SwHZE4gELwI.html","001sZYqA1JZlZI.html","001t8QJq4MutIo.html","001tak5C33Hf6F.html","001TDWMK2f5pKw.html","001tYweH1iGcZf.html","001ucwE018fmRe.html","001UoKIp0opArh.html","001UvMQj20a8tA.html","001V7PPz24Yulv.html","001VNZ7u2BWZhs.html","001WbdtZ1cctJD.html","001xt1rc2ugNb1.html","001y62Li42ZidN.html","001yS0N33yPm1B.html","001YWRL13ylojN.html","001yYM0I30CzdP.html","001zLvbN1NYMuv.html","00251Bz50yMRcf.html","00254IcB43P7mQ.html","0025kBtP2ip6bM.html","0025R6uy1ekS29.html","0027Ae7c1Ze7sa.html","0028M1zL0pS9fp.html","00299V1h3ndPE1.html","002AFutb4I2v6v.html","002aJqAb29LGFd.html","002aXRGR2J4TKC.html","002B2EAA3brD5b.html","002Ba1Td137VC7.html","002bn4363UmoYJ.html","002bongo1BDtKz.html","002btHvx0t00l1.html","002C73F10vtRRR.html","002CG6Mq0dsmWP.html","002chsjl0H0i0t.html","002cLtlI3iMS0f.html","002CQ7e82p2SCl.html","002CRBUg09v2pd.html","002DCGMx1KD7tj.html","002ejEdb4KTwBw.html","002eokwY2vG8db.html","002ePCbF198ZRl.html","002fE3oa0HixZd.html","002fhLRv2tEgs0.html","002GkZ5918bzeh.html","002gODrA12daz1.html","002GsyiY1AtogH.html","002hKfDA2NSWlo.html","002hsO5O30LffK.html","002HsogO0iKhf2.html","002hZ2IM0NdiiX.html","002I8lz81fs013.html","002iKSnv1OXzty.html","002iTkrk2tpZ0o.html","002jhYSc3HvhQi.html","002JMJa70OtRPz.html","002kkJSE0IeS1F.html","002KmVry3X4pZq.html","002L4c0L3OqYxD.html","002mbqv20UPkNT.html","002MK4qO3GFwGx.html","002NZ1nX1AQ1pI.html","002pG8LV30IkP8.html","002pk70j0rkJOE.html","002pKRoX4Qbafa.html","002pohf72FCTGJ.html","002PpAAE06QO73.html","002QbYjB4C67Ps.html","002R7LZY3LnrDw.html","002RF6ly1Wf71f.html","002sPvGb1kLrAr.html","002SXeJf3ppKmQ.html","002tJYL13Lxh8p.html","002tQrEa2yZbnj.html","002TUBbZ4dYMyq.html","002URiHF2KamxI.html","002V8Vde2dKIEx.html","002Vquk42isCVn.html","002WshFv11u44c.html","002X5uuR1pBl2y.html","002xdDqK3GkHVO.html","002xpzFk0aUnGA.html","002y4T9W23anFg.html","002yRwjR22zu9C.html","00307L8H2wCxvn.html","0031Hx6M2taxQv.html","0031MMo90FDbTl.html","0031QMjB24NVHu.html","0032BnJ315cWYp.html","0033DNBM2cThID.html","0033upXO0xmskX.html","0036fEnB1vkegd.html","003726EL06y5jk.html","0037P9L93upzpO.html","0038hFDz0pKKv8.html","0038UNs52uky8g.html","003a0aj54RzyXf.html","003AFE732DFzfg.html","003agYKX4IcPOI.html","003aNE463RHQws.html","003AOPLH0K9aWT.html","003bh3Wx3gGPn5.html","003bpqky49ibuJ.html","003bVCqX2SRdEW.html","003crozn0RSkef.html","003dIT9t46SLw8.html","003eZ03f3yrLl5.html","003FHIfD1BOxqF.html","003gab3g2kUMwd.html","003GdNoj1b7FSU.html","003HbHHP31KHHo.html","003HCCx43yOBx3.html","003HN1mm2OJICC.html","003HSvsT47J4QG.html","003hTE6N2jHGN5.html","003iTLLw3X7eOP.html","003JxfgA21kaiK.html","003k58qK2XoA2u.html","003kQdOn08MDcx.html","003mkTmw0vPHlE.html","003MTm6H1EknjX.html","003MuKtY3dYALN.html","003n3qHD00GFPo.html","003NsIIm121C6A.html","003obNeQ3qkYiV.html","003ObuXm1bkqbV.html","003odYN80HOgTP.html","003onkvZ3lF4J7.html","003OZHzo2rrxLE.html","003Pz4dV4fcOjL.html","003RcyNl3PXViA.html","003REwbW32wFiF.html","003Sn9Rg4N3oNq.html","003TLWoN0gQnP5.html","003Ttly81W8zzS.html","003U7jQQ02YVAv.html","003UAhhG2Bm3Nq.html","003uL8IE3o37CL.html","003vMyw03XyybQ.html","003vo8dD0Hz5W4.html","003VQKPd35wAln.html","003vTRXd4Wtsli.html","003wfQAn1a8mCv.html","003wY1Df4GK6NM.html","003XPmiG3eMglL.html","003y7NnD0A2kLk.html","003YFtiK1xgBLI.html","003YPTmy0uedw4.html","003z8Lmg3czY3q.html","003ZguTb14H2vl.html","003ziBRN4WIQuj.html","003zJGba3VVI0M.html","003zl5Oo386AXA.html","003Zl6mC43Y3Yj.html","003zWj0S1kDIJA.html","0040ZKt52jxJ6Y.html","0041nyxj4H5QDJ.html","0042Xj9h3mts7n.html","0043Jqer30mZYw.html","0043OVRE2y9ysn.html","0046dO4w35gkCt.html","0046jPQe24MGzG.html","0046NOyl3JACkA.html","0046Ygdk3OAi1c.html","0048arSc4DbwNN.html","0049XyvY2W8K4w.html","004a4n6J1rOH5J.html","004AGa4s1SF7je.html","004bBXjQ08rrWR.html","004dFFPd4JNv8q.html","004DmvlX3mwkkL.html","004DOJh34D5xI5.html","004DXFlC0nsTCZ.html","004EzHKM2jXY9i.html","004fGLTR0WtadR.html","004Fk5Kq4g6V2U.html","004fM2tk11tisY.html","004fvv8B4YSHj0.html","004Gyue33FERTT.html","004HdPmN0HZipA.html","004HlEON40PR9g.html","004HNA4e1Wwxgy.html","004IIvBM1S55sG.html","004IuFgE0FFSaP.html","004JzTGG0z214x.html","004KuKyD08106m.html","004LxR3T084E9d.html","004M519K4V41rf.html","004Mn2d70GRyfZ.html","004NIK6u00TtHx.html","004P1OaQ3YDeYS.html","004PfD8q2uWFZO.html","004PnjDE1X2WjS.html","004Rlx4s12qoJa.html","004Sa0wx3Qgta0.html","004SdqaN2SasLc.html","004T4DA63eo3sm.html","004ThYNq2Ffbgr.html","004TSZYg2HaHQi.html","004UxcgC1g4bLP.html","004WwYrR0Uhdzk.html","004Xcfbz2tNqPh.html","004Xpzat0WcMPz.html","004Zeemn1ScQMX.html","103135.kw","103808.kw","104241","105279.kw","108136","108152","108245","108390","108393","108418","108468","108478","108485","108795","108864","108886","108910","108914","109194","110184","112908","113396.kw","114369","1144184.kw","1159904.kw","118990.kw","1210461","122535","123002.kw","125835","126443","126543.kw","1293951677","1294924099","1297742772","1305425959","1313052960","1313897867","1315718569","1317145419","1317458013","1321378753","1323304621","1325896149","1330348068","1331089438","1331819951","1332623211","1334270932","1334405955","1335952302","133998","134000","1340001252","1344897943","1345848098","134606","1346104327","1348548292","1351551838","1353795984","1355916808","1356295574","1356350562","1357999894","1358848433","1359356908","1360617341","1363948882","1365221826","1367452194","1368934278","1369798757","137340.kw","1381755293","138243.kw","1385805666","1387157948","138804.kw","138810.kw","1393739628","1398663411","1403215687","1405283464","1407358755","1407551413","1408122638","1411358329","1411784809","1417120347","142655450.kw","1432507250","144083","1442508316","1442773498","1449344484","1449647050","1450574147","149751","149763","149778","149787","149789","150361","151200","151437","151985","15249349.kw","154457","156193","156518.kw","156524","158361.kw","158919.kw","158923","158924","163123","163125","165237","165339","165340","165347","165348","165361","165364","165367","165370","165375","165379","165380","167655","167761","167815","167827","167844","167870","167873","167876","167882","167885","167888","167937","167942","168500","169088.kw","169185","17178591.kw","172886","17451998","174934","174960","174961","174962","174963","175072","176075","176093","176403","176496","177578","178139","178176","178734","179242","186181","186182","186279","186345","186385","186583","188175","189320","189323","189593","190449","190499","190690","190778","19081569","19081573","190964","191024","191060","191187","191195","191199","191232","191252","191254","191278","191534","192384","194769","2006865","203164.kw","20676614.kw","2069669","208902","208958","209648","209976","21157332","216456.kw","21935787","22852057","22854064","22871669.kw","228755","228908.kw","228948.kw","231323.kw","23543224.kw","237881.kw","237910.kw","238855","238858","239245","24627341.kw","246284.kw","247480","247579","254017","254191","254265","254309","254319","254359","254485","254499","254574","255714","25640407","25642119","25642125","25643275","25643359","256468","256469","257098","25723157","25727803","25788001","25795016","25864481","25918133","26145111","261557","26319456","26319463","26418130","26524401","26524402","26562231","26599373","26609877","26609879","26867112","271333.kw","271337.kw","27366729.kw","27483167","27583525","27678655","27731176","27731177","277382","27747328","27789126","27808044","27888500","27890395","27955653","27955654","27955777","280175","28018075","28059417","28095072","28111646","28240119","28285910","28288302","28302912","28387594","28414567.kw","28452163","28481105","28566210","28643169","286510","28661853","287021","28748198","28748199","28762207","28762209","28815250","288218","28832241","28853662","28892111","28949444","289565","28977906","28987626","28996036","29004400","29019227","290823","29418037","294482","296835","29713754","29723028","29759733","29764562","29764564","29775257","29787426","298089","29809536","298213","298455.kw","29850685","29922372","299757","30431367","305020","30612792","307003","307057","307780","30987293","31053510","31053512","31134193","31152396","312341.kw","31445772","31473269","31594436","315968.kw","31654343","31654455","3195905.kw","320058.kw","3205316.kw","32192436","322927.kw","324249.kw","32507038","32507737","327333.kw","328037","32897777","33035611","33291435","33314556","334795.kw","33756016","33887645","3394218.kw","34057930","3427474","34341494","3455711.kw","34749984","34880375","350909","351116","351271","354620","355992","357324","36024806","3622015.kw","36871866","36990266","375168","375328","375381","376417","37653063","376824","386175","392907","393335","394748","404184621","406730432","407679465","4078923.kw","40919498.kw","40926193.kw","409872465","410629770","411214279","41156987.kw","41215111.kw","412911436","413812448","413829859","4147750.kw","415792881","416700932","418602948","421423806","424474507","426852063","427606660","428116793","4317486.kw","436487129","439138762","440208643","440241232","440613.kw","440614.kw","440623.kw","442314990","443603.kw","444324644","445238141","445665094","448707059","449818741","451703096","452986458","460578140","461347998","461544126","463125.kw","463658.kw","463661.kw","466370500","469699266","47015517.kw","472361096","47497959.kw","479892.kw","480580003","4827516.kw","482999696","483671599","485992506","486111543","486814412","487192079","4872530","4872532","4873340","4875075","4875079","4875306","4875626","4876565","4878612","487885426","493664218","493735012","5046357.kw","504835560","509512939","509726632","5099470","512845.kw","515143305","519136840","52289978.kw","523251118","5237542","5238229","5243801","5244890","5250048","5254253.kw","5255640","5256103","525775.kw","5260494","526099041","526464145","526464293","5265211","5269692","5270588","52786949.kw","5285415","531295576","53294830.kw","53307448.kw","534542079","535793433","536096151","536099160","5394155","541511427","541514.kw","543607345","546279760","551816010","55219.kw","553755659","554191751","557581476","557584888","56254.kw","562594322","562598081","565316983","566435164","569200212","569200213","569213220","571340386","571875938","573968836","5822792.kw","59532.kw","60008","60102","609133.kw","61285598.kw","616782.kw","616788.kw","6170631.kw","6182865.kw","6246984.kw","626047.kw","63256354.kw","63650","63892","64093","6418818.kw","64443","65074","65528","65536","65538","65766","6728930.kw","69284035.kw","69509200.kw","69827","70100","7183643.kw","7207081.kw","76323299.kw","76446978.kw","77099","77131","77378","77437","79029.kw","79479.kw","80403.kw","812400","82932","83728113.kw","83821","84306","84345","85630360.kw","85798","862101001","863489830","86357","86360","86363","86381","877978.kw","88135210.kw","891952.kw","91609449.kw","92022321.kw","92148255.kw","92283","92293","92939","94237.kw","94639","94646","95843","96157434.kw","97357","9880330.kw","99181","buxiangshuozaijian.553","dengnixiake.553","douyin.553","Fairy Tale.553","gaobaiqiqiu.553","http://win.web.rh01.sycdn.kuwo.cn/9b926baf4554757d79a6ca96ede6c825/5e159adc/resource/n1/54/56/29913262.mp3","langrenpipa.553","love3","sidiansishisi.553","Thinking Out Loud.553","tingshuoniyehuilaiguo.553","xinyang.553"
		
	};
	/**
	 * 随机生成一个含有wei个数字的数
	 * @desc 
	 * @author zcl
	 * @date 2019年10月1日
	 * @param wei
	 * @return
	 */
	public static int allotNum(int wei){
		Random ran=new Random();
		String num="";
		for(int i=0;i<wei;i++){
			int seven=ran.nextInt(10);
			num=num+seven;
		}
		int number=Integer.parseInt(num);
		if(number>pow(10, wei)){//如果不是0开头，则返回
			return number;
		}else{//否则重新生成
			return allotNum(wei);
		}
	}
	public static int allotEight1(){
		int id;
		Random ran=new Random();
		int eig=ran.nextInt(99999999);
		if(eig>10000000){
			 id=eig;
			 return id;
		}
		else{
			return allotEight1();
		}
	}
	public static void main(String[] args) {
//		for(int i=0;i<10;i++){
//			System.out.println(allotNum(8));
//		}
//		System.out.println(genNumber(10,3000));
		
		String dest[]={};
//		System.arraycopy(name, 111, dest, 111, 111);
//		Arrays.copyOf(original, newLength)
		
		//计算10的八次方
		
	}
	/**
	 * 计算who的wei次幂
	 * @desc 
	 * @author zcl
	 * @date 2019年10月1日
	 * @param who
	 * @param wei
	 * @return
	 */
	public static int pow(int who,int wei){
		int c=1;
		for(int i=1;i<8;i++){
			c=c*who;
		}
		return c;
	}
	public static String backs[]={"back0.jpg","back1.jpg","back2.jpg","back3.jpg","back4.jpg","back5.jpg","back6.jpg","back7.jpg"
		,"back0.png","back1.png","back2.png","back3.png","back4.png","back5.png","back6.png","back7.png"
		,"back0.gif","back1.gif","back2.gif"};
	public static String mbacks[]={"back1.jpg","back2.jpg","back3.jpg","back4.jpg","back7.jpg"
		,"back3.png","back4.png","back5.png","back6.png","back7.png","back8.png","back9.png","back10.png","back11.png"
		,"back2.gif","back4.gif","back5.gif","back6.gif"};
	public static String cakes[]={"cake1.jpg","cake2.jpg","cake3.jpg","cake4.jpg","cake5.jpg"
		,"cake6.jpg","cake7.jpg","cake8.jpg","cake9.jpg","cake10.jpg"};
	/**
	 * @desc 随机生成n个max以内的正整数
	 * @author zcl
	 * @date 2019年12月25日
	 * @param n
	 * @param max
	 * @return
	 */
	public static String genNumber(int n,int max){
		String s="";
		for(int i=0;i<n;i++){
			s=s+new Random().nextInt(max)+",";
		}
		s=s.substring(0,s.length()-1);
		return s;
		
	}
	
	String[] loadTip={"如果长时间加载不出来，还请刷新一下，给你带来的不便还请见谅。","数据加载中，客官请稍后^_^"};
	String[] tip={"欢迎使用哆啦网，记录你生活的点点滴滴","请先登录后再写日记！(如未注册，请先注册，注册后会自动登录)"};
	public static String imgPath="/home/ubuntu/project/doraSrc/source/";
}