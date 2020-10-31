var songs=[];
var songsLength=0;
var lastSongsLength=0;
var songInfo=[];
var what="0";//0歌曲，1音频
var lastWhat="0";
	
var nowId='';//当前播放歌曲的资源id
var lastPlay=0;//上一首播放的歌曲序号，在播放下一曲时，先将当前播放赋给此字段。涉及next、preview、playAudios（直接点击）等函数
var nowplay=0;//当前播放歌曲的序号
var mode="order";//播放模式---默认为顺序播放模式
var regex = /\[(.+?)\]/g; // [] 中括号
var ranPlayId=0;//随机推荐播放的歌曲id

var sysSongNum=1100;//哆啦网系统的总歌曲数量
var singlelyrics=[];
var emptyAlert=0;//播放列表为空时提示，仅emptyAlert为0时提示，且仅提示一次
//定时器1：每秒加载1次播放列表，2：每秒加载音频的播放情况，3：每10秒推荐一首歌曲,4:每0.3秒旋转专辑图
//键盘监听器

var thread=window.setInterval("loadAudio(1)", 1000)
var monitorThread=window.setInterval("monitor()", 1000);
document.addEventListener("keydown", keydown);

//2020-10-27
var rotateThread;//旋转
var deg=0;//旋转起始弧度
var chooseIndexs=[];//选择的要清除的	2020-10-30

var time=0;//当前音频的时长

/**
 * 1.图标tab栏切换函数
 * @param which	0:热播，1：歌曲播放列表，2：音频播放列表，3.加载歌单，4.随机推荐歌曲
 */
function loadAudio(which){
	$(".songs").html('<img src="http://img.duola.vip/image/loading1.gif" style="width: 28px;height: 28px;margin-left:250px;margin-top:60px">');

	var tabs=new Array("hotPlayBtn","songsBtn","audiosBtn","listBtn","ranRecomBtn","newInputBtn");
	var rawBtn=["&#xe6c1;","&#xe60f;","&#xe6a5;","&#xe68b;","&#xe6d0;","&#xe6c4;"];
	for(var i=0;i<6;i++){
		if(i==which){
			$("#"+tabs[i]).html("<img style='width: 12px;height: 12px' src='http://img.duola.vip/image/playing.gif'/>");
			$('#bar'+i).css("display","inline-block");
		}else{
			$("#"+tabs[i]).html("<i class='Hui-iconfont' style='font-size:15px'>"+rawBtn[i]+"</i>");
			$('#bar'+i).css("display","none");
		}
	}
	if(which==0){//加载热播歌曲
//		var n=random(10,20);
		var n=20;
		loadHotSongs(n)
		vant.Toast("加载"+n+"首热播歌曲")
//		$("#hotPlaynum").html(n);
	}else if(which==1){//加载歌曲
		//console.log("loadSong:加载歌曲")
		window.clearInterval(thread);
		thread=window.setInterval(loadSongList, 1000)
		lastWhat=what;
		what="0";
		songsLength=0;
		lastSongsLength=0;
	}else if(which==2){//加载音频
		//console.log("loadAudio:加载音频")
		window.clearInterval(thread);
		thread=window.setInterval(loadSongList, 1000)
		lastWhat=what;
		what="1";
		songsLength=0;
		lastSongsLength=0;
	}else if(which==3){//加载歌单
		vant.Toast("暂不支持")
	}else if(which==4){//随机推荐歌曲
//		var n=random(10,20);
		var n=20;
		randomPList(n)
		vant.Toast("已为你随机推荐"+n+"首歌曲")
//		$("#ranRecomnum").html(n);
	}else if(which==5){//新录入歌曲
		var pList=new Array();//清空原播放列表数组
		$.ajax({
			type:"Get",
			async:false,
			url:"http://m.duola.vip/queryAllSongs.do?page=1",
			dataType:"Json",
			success:function(data){
				for(var k=0;k<data.length;k++){
					pList.push(data[k].id);
				}
			}
		});
		$(".songs").html('')
		ajaxLoadSongs(pList,1)
		
		vant.Toast("已为你加载"+pList.length+"首新录入歌曲")
//		$("#newInputnum").html(pList.length);
	}
}

//3.关闭窗口前修改cookie状态
function closeWindow(event){
	setCookie("showPlayer","0");
	if(event.clientX>document.body.clientWidth && event.clientY < 0 || event.altKey){ 
		setCookie("showPlayer","0");
	}else{ 
	}
}
//if(slist==""||slist=="null"){
//$("#songsBtn").css("display","none")
//}
//else{
//$("#songsBtn").css("display","block")
//}
//if(alist==""||alist=="null"){
//$("#audiosBtn").css("display","none")
//}
//else{
//$("#audiosBtn").css("display","block")
//}
//4.加载播放列表
//what=0 歌曲，what=1 音频
function loadSongList(){
	lastSongsLength=songsLength;
	var slist=getCookie("songList")+"";
	var alist=getCookie("audioList")+"";

	var songLists=slist.replace(new RegExp("%3A","gm"),":").replace(new RegExp("%3F","gm"),"?")
				.replace(new RegExp("%3D","gm"),"=").replace(new RegExp("%2C","gm"),",");
	songs=songLists.split(",");
	
	var audioLists=alist.replace(new RegExp("%3A","gm"),":").replace(new RegExp("%3F","gm"),"?")
	.replace(new RegExp("%3D","gm"),"=").replace(new RegExp("%2C","gm"),",");
	audio=audioLists.split(",");
	$("#songnum").html(songs.length);$("#audionum").html(audio.length);
	if(songs.length==1&&songs[0]==""){
		$("#songnum").html("0");
	}
	if(audio.length==1&&audio[0]==""){
		$("#audionum").html("0");
	}
	if((songs.length==0||(songs.length==1&&songs[0]==""))&emptyAlert==0){
		var r=confirm("系统检测到你的歌曲播放列表为空，将为你随机生成播放列表？\r\n（你也可以前往哆啦网添加歌曲至播放列表）")
		if(r==true){
			var pList=new Array();//清空原播放列表数组
			for(var i=0;i<20;i++){
				var n=random(1,sysSongNum);
				pList[i]=n;
			}
			
			var songIds=pList+"";
			$.cookie('songList', songIds, { expires: 30, path: '/' });
		}
		emptyAlert=1;
	}
	if(what=="0"){
		songsLength=songs.length;
	}else{
		songs=audio;
		songsLength=audio.length;
	}
//	if(songsLength==1&&songs[0]==""){
//		window.clearInterval(monitorThread);
//	}else{
//		monitorThread=window.setInterval(monitor, 1000)
//	}
	
	if(songsLength>lastSongsLength){//歌曲数量变化，重新加载回显歌曲
		ajaxSongs(0)
	}else if(songsLength<lastSongsLength){//某歌曲被清空掉
		ajaxSongs(1)
	}else{//歌曲数量不变，判断是否有需要播放列表中已有的歌曲，若有则直达播放
		var has=getCookie("hasHas")+"";
		if(has){
			var hasId=has.substring(2);//要播放的列表已有的音频或歌曲的id
			if(has.indexOf('1,')!=-1){//已有音频
				
			}else if(has.indexOf('2,')!=-1){//已有歌曲
				
			}
		}
	}
	if(what!=lastWhat){//切换音频/歌曲
//		ajaxSongs(0)
	}
}
//5.得到音频数量
function getCharNum(str,ch){
	str=str.replace(new RegExp("%3A","gm"),":").replace(new RegExp("%3F","gm"),"?")
	.replace(new RegExp("%3D","gm"),"=").replace(new RegExp("%2C","gm"),",");
	var ss=str.split(ch);
	return ss.length-1;
}
//6.异步加载音频详细信息
function ajaxSongs(type){
	$(".songs").html('')
	if(songs.length==0||(songs.length==1&&songs[0]=="")){
		document.getElementById("emptyIcon").style.display="block";
		return;
	}
	vant.Toast("歌曲数量变化，重新加载回显歌曲")
	var list='';

	for(var i=songs.length-1;i>=0;i--){
		list+=","+songs[i];
	}
	console.log(list)

	if(list.charAt(list.length-1)==","){
		list=list.substring(0,list.length-1)
	}
	if(list.charAt(0)==","){
		list=list.substring(1)
	}
	if(list.charAt(0)==","){
		list=list.substring(1)
	}
//	console.log(list)
	
	if(what=="0"){
		vant.Toast("加载歌曲列表")
		ajaxLoadSongs(list,0);
	}else{
		vant.Toast("加载音频列表")
		ajaxLoadAudio(list)
	}
//	console.log("songInfo:"+songInfo)
	if(songInfo.length==0){
		document.getElementById("emptyIcon").style.display="block";
		return;
	}else{
		document.getElementById("emptyIcon").style.display="none";
	}
	if(type==0){//新加歌曲至播放列表时，播放新加的歌曲
		var last=0;
		if(what=="0")
			playAudios(2,last,songInfo[last].sourceId)
		else
			playAudios(2,last,songInfo[last].nSongId)
	}
}
function ajaxLoadSongs(list,which){
	//加载歌曲列表
	$.ajax({
		type:"Get",
		async:false,
		url:"http://m.duola.vip/queryPListSong.do?pList="+list,
		dataType:"Json",
		success:function(data){
			songInfo=data;
			for(var k=0;k<data.length;k++){
				var na=data[k].songName+"";
				if(na.length>6){
					na=na.substring(0, 5)+"...";
				}
//				na=na+"("+data[k].playNum+")";
				var url="";//源网址
				var id=data[k].sourceId+"";//网址标识部分
				if(id.charAt(id.length-1)=="w"){//酷我音乐，需去掉后缀.kw
					id=id.substring(0, id.length-3);
				}
				var singer=data[k].singer+"";
				if(singer.length>6){
					singer=singer.substring(0,5)+"...";
				}
				var web=data[k].website+"";
				if(web=="QQ音乐"){
					url="https://y.qq.com/n/yqq/song/"+id;
				}else if(web=="网易云音乐"){
					url="https://music.163.com/#/song?id="+id;
				}else if(web=="酷我音乐"){
					url="http://www.kuwo.cn/play_detail/"+id;
				}
				var website="";
				if(web.indexOf("553")!=-1){
					website="http://img.duola.vip/image/tx/88888888_1585987333364.jpg";
				}else if(web.indexOf("QQ")!=-1){
					website="https://y.qq.com/favicon.ico";
				}else if(web.indexOf("网易云")!=-1){
					website="http://p3.music.126.net/tBTNafgjNnTL1KlZMt7lVA==/18885211718935735.jpg";
				}else if(web.indexOf("酷我音乐")!=-1){
					website="http://image.kuwo.cn/website/favicon.ico";
				}else{
					website="http://img.duola.vip/image/tx/88888888_1585987333364.jpg";
				}
				var dura=data[k].duration+"";
				if(data&&dura.length==5){
					dura=data[k].duration;
				}else if(data&&dura.indexOf(".")!=-1){//
					var sec=dura/1000
					dura=getTime(sec+"")
				}else{
					dura='--:--';
				}
				var html="";
				if(which==0){//播放列表
					html="<i class='Hui-iconfont' onclick='playAudios(1,"+k+",\""+data[k].sourceId+"\")'>&#xe6e6;</i>" +
					"&nbsp;<i class='Hui-iconfont' onclick='removeSong("+(data.length-k)+")'>&#xe609;</i>";//+
					//"&nbsp;<i class='Hui-iconfont' onclick='addToSongList(0,"+data[k].id+")'>&#xe604;</i>"
				}else if(which==1){//热播、推荐
					html="<i class='Hui-iconfont' onclick='playAudios(1,"+k+",\""+data[k].sourceId+"\")'>&#xe6e6;</i>"+
					"&nbsp;<i class='Hui-iconfont' onclick='playerAudio("+data[k].id+",2)'>&#xe604;</i>";
				}
				$('.songs').append("<tr style='' onmouseout=\"hidePlayBtn(this,"+data[k].id+")\" onmouseover=\"showPlayBtn(this,"+data[k].id+")\" ondblclick='playAudios(1,"+k+",\""+data[k].sourceId+"\")' id='songName"+k+"'>" +
						"<th style='width:6%;'><input type='checkbox' id='chooseIndex"+k+"' onclick='chooseWhich("+k+")'></th>"+
						"<td style='width:8%;' id='xu"+k+"'>"+(k+1)+"&emsp;</td>" +
						"<td style='width:23%;'><span><a title='"+data[k].songName+"-"+data[k].playNum+"次播放'>"+na+"</a>" +
						"&nbsp;<span style='visibility:hidden;' id='playBtn"+data[k].id+"'>" +
						html+
						"</span></span></td>" +
						
						"<td style='width:22%;padding-left:33px'><a onclick=\"\" title='"+data[k].singer+"'>"+singer+"</a></td>" +
						"<td style='width:13%;padding-left:10px'><a href='"+url+"'  target='_blank'><img width='14px' height='14px' src='"+website+"'></a></td>" +
						"<td style='width:13%;padding-left:20px'>"+dura+"</td>"+
						"<td style='width:13%;padding-left:30px'><i onclick='editDiary("+data[k].id+")' class='Hui-iconfont'>&#xe60c;</i>"+
						"&nbsp;<i onclick='feedBack("+data[k].id+")' title='反馈错误' class='Hui-iconfont'>&#xe70c;</i></td></tr>");
				$(".songNameOrTitle").html('歌名');
				$(".singerOrWritter").html('歌手')
			}
		}
	});
}
function ajaxLoadAudio(list){
	$.ajax({
		type:"Post",
		async:false,
		url:"http://www.duola.vip/note/diary/getAudioByIds.do",
		data:{
			ids:list
		},
		dataType:"Json",
		success:function(data){
			songInfo=data.result;
			for(var k=0;k<songInfo.length;k++){
				var na=songInfo[k].ntitle+"";
				if(na.length>8){
					na=na.substring(0, 8)+"...";
				}
				$('.songs').append("<tr style='' ondblclick='playAudios(1,"+k+",\""+songInfo[k].nSongId+"\")' onmouseout=\"hidePlayBtn(this,"+songInfo[k].nid+")\" onmouseover=\"showPlayBtn(this,"+songInfo[k].nid+")\" id='songName"+k+"'>" +
						"<th style='width:6%;'><input type='checkbox' id='chooseIndex"+k+"' onclick='chooseWhich("+k+")'></th>"+
						"<td style='width:8%;' id='xu"+k+"'>"+(k+1)+"&emsp;</td>" +
						"<td style='width:33%;'><span>" +
						"<a title='"+songInfo[k].ntitle+"'>"+na+"</a>" +
						"&nbsp;<span style='visibility:hidden;' id='playBtn"+songInfo[k].nid+"'>" +
						"<i class='Hui-iconfont' onclick='playAudios(1,"+k+",\""+songInfo[k].nSongId+"\")'>&#xe6e6;</i>" +
						"&nbsp;<i class='Hui-iconfont' onclick='removeSong("+(songInfo.length-k)+")'>&#xe609;</i>"+
						"&nbsp;<i class='Hui-iconfont' onclick='addToSongList(1,"+songInfo[k].nid+")'>&#xe604;</i>"+
						"</span></span></td>" +
						
						"<td style='width:22%;padding-left:33px'><a onclick=\"\" title='"+songInfo[k].userName+"'>"+songInfo[k].userName+"</a></td>" +
						"<td style='width:13%;padding-left:13px'><a href='http://www.duola.vip/diary/"+songInfo[k].nid+"'  target='_blank'><img width='14px' height='14px' src='http://img.duola.vip/image/logo/dlam.jpg'></a></td>"+
						"<td style='width:13%;padding-left:20px'>--</td>"+
						"<td style='width:13%;padding-left:30px'></td>"+
				"</tr>");
				$(".songNameOrTitle").html('标题');
				$(".singerOrWritter").html('作者');
				$("#alyric").html('');
				$("#lyric").html('');
			}
		}
	});
}
//7.编辑歌曲信息
function editDiary(id){
	var userId=getCookie("userId")+"";
	if(userId=="5211314"){
		window.open("http://m.duola.vip/amaze/editSong.jsp?id="+id+"","_blank")
	}else{
		vant.Toast("permission denied")
	}
}
function feedBack(id){
	vant.Toast("感谢反馈，请联系站长处理（QQ群：415086137）")
}
function inputSong(){
	var userId=getCookie("userId")+"";
	if(userId){
		if(userId=="5211314"){
			openSongInput()
		}else{
			vant.Toast("请联系站长获取录歌权限（QQ群：415086137）")
		}
	}else{
		vant.Toast("请先登录！！！")
	}
}
//行不通----获取网络音频资源的时长
function getDuration(sid){//getDuration(data[k].sourceId)
	var url="";
	if(sid.substring(sid.length-5)==".html"){
		url="http://link.hhtjim.com/qq/"+sid.substring(0, sid.length-5)+".mp3";
	}else if(sid.substring(sid.length-3)==".kw"){
		url="http://link.hhtjim.com/kw/"+sid.substring(0, sid.length-3)+".mp3";
	}else if(sid.substring(sid.length-4)==".553"){
		url="http://www.duola.vip/res/audio/"+sid.substring(0, sid.length-4)+".mp3";
	}else if(sid.substring(sid.length-4)==".aac"||
			sid.substring(sid.length-4)==".m4a"||
			sid.substring(sid.length-4)==".mp3"||
			sid.indexOf("voice")!=-1){//微信的音频例：https://res.wx.qq.com/voice/getvoice?mediaid=MzI0NDI3MTE4MF8yNjU3NDU1Nzk0
		url=sid;
	}else{
		url="http://music.163.com/song/media/outer/url?id="+sid+".mp3";
	}
	console.log(url)
	var p=document.getElementById("audio");
	p.src=url;
	return getTime(p.duration+"");
}
//10-30  选择歌曲以供移除播放列表
function chooseWhich(which){
	if(which||which==0){
		var checked=document.getElementById("chooseIndex"+which).checked;
		if(checked)
			chooseIndexs.push(which);
		else{
			document.getElementById("chooseIndex").checked="";
//			chooseIndexs.splice(which,1)
		}
	}else{
		var checked=document.getElementById("chooseIndex").checked;
		chooseIndexs=[];
		if(checked){//全选
			for(var i=0;i<songs.length;i++){
				document.getElementById("chooseIndex"+i).checked="checked";
				chooseIndexs.push(i);
			}
		}else{
			for(var i=0;i<songs.length;i++){
				document.getElementById("chooseIndex"+i).checked="";
			}
		}
	}
	console.log(chooseIndexs)
}
//8.id为空时清空播放列表，不为空时清掉序号为id的歌曲
function removeSong(id){
	if(id){
		var name="";
		if(what=="0")
			name=songInfo[songsLength-id].songName;
		else
			name=songInfo[songsLength-id].ntitle;
		var c=confirm("确定将‘"+name+"’移出播放列表？")
		if(c==true){
			songs.splice(id-1,1);
			console.log(songs)
			setCookie("songList",songs);
			vant.Toast("已移出播放列表");
		}
	}else{
		if(songInfo.length==0||songs.length==0){
			vant.Toast("播放列表为空");
			return;
		}
		emptyAlert=1;
		var c=confirm("确定清空播放列表？")
		if(c==true){
			var song='';
			for(var s in songs)
				song=song+','+songs[s];
			console.log(song)
			createList(song,0);//清空前先向表中添加记录
			
			songInfo=[];
			setCookie("songList",[]);
			setCookie("audioList",[]);
			$('.songs').html("")
			document.getElementById("emptyIcon").style.display="block";
			vant.Toast("播放列表已清空");
		}
	}
	
}
//9.显示与隐藏播放按钮
function showPlayBtn(obj,id,type){
	document.getElementById("playBtn"+id).style.visibility="visible";
}
function hidePlayBtn(obj,id,type){
	document.getElementById("playBtn"+id).style.visibility="hidden";
}
//10.播放音频	from表示如何进入该函数，0表示通过next、preview，1表示通过点击播放按钮，2表示通过ajaxSongs函数
function playAudios(from,index,sid){
	if(from==1){//next、preview函数中已赋值，此处不需赋值lastPlay。其他需赋值
		lastPlay=nowplay;
	}
	nowplay=index;
	var song=document.getElementById("audio");
	
	nowId=sid+"";
	sid=sid+"";
	var url="";
	if(sid.substring(sid.length-5)==".html"){
		url="http://link.hhtjim.com/qq/"+sid.substring(0, sid.length-5)+".mp3";
	}else if(sid.substring(sid.length-3)==".kw"){
		url="http://link.hhtjim.com/kw/"+sid.substring(0, sid.length-3)+".mp3";
	}else if(sid.substring(sid.length-4)==".553"){
		url="http://img.duola.vip/audio/"+sid.substring(0, sid.length-4)+".mp3";
	}else if(sid.substring(sid.length-4)==".aac"||
			sid.substring(sid.length-4)==".m4a"||
			sid.substring(sid.length-4)==".mp3"||
			sid.indexOf("voice")!=-1){//微信的音频例：https://res.wx.qq.com/voice/getvoice?mediaid=MzI0NDI3MTE4MF8yNjU3NDU1Nzk0
		url=sid;
	}else{
		url="http://music.163.com/song/media/outer/url?id="+sid+".mp3";
	}
	addPlayRecord(from,song.currentTime);

	song.src=url;
	//设置图片
	var img=songInfo[index].imgPath+"";
	var artist="";
	if(img.indexOf("http")!=-1){
		artist=img;
	}else if(img.substring(img.length-4, img.length)==".jpg"&&navigator.onLine){//网易云音乐的img
		artist="http://p1.music.126.net/"+img;
	}else if(img.substring(0,4)=="T002"&&navigator.onLine){//QQ音乐的img
		artist="https://y.gtimg.cn/music/photo_new/"+img+".jpg?max_age=2592000";//https://y.gtimg.cn/music/photo_new/T002R300x300M000002iWU6B2ZvA8V.jpg?max_age=2592000
	}else{
		/*var family=new Array("me","me080501","me080502","me1","me2","me3",
				"zhaoying","zhaoying1","zhaoying2","zhaoying3","zhaoying4","zhaoying5",
				"zhaoying6","zhaoying7","zhaoying8","zhaoying9","zhaoying10",
				"xiehaole","xiehaole1","xiehaole2","xiehaole3","xiehaole4","xiehaole5",
				"tangxinying","tangxinying1","tangxinying2",
				"shiying","shiying1","shiying2");
		var beauty=new Array("beauty1","beauty2","beauty3","beauty4","beauty5","beauty6","beauty7",
				"beauty8","beauty9","beauty10","beauty11","beauty12","beauty13","beauty14",
				"beauty15","beauty16","beauty17","beauty18","beauty19","beauty20");
		var fn=random(0, family.length-1);
		var bn=random(0, beauty.length-1);
		if(fn>bn){
			artist="http://img.duola.vip/image/artist/"+family[fn]+".jpg";
		}else{
			artist="http://img.duola.vip/image/beauty/"+beauty[bn]+".jpg";
		}*/
		artist="http://img.duola.vip/image/album_logo.png"
	}
	document.getElementById('albumImg').src=artist;
	
	if(what=="0"){//歌曲才加载歌词
		var au="http://m.duola.vip/querySongBySId.do?sourceId="+sid;
		$.ajax({
			type:"Get",
			async:false,
			url:au,
			dataType:"json",
			success:function(data){
				var lyric=""+data.lyric;
				if(lyric.indexOf("<br>")==-1){
					lyric=lyric.replace(new RegExp("\n","gm"),"<br>");
				}
				lyric=lyric.replace(regex, "");//去掉歌词中的中括号及时间
				document.getElementById("alyric").innerHTML=lyric;
			}
		});
		
		//加载单句歌词
		document.getElementById("lyric").innerHTML='';
		if(sid.indexOf("kw")!=-1){//酷我音乐加载其单句歌词
			var u="http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId="+sid.substring(0, sid.indexOf(".kw"))+"&httpsStatus=1&reqId=409abf60-13af-11eb-a084-fff7f67c88c7";
			$.ajax({
				type:"Get",
				async:false,
				url:u,
				dataType:"text",
				success:function(res){
					var data=res+"";
					var klyric=data.substring(data.indexOf("lrclist")+10, data.indexOf("simpl")-3);
					var kwlyric=klyric.split("lineLyric");
					singlelyrics=[]
					for(var i=1;i<kwlyric.length;i++)
					{
						var lrc=kwlyric[i]+'';
						var l=lrc.substring(3, lrc.indexOf("time")-3)
						var t=lrc.substring(lrc.indexOf("time")+7, lrc.indexOf("."))
						singlelyrics.push({time:t,lrc:l})
//						singlelyrics.push({t:l})
					}
				}
			});

		}
		if(1==1){//网易云音乐、QQ音乐、553Music加载其单句歌词，酷我音乐添加播放记录	
//			var u="http://music.163.com/api/song/lyric?id="+sid+"&lv=1&kv=1&tv=-1";//不支持跨域
			var u="http://www.duola.vip/loadLyric3.jsp?sid="+sid+"&type=0&from=0";
			$.ajax({
				type:"Get",
				async:false,
				url:u,
				dataType:"text",
				success:function(res){
					if(sid.indexOf("kw")!=-1){
					}else{
						var klyric=res+"";
						singlelyrics=[]
						if(sid.indexOf("html")==-1&&sid.indexOf("553")==-1){//网易云音乐
							var kwlyric=klyric.split("[");
							for(var i=1;i<kwlyric.length;i++)
							{
								var lrc=kwlyric[i]+'';
								var l=lrc.substring(lrc.indexOf("]")+1)
								var t=lrc.substring(0, lrc.indexOf("]"))
								singlelyrics.push({time:t,lrc:l})
							}
						}else{
							var kwlyric=klyric.split("\r");
							for(var i=1;i<kwlyric.length;i++)
							{
								var lrc=kwlyric[i]+'';
								if(lrc.indexOf("《")!=-1){
									var l=lrc.substring(0, lrc.indexOf("《"))
									var t=lrc.substring(lrc.indexOf("《")+1)
									singlelyrics.push({time:t,lrc:l})
								}
							}
						}
					}
				}
			});
		}
	}else{
		document.getElementById("alyric").innerHTML=songInfo[index].ncontent;
	}
	
	var btn=document.getElementById("pause");
	btn.src="http://img.duola.vip/image/play.png";
	if(what=="0"){//
		document.title=songInfo[index].songName+"-正在播放...|哆啦网"
		vant.Toast(songInfo[index].songName)
	}else{
		document.title=songInfo[index].ntitle+"-正在播放...|哆啦网"
		vant.Toast(songInfo[index].ntitle)
	}
	alterStatus(index);
	locateNowPlay();
	
	deg=0;
	rotateCircle();
}
//11.播放某首歌时将这首歌特殊显示，同时播放的歌曲滚动至可见范围
function alterStatus(index){
	for(var i=0;i<songInfo.length;i++){
		if(i==index){
			$("#songName"+i).css("color","#e91e63");
			$("#xu"+i).html("<img style='width: 12px;height: 12px' src='http://img.duola.vip/image/playing.gif'/>");
		}else{
			$("#songName"+i).css("color","white");
			$("#xu"+i).html(addZero(i+1));
		}
	}
}
//记录音频的播放记录，（为了同时记录到音频已播放的时长，采用了音频播放结束才记录），
//弊端是:当用户强制关掉页面时，最后一条播放记录不会记录到;from=2时，可能记录不准确
function addPlayRecord(from,duration){
	if(!duration)
		return;
	var url="/AddPlayRecordServlet";
	var songId=0;
	var songType;
	if(what=="0"&&songInfo[lastPlay]&&songInfo[lastPlay].id){//歌曲
		songId=songInfo[lastPlay].id;
	}else if(what=="1"&&songInfo[lastPlay]&&songInfo[lastPlay].nid){//音频
		songId=songInfo[lastPlay].nid;
	}else{//无上一次播放
		return;
	}
	if(from==2){
		songType=2;
	}else{
		songType=what;
	}
	$.ajax({
		url:url,
		type:"Get",
		async:false,
		data:{
			song_id:songId,
			song_type:songType,
			duration:getTime(duration+"")
		}
	});
}
//12.暂停、播放音频
function pause_play() {
	var p=document.getElementById("audio");
	var btn=document.getElementById("pause");
	if(p.paused==false){//原本是播放状态，则置为暂停状态
		p.pause();
		btn.src="http://img.duola.vip/image/pause.png";
		stopRotateCircle()
	}else{
		p.play();
		btn.src="http://img.duola.vip/image/play.png";
		p.paused=false;
		rotateCircle();
	}
}
//hui图标实现暂停、播放
function pauseOrplay() {
	var p=document.getElementById("audio");
	var btn=document.getElementById("pause");
	if(p.paused==false){//原本是播放状态，则置为暂停状态
		p.pause();
		btn.innerHTML="&#xe6e6;";
		stopRotateCircle()
	}else{
		p.play();
		btn.innerHTML="&#xe6e5;";
		p.paused=false;
		rotateCircle();
	}
}
//13.音频播放监听器
function monitor() {
	if(!nowId)
		return;
	var p=document.getElementById("audio");//音乐播放控件
	var per=document.getElementById("time");//
	var pro=document.getElementById("pro");//进度条
	if(p.networkState==3){//2正常，3异常
//    			alert("出现了异常~_~");
		//next();
	}
	if(!p.duration)
		return;
    time=p.duration+"";
	var ctime=p.currentTime+"";
    //设置音乐播放进度条，和音乐已播放时长和总时长
    per.innerText=getTime(ctime)+"/"+getTime(time);
	pro.value=(p.currentTime/p.duration*100.00);
	
	if(what=="0"){
		var lrc='';
		if(nowId.indexOf("kw")!=-1){//酷我音乐
			lrc=getSingleLyric(ctime,nowId)
		}else{
			lrc=getSingleLyric(getTime(ctime),nowId)
		}
		if(lrc){
			document.getElementById("lyric").innerHTML=lrc;
		}
	}
	
	if(p.ended==true){//若当前音频播放结束，自动播放下一首
		next();
	}
}

//2020-10-24获取单句歌词
function getSingleLyric(time,sid){
	var lrc="";
	if(nowId.indexOf("kw")!=-1){//酷我音乐
		for(var i=0;i<singlelyrics.length;i++){
			if((time+'').substring(0,(time+'').indexOf('.'))==singlelyrics[i].time){
				lrc=singlelyrics[i].lrc;
				break;
			}
		}
	}else{
		for(var i=0;i<singlelyrics.length;i++){
			var l=singlelyrics[i].time+'';
			if(l.indexOf(time)!=-1){
				lrc=singlelyrics[i].lrc;
				break;
			}
		}
	}
	return lrc;
}
//15.下一曲
function next(){
	lastPlay=nowplay;
	if(mode=="order"){//顺序播放
		if(nowplay<(songInfo.length-1)){
			nowplay=nowplay+1;
		}else{
			nowplay=0;
		}
	}else if(mode=="single"){//单曲循环播放
		nowplay=nowplay;
	}else{
		nowplay=Math.round(Math.random()*(songInfo.length-1-0)+0); 
	}
	if(what=="0")
		playAudios(0,nowplay,songInfo[nowplay].sourceId);
	else
		playAudios(0,nowplay,songInfo[nowplay].nSongId);
}
/**
 * 16.实现上一曲按钮功能
 * 顺序播放模式时播放上一首，
 * 随机播放模式时随机生成一个歌曲序号来播放
 * 单曲循环模式时只播放当前歌曲
 */
function preview(){
	lastPlay=nowplay;
	if(mode=="order"){//顺序播放
		if(nowplay>0){
			nowplay=nowplay-1;
		}else{
			nowplay=songInfo.length-1;
		}
	}else if(mode=="single"){//单曲循环
		nowplay=nowplay;
	}else{//随机播放
		nowplay=Math.round(Math.random()*(songInfo.length-1-0)+0); 
	}
	if(what=="0")
		playAudios(0,nowplay,songInfo[nowplay].sourceId);
	else
		playAudios(0,nowplay,songInfo[nowplay].nSongId);
}
/**
 * 17.切换播放模式
 */
function change(){
	var m=document.getElementById("mode");
	if(mode=="order"){//当前模式为顺序，则切换为随机
		mode="random";
		m.src="http://img.duola.vip/image/play_random.png";
		m.title="随机播放--Alt+C键切换";
	}else if(mode=="random"){//当前播放为随机，则切换为单曲
		mode="single";
		m.src="http://img.duola.vip/image/play_single.png";
		m.title="单曲循环--Alt+C键切换";
	}else{//当前播放为单曲，则切换为顺序循环
		mode="order";
		m.src="http://img.duola.vip/image/play_order.png";
		m.title="顺序循环--Alt+C键切换";
	}
}
//20.切换背景
function changeSkin(){
	var colors=new Array("pink","orange","cyan","purple");//背景色
	var backImgs=new Array("alarmBack1.png","back0.jpg","back1.jpg","back2.jpg","back4.jpg","back6.jpg");//背景图
	var m=random(colors.length-1);
	var n=random(backImgs.length-1);
	//随机设置背景色
	var body=document.getElementById("body");
	if(m>n){
		body.style.background=colors[m];
	}else{
		body.style.background="url(\"http://img.duola.vip/image/back/"+backImgs[n]+"\")";
	}
}

/**
 * 22.键盘监听事件
 * P键--播放/暂停，左键--上一首，右键--下一首
 * A~G	65-71
 * H~N	72-78
 * O~T	79-84
 * U~Z	85-90
 * @param event
 */
function keydown(event) {
	var p=document.getElementById("audio");
	var btn=document.getElementById("pause");
	var e = event || window.event || arguments.callee.caller.arguments[0];//组合键
	if(event.keyCode=="80"&&e.altKey){
		pause_play(event.keyCode);
//		pauseOrplay(event.keyCode);
	}else if(event.keyCode=="37"&&e.altKey){//左键
		preview();
	}else if(event.keyCode=="39"&&e.altKey){//右键
		next();
	}else if(event.keyCode=="38"&&e.altKey){//上键
		alterVolume(3);
	}else if(event.keyCode=="40"&&e.altKey){//下键
		alterVolume(2);
	}else if(event.keyCode=="67"&&e.altKey){//C键--切换播放模式
		change();
	}else if(event.keyCode=="66"&&e.altKey){//B键--改变页面背景
		changeSkin();
	}else if(event.keyCode=="65"&&e.altKey){//A键--快退十秒
		back(2);
	}else if(event.keyCode=="68"&&e.altKey){//D键--快进十秒
		moveon(2);
	}else if(event.keyCode=="69"&&e.altKey){//E键--快进5秒
		moveon(1);
	}else if(event.keyCode=="81"&&e.altKey){//Q键--快退5秒
		back(1);
	}else if(event.keyCode=="82"&&e.altKey){//R键--播放随机歌曲
		if(ranPlayId!=0){
			playerAudio(ranPlayId,2)
		}else{
//			vant.Toast('你还未开启歌曲随机推荐功能，是否立即开启？')
			var r=confirm("你还未开启歌曲随机推荐功能，是否立即开启？");
			if(r==true)
				oacRecommend();
		}
	}else if(event.keyCode=="83"&&e.altKey){//S键--打开歌曲搜索框
		openMusic();
	}/*else if(event.keyCode=="83"&&e.altKey){//S键--
		showHide();
	}*/
}
/**
 * 23.快进\快退
 * @param bei
 */
function moveon(bei){
	bei=parseInt(bei);
	var p=document.getElementById("audio");
	p.currentTime=p.currentTime+5*bei;
}
function back(bei){
	bei=parseInt(bei);
	var p=document.getElementById("audio");
	p.currentTime=p.currentTime-5*bei;
}
//修改音频正在播放为点击进度条的位置对应
function alterProcess(){
	var p=document.getElementById("audio");//音乐播放控件
	var pro=document.getElementById("pro");//进度条
	p.currentTime=p.duration*pro.value/100;
}
//暂未实现，需解决：如何获取鼠标放在进度条上的位置 onmouseover="alterTitle()"
function alterTitle(){
	var pro=document.getElementById("pro");//进度条
	pro.title=pro.value+'\r\n'+'alt+A键---快退10秒,alt+D键---快进10秒;alt+Q键---快退5秒,alt+E键---快进5秒'
}
/**
 * 2020-10-28 音量调整函数
 * 静音、取消静音、调高调低音量等
 * @param type	0:静音、取消静音，1:滑动,2:减，3:加
 */
function alterVolume(type){
	var p=document.getElementById("audio");
	var vo=document.getElementById("voice");//声音从0-1
	if(type==0){
		if(vo.value==0){//取消静音
			vo.value=100;
			p.volume=1;
		}else{//静音
			vo.value=0;
			p.volume=0;
		}
	}else if(type==1){//滑动
		p.volume=vo.value/100;
	}else if(type==2){//减
		if(vo.value==0){
			vant.Toast("使出了洪荒之力，音量已经到静音了，不能再减了");
		}else{
			vo.value=vo.value-10;
			p.volume=p.volume-0.1;
		}
	}else if(type==3){//加
		if(vo.value==100){
			vant.Toast("哎呀，音量已经到最大了，不能再加了");
		}else{
			vo.value=vo.value+10;
			p.volume=p.volume+0.1;
		}
	}
}
/**
 * from==0 歌曲，1日记
 */
function addToSongList(from,id){
	vant.Toast("暂不支持"+id)
}

var randomRecommendThread;
function oacRecommend(){
	var title=document.getElementById("randomRecom").title;
	if(title=='点击开启随机推荐'){
		randomRecommendThread=window.setInterval("randomSong()", 10000);
		vant.Toast("已开启歌曲随机推荐，系统每10秒为你推荐一首歌曲,\r\n再次点击可关闭。（快捷键ALT+R直达播放）");
		document.getElementById("randomRecom").title="点击关闭随机推荐";
	}else{
		ranPlayId=0;//随机播放id置零，使用快捷键不再自动播放
		window.clearInterval(randomRecommendThread);
		vant.Toast("已关闭歌曲随机推荐");
		document.getElementById("randomRecom").title="点击开启随机推荐";
	}
}
function randomSong(){
//	vant.Toast("点歌曲名播放哦^-^<br>"+"<font onclick='play(this,1)'>---</font>")
	ranPlayId=random(1,sysSongNum);
	$.ajax({
		type:"Get",
		async:false,
		url:"http://m.duola.vip/querySongById.do?id="+ranPlayId,
		dataType:"Json",
		success:function(data){
			vant.Toast("欢迎搜索聆听：‘"+data.singer+"’的‘"+data.songName+"’,\r\n快捷键ALT+R直达播放")
			document.getElementById("randomRecom").title="点击关闭随机推荐\r\n当前推荐：‘"+data.singer+"’的‘"+data.songName+"’";
		}
	});
}
function randomPList(num){
	var pList=new Array();
	for(var i=0;i<num;i++){
		var n=random(1,sysSongNum);
		pList[i]=n;
	}
	
	var songIds=","+pList+",";
	createList(songIds,1);
	
	$(".songs").html('')
	ajaxLoadSongs(pList,1)
}
function createList(songs,from){
	var userId=getCookie("userId")+"";
	var desc='';
	if(from==1){
		desc=userId+"哆啦网随机播放歌曲创建的歌单"
	}else{
		desc=userId+"哆啦网听过的播放列表"
	}
	var url="http://m.duola.vip/newList.do";
	$.ajax({
		type:"POST",
		async:false,
		url:url,
		data:{
			name:formatW2(new Date()+""),
			desc:desc,
			songIds:songs,
			creator:userId
		},
		dataType:"Json",
		success:function(data){
			
		}
	});
}
function loadHotSongs(num){
	var pList=new Array();
	$.ajax({
		type:"Get",
		async:false,
		url:"http://m.duola.vip/queryHotSongs.do?num="+num,
		dataType:"Json",
		success:function(data){
			for(var k=0;k<data.length;k++){
				pList.push(data[k].id);
			}
		}
	});
	$(".songs").html('')
	ajaxLoadSongs(pList,1)
}

//打开音乐录入框
function openSongInput(){
	$("#songInput").css("display","inline-block");
}
//关闭音乐录入框
function closeSongInput(){
	$("#songInput").css("display","none");
}
//录入歌曲
function addSong(){
	var form=document.getElementById("songInput");
	var sourceId=form.sourceId.value+"";
	var songName=form.songName.value+"";
	var singer=form.singer.value+"";
	var duration=form.duration.value+"";
	
	var album=form.album.value+"";
	var imgPath="";//form.imgPath.value+
	var website=form.website.value+"";
	var descr=form.descr.value+"";
	var releaseTime=form.releaseTime.value+"";
	var time=formatW2(new Date()+"");
	if(sourceId.length==0||songName.length==0||singer.length==0){
		alert("部分信息未输入！！！")
		return ;
	}
	var picture="";
//	alert(util);
	$.ajax({
		type:"post",
		async:true,
		url:"http://m.duola.vip/addSong.do",
		data:{
			sourceId:sourceId,
			songName:songName,
			singer:singer,
			duration:duration,
			album:album,
			imgPath:imgPath,
			website:website,
			descr:descr,
			releaseTime:releaseTime,
			time:time
		},
		dataType:"Json",
		success:function(res){
			if(res){
				vant.Toast(res.msg);
			}
		}
	});
}
function switchTab(which){
	switch(which){
		case 0:
			vant.Toast('秉着优质内容分享计划，本站部分音频来自第三方网站，本站方不提供存储服务，\r\n'+
					'如有侵犯您的合法权益，敬请联系邮箱1459892910@qq.com告知，谢谢！')
			window.open("https://support.qq.com/products/136712/faqs/81685","_blank")
			break;
		case 1:
			changeSkin()
			break;
		case 2:
			openMusic()
			break;
		case 3:
			oacRecommend()
			break;
		case 4:
			inputSong();
			break;
		case 5:
			vant.Toast('暂不支持多选移除，请单首移除或清空列表！')
			break;
	}
}
/**
 * 定位到当前播放歌曲
 * from=1时表示点击定位按钮，需弹出提示
 * @param from
 */
function locateNowPlay(from){
	//console.log('滑动到播放歌曲所在位置，播放列表歌曲数量'+songs.length+'，当前歌曲数量'+songInfo.length+'当前播放歌曲'+nowplay)
	if(songInfo.length>20){
		var s=document.getElementById('songList');
		s.scrollTop=nowplay*22;
		if(from&&from==1){
			vant.Toast('已定位到当前播放歌曲')
		}
	
//		var scroll=setInterval(function () {
//			if(s.scrollTop >= nowplay*22) {
//				window.clearInterval(scroll)
//			} else {
//					// 如果存在网页缩放，很有可能没有效果，但是else部分的代码会执行
//					// 原因：刚才讲到的scrollTop三个注意中标黄的一条
//					// 设置scrollTop的值小于0，即scrollTop被设为0
//					// 可以缩放跑一下，然后不刷新的状态下恢复百分之百跑一下，再缩放，打印scrollTop的值
//					// 你会发现正常尺寸执行时打印的第一个值不是加法，而是减法，即scrollTop++增加负值
//					// 这样的话就对应上了scrollTop的注意点了，增加的值小于0，就被设为0
//				s.scrollTop=s.scrollTop+13;
//			}
//		}, 20);
	}
//	$('#songList').css('scrollTop',0)
}

function rotateCircle(){
	if(rotateThread){//如果不关闭切换歌曲后会重复创建定时器，每切换一首创建一个
		window.clearInterval(rotateThread);
	}
	rotateThread=window.setInterval("rotateLogo()", "600");
}
//停止旋转
function stopRotateCircle(){
	window.clearInterval(rotateThread);
}
/**
 * 27.旋转logo
 * @param deg 旋转角度
 */
function rotateLogo(){
	document.getElementById("albumImg").style.transform="rotate("+deg+"deg)";//
	deg=deg+5;
}
