/**
*一些公用的函数方法
*
**/
/**
 * 1.日记列表处理日记内容
 */
function handleCon(content){
	var reg=/<[^<>]+>/g ;
	//var reg1=/<(?!img).*?>/g;//保留img标签
	//var reg2=/<\/?((?!img).)*?\/?>/g;
	//var reg3=/<(?!img|p|/p).*?>/g;//保留img、p标签
	var con=content+"";
	con=con.replace(reg, "");
	con=con.replace(new RegExp(":","gm"), "");
	con=con.replace(new RegExp("<","gm"), "");
	con=con.replace(new RegExp("&","gm"), "");
	return con;
}
/**
 * 2.根据心情id得到心情
 *
 */
function getMoodById1(id){
	switch(id){
		case 0:
			return "开心";
			break;
		case 1:
			return "微笑";
			break;
		case 2:
			return "哭脸";
			break;
		case 3:
			return "愤怒";
			break;
	}
}
/**
 * 2.根据心情id得到心情
 *
 */
function getMoodById(id){
	var mood="0";
	if(id=="0"){
		mood="开心";
	}else if(id=="1"){
		mood="微笑";
	}else if(id=="2"){
		mood="哭脸";
	}else if(id=="3"){
		mood="愤怒";
	}
	return mood;
}
//3.根据分类id得到分类
function getCateById(id){
	var cate="0";
	if(id=="0"){
		cate="生活日记";
	}else if(id=="1"){
		cate="工作笔记";
	}else if(id=="2"){
		cate="idea";
	}else if(id=="3"){
		cate="诗词(文学)";
	}else if(id=="4"){
		cate="深度好文";
	}
	return cate;
}
//4.根据气候id得到气候
function getWeaById(id){
	var wea="0";
	if(id=="0"){
		wea="晴";
	}else if(id=="1"){
		wea="雾";
	}else if(id=="2"){
		wea="霾";
	}else if(id=="3"){
		wea="阴";
	}else if(id=="4"){
		wea="雨";
	}else if(id=="5"){
		wea="雪";
	}
	return wea;
}
//5.得到日记的权限
function getAuthById(id){
	var au="0";
	if(id=="0"){
		au="完全公开";
	}else if(id=="1"){
		au="自己可见";
	}else if(id=="2"){
		au="登录可见";
	}else if(id=="3"){
		au="删除";
	}
	return au;
}
//6.关闭小贴士
function closeTip(){
	document.getElementById("warmtip").style.display="none";
	window.clearInterval(closeThread);
	window.clearInterval(countDownThread);
}
//7.不再显示小贴士
function neverTip() {
	closeTip();
	setCookie("ifTip","0");
}
//8.自动关闭小贴士倒计时
function autoCloseTip(){
	var rest=document.getElementById("restTime").innerHTML;
	rest--;
	console.log(rest)
	$("#restTime").text(rest);
}
//9..关闭底部栏
function closeBottom(){
	document.getElementById("bottomInfo").style.display="none";
}


/**
 * .打开其他的界面：作者、某日记
 * 
 */
function openOther(type,value,au){
	if(type==0){
		if(user||au=="0"){
//			window.open("diary.html?"+value, "_blank")
			window.open("diary/"+value, "_blank")
		}else{
			alert("这是一篇登录可见的日记喔，亲需要登录方可查看")
			login_popup();
		}
	}else if(type==1){
		if(user){
			window.open("author.html?"+value, "_blank");
		}else{
			alert("亲，登录方可查看作者页的信息")
			login_popup();	
		}
	}
}
//5.设置添加cookie
function setCookie(name,value)  
{  
    var Days = 30;  
    var exp = new Date();  
    exp.setTime(exp.getTime() + Days*24*60*60*1000);  
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();  
//    var strsec = getsec(time);  
//    var exp = new Date();  
//    exp.setTime(exp.getTime() + strsec*1);  
//    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();  
}
//6.得到name的value
function getCookie(name){
	if(document.cookie!=null){
		var co=document.cookie.split(";");
		for(var i=0;i<co.length;i++){
			//window.alert(co[i]);
			var arr=co[i].split("=");
			if(arr[0].indexOf(name) != -1){
				//window.alert(arr[1]);
				return arr[1];
			}
		}
	}
	return "";
}
/**
 * 播放器中播放歌曲
 * @param sid	歌曲的哆啦id
 * type	1:音频，2：歌曲
 */
function playerAudio(sid,type){
	var userId=getCookie("userId")+"";
	var maxLength=5;
	if(userId){
		maxLength=40;
	}
	
	if(!sid)//部分用户可能家歌异常
		return;
	sid=sid+"";
	var showPlayer=getCookie("showPlayer")+"";//播放页面是否已显示
	console.log("播放器显示状态(0未显示，1已显示):"+showPlayer)
	if(showPlayer=="1"){
	}else{
		setCookie("showPlayer","1");
		window.open("player.html", "_blank")
	}
	if(type=="1"){//音频
		var audioList=getCookie("audioList")+"";
		audioList=audioList.replace(new RegExp("%3A","gm"),":").replace(new RegExp("%3F","gm"),"?")
		.replace(new RegExp("%3D","gm"),"=").replace(new RegExp("%2C","gm"),",");
		var audio=audioList.split(",")
		if(audio.length>maxLength){
			console.log("播放列表中目前最多只能有"+maxLength+"个音频")
			if(maxLength==5){
				alert("登录后可添加更多音频至列表，目前最多只能有6个音频")
				login_popup()
			}else{
				alert("添加失败，超出播放列表持音频数量限制")
			}
			return;
		}
		if(audio.indexOf(sid)==-1)
			audio.push(sid)
		else
			console.log("播放列表中已有此音频")
		if(""==audio[0])
			audio.splice(0,1)
		console.log(audio)
		$.cookie('audioList', audio, { expires: 30, path: '/' });
	}else{//歌曲	
		var songLists=getCookie("songList")+"";
		songLists=songLists.replace(new RegExp("%3A","gm"),":").replace(new RegExp("%3F","gm"),"?")
		.replace(new RegExp("%3D","gm"),"=").replace(new RegExp("%2C","gm"),",");
		var song=songLists.split(",")
		if(song.length>maxLength){
			console.log("播放列表中目前最多只能有"+maxLength+"首歌曲")
			if(maxLength==5){
				alert("登录后可添加更多歌曲至列表,目前最多只能有6首歌曲")
				login_popup()
			}else{
				alert("添加失败，超出播放列表持歌数量限制")
			}
			return;
		}
		if(song.indexOf(sid)==-1)
			song.push(sid)
		else
			console.log("播放列表中已有此歌曲")
		if(""==song[0])
			song.splice(0,1)
		console.log(song)
		$.cookie('songList', song, { expires: 30, path: '/' });//保存到cookie并设置有效时间为30天:
	}
	
}
function addZero(word){
	word=parseInt(word);
	if(word<10)
		return "0"+word;
	else
		return word;
}

//17.打开音乐搜索框
function openMusic(){
	$("#searchSong").css("display","inline-block");
}
//18.关闭音乐搜索框
function closeSearch(){
	$("#searchSong").css("display","none");
}
//19.搜索框变动时搜索歌曲
function searchMusic(from){
//	var key=document.getElementById("key").value+"";
	var key=$("#key").val();
	if(key==""){
		return;
	}
	$.ajax({
		type:"Get",
		async:false,
		url:"http://m.duola.vip/querySongs.do?key="+key,
		dataType:"json",
		success:function(data){
			var len=data.length;
			if(len==0){
				return;
			}
			if(len>10){
				len=10;
			}
			document.getElementById("songsList").innerHTML="<center>共搜索到<font color='red'>"+(data.length)+"</font>首歌曲(点击歌名试听)";

			for(var k=0;k<len;k++){
				//特殊显示搜索关键字
				var name=data[k].songName+"";
				var na=data[k].songName+"";
				if(na.length>9){
					na=na.substring(0, 9)+"...";
				}
				na=na.replace(key, "<font color='red'>"+key+"</font>")
				var url="";//源网址
				var sid=data[k].sourceId+"";//网址标识部分
				if(sid.substring(sid.length-5)==".html"){
					url="http://link.hhtjim.com/qq/"+sid.substring(0, sid.length-5)+".mp3";
				}else if(sid.substring(sid.length-3)==".kw"){
					url="http://link.hhtjim.com/kw/"+sid.substring(0, sid.length-3)+".mp3";
				}else if(sid.substring(sid.length-4)==".mp3"){
					url=sid;
				}else{
					url="http://music.163.com/song/media/outer/url?id="+sid+".mp3";
				}
				if(from==2){//播放器中无需显示“选择”
					$('#songsList').append("<br>&emsp;"+(k+1)+".<a onclick='playerAudio("+data[k].id+",2)'>"+na+"</a>");
				}else{
					$('#songsList').append("<br>&emsp;"+(k+1)+".<a onclick='playerAudio("+data[k].id+",2)'>"+na+"</a>&emsp;&emsp;<a onclick='chooseSong(\""+sid+"\",\""+name+"\")'>选择</a>");
				}
			}
			$('#songsList').append("<br><br>列表最多展示10首歌曲，");
			$('#songsList').append("若搜不到你想选择的歌曲，可联系站长添加");
		}
	});
}
function random(min, max){
	// 若max不存在 min 赋值给max,并重新赋值min
	if(max == null){
		max = min;  
		min = 0;
	}
	return min+ Math.floor(Math.random()*(max-min+1))
}
/**
*一些公用的函数方法
*
**/