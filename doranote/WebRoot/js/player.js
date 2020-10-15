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
var thread=window.setInterval("loadAudio(1)", 1000)
var monitorThread=window.setInterval("monitor()", 1000);
document.addEventListener("keydown", keydown);
/**
 * 1.图标tab栏切换函数
 * @param which	0:热播，1：歌曲播放列表，2：音频播放列表
 */
function loadAudio(which){
	$(".songs").html('<img src="http://img.duola.vip/image/loading1.gif" style="width: 28px;height: 28px;margin-left:250px;margin-top:60px">');

	var tabs=new Array("hotPlayBtn","songsBtn","audiosBtn","listBtn","ranRecomBtn");
	var rawBtn=["&#xe6c1;","&#xe60f;","&#xe6a5;","&#xe68b;","&#xe6d0;"];
	for(var i=0;i<5;i++){
		if(i==which){
			$("#"+tabs[i]).html("<img style='width: 16px;height: 16px' src='http://img.duola.vip/image/playing.gif'/>");
		}else{
			$("#"+tabs[i]).html("<i class='Hui-iconfont' style='font-size:15px'>"+rawBtn[i]+"</i>");
		}
	}
	if(which==0){//加载热播歌曲
		var n=random(10,20);
		loadHotSongs(n)
		vant.Toast("加载"+n+"首热播歌曲")
		$("#hotPlaynum").html(n);
	}else if(which==1){//加载歌曲
		console.log("loadSong:加载歌曲")
		window.clearInterval(thread);
		thread=window.setInterval(loadSongList, 1000)
		lastWhat=what;
		what="0";
		songsLength=0;
		lastSongsLength=0;
	}else if(which==2){//加载音频
		console.log("loadAudio:加载音频")
		window.clearInterval(thread);
		thread=window.setInterval(loadSongList, 1000)
		lastWhat=what;
		what="1";
		songsLength=0;
		lastSongsLength=0;
	}else if(which==3){//加载歌单
		vant.Toast("暂不支持")
	}else if(which==4){//随机推荐歌曲
		var n=random(10,20);
		randomPList(n)
		vant.Toast("已为你随机推荐"+n+"首歌曲")
		$("#ranRecomnum").html(n);
	}
}

//3.关闭窗口前修改cookie状态
function closeWindow(){
	setCookie("showPlayer","0");
	/* if(event.clientX>document.body.clientWidth && event.clientY < 0 || event.altKey){ 
		setCookie("showPlayer","0");
	}else{ 
	} */
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
	if(list.charAt(list.length-1)==","){
		list=list.substring(0,list.length-1)
	}
	if(list.charAt(0)==","){
		list=list.substring(1)
	}
	console.log(list)
	
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
						"<td style='width:13%;padding-left:33px;' id='xu"+k+"'>"+(k+1)+"&emsp;</td>" +
						"<td style='width:23%;'><span><a title='"+data[k].songName+"'>"+na+"</a>" +
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
						"<td style='width:13%;padding-left:33px;' id='xu"+k+"'>"+(k+1)+"&emsp;</td>" +
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
		var c=confirm("确定清空播放列表？")
		if(c==true){
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
	var song=document.getElementById("audio");
	
	nowId=sid+"";
	sid=sid+"";
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
				document.getElementById("alyric").innerHTML=lyric;
			}
		});
	}else{
		document.getElementById("alyric").innerHTML=songInfo[index].ncontent;
	}
	addPlayRecord(from,song.currentTime);

	song.src=url;
	var btn=document.getElementById("pause");
	btn.src="http://img.duola.vip/image/play.png";
	if(what=="0"){//
		document.title=songInfo[index].songName+"-正在播放..."
		vant.Toast(songInfo[index].songName)
	}else{
		document.title=songInfo[index].ntitle+"-正在播放..."
		vant.Toast(songInfo[index].ntitle)
	}
	alterStatus(index);

}
//11.播放某首歌时将这首歌特殊显示
function alterStatus(index){
	for(var i=0;i<songInfo.length;i++){
		if(i==index){
			$("#songName"+i).css("color","#e91e63");
			$("#xu"+i).html("<img style='width: 16px;height: 16px' src='http://img.duola.vip/image/playing.gif'/>");
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
	}else{
		p.play();
		btn.src="http://img.duola.vip/image/play.png";
		p.paused=false;
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
    var time=p.duration+"";
	var ctime=p.currentTime+"";
    //设置音乐播放进度条，和音乐已播放时长和总时长
    per.innerText=getTime(ctime)+"/"+getTime(time);
	pro.value=(p.currentTime/p.duration*100.00);
	
	if(what=="0"){
		var url="http://m.duola.vip/amaze/loadLyric3.jsp?sid="+nowId+"&time="+getTime(ctime)+"&type=1&from=0";
		$.ajax({
			type:"Get",
			async:false,
			url:url,
			dataType:"text",
			success:function(data){
				document.getElementById("lyric").innerHTML=data;
			}
		});
	}
	
	if(p.ended==true){//若当前音频播放结束，自动播放下一首
		next();
	}
}
//14.格式化时间
function getTime(time) {//根据秒换算为分和秒
	time=time.substring(0, time.indexOf(".", 0));
    //var min=Math.round(time/60)+"";//分钟---此方法在秒为31时会直接将分得为1，不可靠
	//整型分钟数加空字符变为字符型方可执行下方的.length方法
	var min=parseInt(time/60)+"";
    var sec=time%60+"";//秒
    //保持格式为00:00
    if(min.length==1){
    	min="0"+min;
    }
    if(sec.length==1){
    	sec="0"+sec;
    }
    return min+":"+sec;
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
 * 16.实现上一曲按钮功能------
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
		m.src="http://img.duola.vip/image/play_random.png";//http://longqcloud/Minimusic/
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
//18.该函数实现固定、取消固定底部栏
function fixBottom(){
	window.removeEventListener("mousemove",hideBottom);
//    		window.releaseEvents(Event.MOUSEOVER);
	var html=document.getElementById("lock").style.display="none";
	var html=document.getElementById("unlock").style.display="inline-block";
}
function unfixBottom(){
	window.addEventListener("mousemove",hideBottom);
	var html=document.getElementById("lock").style.display="inline-block";
	var html=document.getElementById("unlock").style.display="none";
}
//19.隐藏、显示底部栏歌曲
function hideBottom(){
	var width=document.body.clientWidth;//1366
	var height=document.body.clientHeight;//579
//	console.log(width)//579+1366=1945
//	console.log(height)
	var e = event || window.event;
	if(e.clientX>0&&e.clientX<width&&e.clientY>(height+60)&&e.clientY<height){
		document.getElementById("bottom").style.visibility="visible";
	}else{
		document.getElementById("bottom").style.visibility="hidden";
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
//21.随机生成整数
function random(min, max){
	// 若max不存在 min 赋值给max,并重新赋值min
	if(max == null){
		max = min;  
		min = 0;
	}
	return min+ Math.floor(Math.random()*(max-min+1))
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
	}else if(event.keyCode=="37"&&e.altKey){//左键
		preview();
	}else if(event.keyCode=="39"&&e.altKey){//右键
		next();
	}else if(event.keyCode=="38"&&e.altKey){//上键
		add();
	}else if(event.keyCode=="40"&&e.altKey){//下键
		minus();
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
/**
 * 25.音量减、加，音量进度条随之变化
 */
function minus() {
	var p=document.getElementById("audio");
	var vo=document.getElementById("voice");
	if(vo.value==0){
		vant.Toast("使出了洪荒之力，音量已经到静音了，不能再减了");
	}else{
		vo.value=vo.value-10;
		p.volume=p.volume-0.1;
	}
}
function add() {
	var p=document.getElementById("audio");
	var vo=document.getElementById("voice");//声音从0-1
	if(vo.value==100){
		vant.Toast("哎呀，音量已经到最大了，不能再加了");
	}else{
		vo.value=vo.value+10;
		p.volume=p.volume+0.1;
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
	if(title=='开启随机推荐'){
		randomRecommendThread=window.setInterval("randomSong()", 10000);
		vant.Toast("已开启歌曲随机推荐");
		document.getElementById("randomRecom").title="关闭随机推荐";
	}else{
		window.clearInterval(randomRecommendThread);
		vant.Toast("已关闭歌曲随机推荐");
		document.getElementById("randomRecom").title="开启随机推荐";
	}
}
function randomSong(){
	vant.Toast("点歌曲名播放哦^-^<br>"+"<font onclick='play(this,1)'>---</font>")
}

function randomPList(num){
	var pList=new Array();//清空原播放列表数组
	for(var i=0;i<num;i++){
		var n=random(1,934);
		pList[i]=n;
	}
	
	var songIds=","+pList+",";
	var url="http://m.duola.vip/newList.do?name="+formatW2(new Date()+"")+"&desc="+formatW2(new Date()+"")+"于哆啦网随机播放歌曲创建的歌单&songIds="+songIds+"&creator=0";
	$.ajax({
		type:"Get",
		async:false,
		url:url,
		dataType:"Json",
		success:function(data){
			
		}
	});
	
	$(".songs").html('')
	ajaxLoadSongs(pList,1)
}
function loadHotSongs(num){
	var pList=new Array();//清空原播放列表数组
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
	var time="";//form.time.value+
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