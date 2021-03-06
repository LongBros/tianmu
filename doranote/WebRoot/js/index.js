var user=getCookie("userId")+"";
var userNick=decodeURI(decodeURI(getCookie("userNick")+""));
var homeSongId="";
var show=1;//显示日记字数
var perPageNum=0;//显示日记篇数
var sexInt=0;
var call="他";
var listStyle=1;//01-29
var loopPlay=0;//01-30
var showWhichTab=4;//09-20	默认加载聆听
var secretWall=0;
var secretInteract=0;
var secretAccount=0;
/**
 * 1.根据是否登录设置菜单栏
 */
function getUser(){
//	if(user==""){//cookie中没有userId，则请求后台生成。并返回
//		var source="";
//		if (document.referrer === '') {// 当没有上一级url链接的时候，返回上一级按钮的链接改成项目首页url链接地址，这也是很符合项目逻辑的
//		    source="无";
//		}else{
//			source=document.referrer;
//		}
//		$.ajax({
//			url:"../../note/userinfo/genNoteUserId.do?source="+source,
//			async:true,
//			type:"GET",
//			dataType:"text",
//			success:function(data){
//				//将生成的userId赋给user，并存至cookie
//				user=data;
//				setCookie("user", user);
//			}
//		});
//	}
	if(userNick!=""){//已登录用户，隐藏登录按钮
		document.getElementById("login").style.display="none";
		document.getElementById("exit").style.display="block";
		document.getElementById("myHome").style.display="block";
		document.getElementById("write").style.display="block";
		document.getElementById("image").innerHTML=""+userNick+"";
		document.getElementById("loginMobile").innerHTML=""+userNick+"";
	}else{
		document.getElementById("exit").style.display="none";
		document.getElementById("login").style.display="block";
		document.getElementById("myHome").style.display="none";
		document.getElementById("write").style.display="none";
		document.getElementById("image").innerHTML="请登录";
	}
}

/**
 * 3.登录校验
 */
function login(){
	var acc=document.login_form.account_l.value;//账号，即哆啦id
	var pass=document.login_form.password_l.value;
	var url="note/userinfo/loginNote.do?acc="+acc+"&pass="+pass;
	$.ajax({
		url:url,
		async:true,
		type:"POST",
		dataType:"Json",
		success:function(data){
			if(data.code=="200"){//存cookie过程放至后端代码
				$("#loginModal").modal("hide")
				window.location="";
			}else{
				alert('未匹配到你输入的账号')
			}

		}
	});

}
//4.打开新页面
function openNewPage(which){
	if(which=="1"){
		window.open("index.html", "_blank")
	}else if(which=="2"){
		window.open("myHome.html", "_blank")
	}else if(which=="3"){
		window.open("new.html", "_blank")
	}else if(which=="4"){
		window.open("http://m.duola.vip/amaze/songsList.jsp", "_blank")
	}else if(which=="5"){
		alert("login")
	}else if(which=="6"){
//		document.cookie="userAddr=;";
//		document.cookie="userNick=;";
//		document.cookie="userId=;";
		$.cookie('userAddr', '', { expires: 30, path: '/' });
		$.cookie('userNick', '', { expires: 30, path: '/' });
		$.cookie('userId', '', { expires: 30, path: '/' });
		alert("已退出");
		window.location="";
		document.getElementById("login").style.display="block";
		document.getElementById("exit").style.display="none";
		document.getElementById("myHome").style.display="none";
		document.getElementById("write").style.display="none";
		document.getElementById("image").innerHTML="请登录";
	}
}

//7.加载公告、收到的赞、关注……的数量并显示
function loadNotice(){
	var url="note/userinfo/queryUnReadNum.do";
	$.ajax({
		url:url,
		type:"post",
		async:true,
		dataType:"json",
		data:{
			userId:user
		},
		success:function(data){
			if(data.result.length!=1){
				return;
			}
			var msgNum=data.result[0];
			var comNum=msgNum.comNum;
			var praiseNum=msgNum.praiseNum;
			var noticedNum=msgNum.noticedNum;
			var unReadNum=comNum+praiseNum+noticedNum;
			if(unReadNum>0){
				document.getElementById("cleanBtn").style.display="inline-block";
			}
			$("#unReadNum").text(unReadNum==0?'':unReadNum);
			$("#comNum").text(comNum==0?'':comNum);
			$("#praiseNum").text(praiseNum==0?'':praiseNum);
			$("#noticeNum").text(noticedNum==0?'':noticedNum);
		}
	});
}
//8.一键设置为已读
function setAsReaded(){
	var url="note/userinfo/setAsReaded.do";
	$.ajax({
		url:url,
		type:"post",
		async:true,
		data:{
			userId:user
		},
		dataType:"json",
		success:function(data){
			if(data.code==200){
				window.location="";
				alert("已设置所有未读消息为已读");
			}
		}
	});
 }
/**
 * 9.2019-10-26加载作者的信息:关注信息，互动计数，基本信息，活跃信息
 * page 	0:日记页，1：作者页，2：家园页
 */
function loadAuthorInfo(page){
	console.log("page="+page+",0:日记页，1：作者页，2：家园页")
	var url="note/userinfo/getAuthorInfoByUserId.do?UUserId="+author;
	$.ajax({
		url:url,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(res){
			var data=res.result;
			var url=document.URL+"";
			var sex=getSexById(data.uuserSex);

			var songName="";//家歌
			sexInt=data.uuserSex;
			if(sexInt==0){//sexInt在index.js中指定
				call="她";//在author.js中使用
			}
			var songInfo=data.homeSongName+""
			songName=songInfo.substring(songInfo.indexOf("-")+1)
			homeSongId=songInfo.substring(0, songInfo.indexOf("-"))

			if(user!=author){//不是当前人时候的title显示
				document.title=""+document.title+"'"+data.uuserName+"'的日记~哆啦网";

				if(url.indexOf("author.html")!=-1){//别的作者的页面
//					var sid=data.uhomeSong;//家歌
//					homeSongId=sid;
					
					ifAutoPlay(homeSongId);
				}
			}else{//当前人
				if(url.indexOf("diary")!=-1){
					document.title=document.title+"朕的日记~哆啦网";
				}else if(url.indexOf("author")!=-1){//我的作者页
					document.title="朕的日记~哆啦网";
					
					ifAutoPlay(homeSongId);
				}else if(url.indexOf("myHome")!=-1){//我的家园页
					document.title="我的家园~哆啦网";
					
					ifAutoPlay(homeSongId);
				}
			}
			document.getElementById("touxiang").src="http://img.duola.vip/image/tx/"+data.headImage+".jpg";
			document.getElementById("userId").innerText=author;
			/*document.getElementById("userNameT").innerText=data.uuserName;*/
			document.getElementById("userName").innerText=data.uuserName;
			document.getElementById("homeSong").innerText=songName;
			document.getElementById("signature").innerText=data.signature;
			document.getElementById("sex").innerText=sex;
			document.getElementById("joinTime").innerText="加入时间："+data.ujoinTime;
			document.getElementById("recentLogin").innerText="最近登录："+data.lastLogin;//(data.lastLogin=="")?"":
			
			if(page==1){
				secretWall=data.secretWall;
				secretInteract=data.secretInteract;
				secretAccount=data.secretAccount;
				if(secretAccount=="1"&&author!=user){//私密账号
//					var value = prompt('本站登录密码：', '');//这么执着的吗？尊重隐私喔
//					if(value=="145989"){
//						queryBill(1);
//					}else{
//						alert("password is error,Exit right now!");
						alert("该用户已设置为私密账号，暂时无法查看其信息，点击确定后退出!");
						window.open('','_self');
						window.close();
//					}
				}
				if(secretWall=="1"&&author!=user){
					document.getElementById("wall").style.display="none";
					console.log("我的墙不给你看")
				}
				if(secretInteract=="1"&&author!=user){
					document.getElementById("love").style.display="none";
					document.getElementById("store").style.display="none";
					document.getElementById("notice").style.display="none";
					document.getElementById("fans").style.display="none";
					console.log("我的互动信息不给你看")
				}
			}
			
			
			var num=parseInt(data.dayNum+"");
			var text="";
			var n=7;//级别幅度，如一个太阳=4个月亮，一个月亮=4个星星
			if(num==0){
				text="未写过日记呢";
			}else{
				if(num/n<1){//少于n天，显示星星
//					text=getHtml(num,"star");
					text="<img src='http://img.duola.vip/image/star.png' style='width:16px;height:16px'>"+num;
				}else{
					if(num/(n*n)<1){//小于n*n天，显示月亮和星星
//						text=getHtml(parseInt(num/n),"moon")+getHtml(num%n,"star");
						text="<img src='http://img.duola.vip/image/moon.png' style='width:16px;height:16px'>"+parseInt(num/n);
						if(num%n>0){
							text=text+"<img src='http://img.duola.vip/image/star.png' style='width:16px;height:16px'>"+num%n;
						}
					}else{
						if(num/(n*n*n)<1){//小于n*n*n天，显示太阳、月亮和星星、例17
//							text=getHtml(parseInt(num/(n*n)),"sun")+getHtml(parseInt((num%(n*n))/n),"moon")+getHtml((num%(n*n))%n,"star");
							text="<img src='http://img.duola.vip/image/sun.png' style='width:16px;height:16px'>"+parseInt(num/(n*n));
							if(parseInt((num%(n*n))/n)>0){
								text=text+"<img src='http://img.duola.vip/image/moon.png' style='width:16px;height:16px'>"+parseInt((num%(n*n))/n);
							}
							if((num%(n*n))%n>0){
								text=text+"<img src='http://img.duola.vip/image/star.png' style='width:16px;height:16px'>"+(num%(n*n))%n;
							}
						}else{
//							text=getHtml(parseInt(num/(n*n*n)),"crown")+getHtml(parseInt((num%(n*n*n))/(n*n)),"sun")+getHtml(parseInt(((num%(n*n*n))%(n*n))/n),"moon")+getHtml(((num%(n*n*n))%(n*n))%n,"star");
							text="<img src='http://img.duola.vip/image/crown.png' style='width:16px;height:16px'>"+parseInt(num/(n*n*n));
							if(parseInt((num%(n*n*n))/(n*n))>0){
								text=text+"<img src='http://img.duola.vip/image/sun.png' style='width:16px;height:16px'>"+parseInt((num%(n*n*n))/(n*n));
							}
							if(parseInt(((num%(n*n*n))%(n*n))/n)>0){
								text=text+"<img src='http://img.duola.vip/image/moon.png' style='width:16px;height:16px'>"+parseInt(((num%(n*n*n))%(n*n))/n);
							}
							if(((num%(n*n*n))%(n*n))%n>0){
								text=text+"<img src='http://img.duola.vip/image/star.png' style='width:16px;height:16px'>"+((num%(n*n*n))%(n*n))%n;
							}
						}
					}
				}
			}
			document.getElementById("diaryDayNum").innerHTML="累计天数："+text;
			document.getElementById("diaryDayNum").title="累积写日记"+num+"天\r图解：星星=1天，月亮="+n+"天，太阳="+n*n+"天，皇冠="+n*n*n+"天";
			var body=document.getElementById("bodys");
			body.style.background="url(http://img.duola.vip/image/back/"+data.back+")";
		}
	});
	setInteractNum(author);
}
//10.加载并设置某人的互动数量信息
function setInteractNum(user){
	var url="note/userinfo/queryInteractNum.do";
	$.ajax({
		url:url,
		type:"post",
		async:true,
		dataType:"json",
		data:{
			userId:user
		},
		success:function(data){
			if(data.result.length!=1){
				return;
			}
			var interactNum=data.result[0];
			var comNum=interactNum.comNum;
			var praiseNum=interactNum.praiseNum;
			var noticedNum=interactNum.noticedNum;
			$("#careNum").text(interactNum.noticeNum);
			$("#noticedNum").text(interactNum.noticedNum);
			$("#likeNum").text(interactNum.praiseNum);
			$("#storeNum").text(interactNum.storeNum);
			
			$("#visitNum").text(interactNum.visitNum);
			$("#visitedNum").text(interactNum.visitedNum);
			$("#comedNum").text(interactNum.comedNum);
			$("#praisedNum").text(interactNum.praisedNum);
		}
	});
}
//11.根据性别id获取性别
function getSexById(id){
	var sex="";
	if(id==0){
		sex="女";
	}else if(id==1){
		sex="男";
	}else{
		sex="不详";
	}
	return sex;
}

//12.判断当前登录用户是否已关注当前作者
function ifAttention(){
	var url="note/notice/whetherHasNotice.do";
	if(user==author){//当前登录用户查看自己时，不显示关注、已关注
		return;
	}
	var ifAtt=0;//0表示未关注
	$.ajax({
		url:url,
		type:"get",
		async:false,
		data:{
			NNoticer:user,
			NNoticed:author
		}, 
		dataType:"Json",
		success:function(data){

			if(data.code==200){
				ifAtt=1;
			}
		}
	});
	var attBtn=document.getElementById("attention");
	if(ifAtt==1){//已关注，则隐藏“关注”按钮
		attBtn.innerHTML="已关注<i class=\"Hui-iconfont\">&#xe676;</i>";
		attBtn.style.background="white";
		attBtn.style.color="gray";
	}else{
		attBtn.innerHTML="关注<i class=\"Hui-iconfont\">&#xe716;</i>";
	}
}
/**
 * 13.关注与取消关注
 */
function attenAuthor(){
	if(user==""){
		alert("关注失败，请先登录！");
		login_popup();
		return;
	}
	var attBtn=document.getElementById("attention");
	var fanNum=document.getElementById("noticedNum");//粉丝数
	var text=attBtn.innerHTML+"";
	var url="";//
	if(text.indexOf("已关注")!=-1){//已关注情况取消关注
		url="note/notice/cancelAtten.do";
		attBtn.innerHTML="关注<i class=\"Hui-iconfont\">&#xe716;</i>";
		attBtn.style.background="red";
		attBtn.style.color="white";
		fanNum.innerText=parseInt(fanNum.innerText)-1;
		alert("已取消关注！");
	}else{
		url="note/notice/noticeAuthor.do";
		attBtn.innerHTML="已关注<i class=\"Hui-iconfont\">&#xe676;</i>";
		attBtn.style.background="white";
		attBtn.style.color="gray";
		fanNum.innerText=parseInt(fanNum.innerText)+1;
		alert("已关注！");
	}
	$.ajax({
		url:url,
		type:"get",
		async:false,
		data:{
			NNoticer:user,
			NNoticed:author
		}, 
	});
}
//14.得到登录用户的一些设置
function getSetting(userId){
	var url="note/userinfo/getAuthorInfoByUserId.do?UUserId="+userId;
	$.ajax({
		url:url,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(res){
			var data=res.result;
			//设置背景、是否显示日记字数
			if(user==userId){//各个页均使用，在首页、我的家园页均生效，在作者页会用下方else覆盖掉背景设置显示对应作者的背景
				var body=document.getElementById("bodys");
				body.style.background="url(http://img.duola.vip/image/back/"+data.back+")";
				show=data.uShowWordnum;
				perPageNum=data.perpageNum;
				listStyle=data.listStyle;//01-29
				loopPlay=data.loopPlay;
				showWhichTab=data.showWhichTab;//09-20
//				alert(loopPlay)
				if(loopPlay==1){
					changeMode();
				}
			}else{//仅作者页使用，在上方if下面再执行以修改背景为作者的背景
				var body=document.getElementById("bodys");
				body.style.background="url(http://img.duola.vip/image/back/"+data.back+")";
			}
		}
	});
}

//16.播放与暂停自己或别人的家歌
function playHomeSong(){
	var btn=document.getElementById("playBtn");
	if(btn.innerText=="▷"){
		$("#playBtn").text("||");
		playerAudio(homeSongId);
//		btn.title="点击停止播放";
	}else{
		//隐藏logo并停止旋转
//		hideCircle();
//		stopRotateCircle();
//		var song=document.getElementById("audio");
//		song.src="";
//		$("#playBtn").text("▷");
//		btn.title="点击可播放喔";
	}
	
}
//17.根据登录用户对于音频的设置来处理是否播放音频
function ifAutoPlay(songId){
	var autoPlay=0;//1:自动播放，0、2:不播放
	if(user&&user!=''){
		$.ajax({
			url:"note/userinfo/getAuthorInfoByUserId.do?UUserId="+user,
			type:"get",
			async:false,
			dataType:"Json",
			success:function(res){
				var data=res.result;
				autoPlay=data.autoPlay;
			}
		});
	}
	
	if(autoPlay==1){//播放
		playerAudio(songId,2);
	}
}
//18.播放用户家歌并修改为播放按钮
function playAudio(sid){
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
	var song=document.getElementById("audio");
	song.src=url;
	//修改
	$("#playBtn").text("||");
	var btn=document.getElementById("playBtn");
	btn.title="点击暂停";
	//01-28显示logo并旋转
//	document.getElementById("album").style.display="block";
//	rotateCircle();
}
//19.手机端按钮登录
function loginPhone(){
	if(user!=""){
		window.open("myHome.html", "_blank")
	}else{
		login_popup();
	}
}
/**
 * 20.切换登录和注册
 * @param type
 */
function loginOrRegister(type){
	if(type=="0"){//显示登录框
		document.getElementById("loginBox").style.display="inline-block";
		document.getElementById("registerBox").style.display="none";
	}else if(type=="1"){//显示注册框
		alert("注册需要输入8位哆啦id，用户名，密码、邀请码(邀请者哆啦ID)。\r其中哆啦id和邀请码可为空，哆啦id为空后系统会随机为你分配，用户名和密码不能为空。\r哆啦id和密码是登录凭证");
		document.getElementById("loginBox").style.display="none";
		document.getElementById("registerBox").style.display="inline-block";
	}
}
/**
 * 21.注册账号
 */
function register(){
	var doraId=document.register_form.dora_r.value+"";//账号，即哆啦id
	var userName=document.register_form.userName_r.value+"";
	var pass=document.register_form.password_r.value+"";
	var inviter=document.register_form.inviter_r.value+"";
	if(userName.length<4||userName.length>15){
		alert("用户名字数应在4和15之间");
		return;
	}
	if(pass.length<3||pass.length>15){
		alert("密码字数应在3和15之间");
		return;
	}
	if(doraId.length>0&&(doraId.length!==8||isNaN(doraId))){
		alert("哆啦id需要为8位阿拉伯数字，你也可以不输入由系统为你分配");
		return;
	}
	if(inviter.length>0){//如果输入邀请码，判断所输入是否正确
		var re=0;//是否返回
		$.ajax({
			url:"note/userinfo/getAuthorInfoByUserId.do?UUserId="+inviter,
			type:"get",
			async:false,
			dataType:"Json",
			success:function(res){
				if(res.code==100){
					alert("你输入的邀请码有误，需为邀请者哆啦id，请重新输入或置空");
					re=1;
				}
			}
		});
		if(re==1){
			return;
		}
	}else{
		inviter="5211314";
	}
	var url="note/userinfo/register.do";
	$.ajax({
		url:url,
		async:false,
		type:"POST",
		data:{
			doraId:doraId,
			userName:userName,
			password:pass,
			inviter:inviter
		},
		dataType:"Json",
		success:function(data){
			if(data.code=="200"){
				alert(data.message);
				window.open("index.html","_self");
			}else{
				alert(data.message)
			}

		}
	});
}
/**
 * 22.根据数量和类型返回对应HTML
 * @param num	4个
 * @param type  星星
 * @returns {String}
 */
function getHtml(num,type){
	num=parseInt(num);
	var text="";
	for(var i=0;i<num;i++){
		text=text+"<img src='http://img.duola.vip/image/"+type+".png' style='width:16px;height:16px'>";
	}
	return text;
}
/***************************************************************
 * 1.根据是否登录设置菜单栏2.弹出登录框3.登录校验4.打开新页面5.设置添加cookie
 * 6.得到name的value7.加载公告、收到的赞、关注……的数量并显示8.一键设置为已读
 ****************************************************************/
/********以下方法12-30日写出在new.js中，12-31因myHome.js中也要使用而移入此文件********/
/**
*20.试听歌曲 
*/
function playSong(url){
	var p=document.getElementById("audio");
	p.setAttribute("src", url);
	p.play();//播放
}
/**
*21.选择歌曲
*/
function chooseSong(sid,name){
	$("#sourceId").val(sid);
	$("#songName").val(name);
	//clearBtn而不是cleanBtn，后者已被清空所有消息定义id
	$("#clearBtn").css("display","inline-block");
}
/**
*22.清空所选歌曲~jQuery与纯js
*/
//$(function(){
//	$("#clearBtn").click(function(){
//		$("#sourceId").val("");
//		$("#songName").val("");
//		$("#clearBtn").css("display","none");
//	});
//})
//纯js写法	需在HTML中加上onClick="clearSong();" 
/*function clearSong(){
	document.getElementById("sourceId").value="";
	document.getElementById("songName").value="";
	document.getElementById("clearBtn").style.display="none";
}*/
function clearSong(){
	$("#sourceId").val("");
	$("#songName").val("");
//	document.getElementById("sourceId").value="";
//	document.getElementById("songName").value="";
	$("#clearBtn").css("display","none");
}
/**
* 23.根据歌曲id得到歌曲名
* @param id
* @returns {String}
*/
function getSongNameBySId(sourceId){
	var name="";
	$.ajax({
		type:"Get",
		async:false,
		url:"http://m.duola.vip/querySongBySId.do?sourceId="+sourceId,
		dataType:"Json",
		success:function(data){
			name=data.songName+"-"+data.singer;
		}
	});
	return name;
}
/**
 * 24.画圆函数
 * 参数：圆心坐标，半径，精确度，背景颜色
 */
function drawCircle(centreX, centreY, radius, precision, color){
	var cx=Math.abs(parseInt(centreX));
	var cy=Math.abs(parseInt(centreY));
	var r = parseInt(radius<2 ? 60 : radius);
	var p = parseInt(precision<1 ? 1 : precision);
	var c = color;
	var y;
	for(var x=cx-r; x<=cx+r; x+=p){
		  y = cy - Math.sqrt(Math.pow(r, 2) - Math.pow(cx - x, 2));
		  document.write('<img style="background:'+c+'; border:1 solid '+c+'; width:'+p+'; height:'+parseInt(2*Math.sqrt(Math.pow(r, 2) - Math.pow(cx - x, 2)))+'; position:absolute; top:'+parseInt(y)+'; left:'+parseInt(x)+';">');
	}
}
/**
 * 25.显示画出的圆及logo
 */
function showCircle(){
	document.write("<div style='float:right;margin-top:22px;'>");
	drawCircle(450, 100, 100, 1, "grey");
	drawCircle(450, 100, 38, 1, "white");
	drawCircle(450, 100, 35, 1, "#cd3f11");
	document.write('<span id="logoword" style="font-size:8px;color:white;position:absolute; top:90px; left:423px;">DoraNote</span>');
	document.write("</div>");
}
function hideCircle(){
	document.getElementById("album").style.display="none";
}
/**
 * 26.定时器控制logo旋转
 */
var thread;
var deg;
function rotateCircle(){
	deg=5;
	thread=window.setInterval("rotateLogo()", "300");
}
//停止旋转
function stopRotateCircle(){
	window.clearInterval(thread);
}
/**
 * 27.旋转logo
 * @param deg 旋转角度
 */
function rotateLogo(){
	document.getElementById("logoword").style.transform="rotate("+deg+"deg)";//
	deg=deg+5;
}
/**
 * 28.2020-01-28左侧栏推荐所有用户
 */
function loadAllUser(){
	$("#alluser").text('');
	var page = Math.floor(Math.random() * 10);
	if(page<1)
		page = Math.floor(Math.random() * 10);
	if(page<1)
		page = Math.floor(Math.random() * 10);
	$.ajax({
		url:"note/notice/getMyAtten.do",
		type:"get",
		async:false,
		data:{
			userId:"5211314",
			author:"5211314",
			page:page,
			perPage:10//page为0，perPage为1时start为-1，进而不分页加载
		},
		dataType:"Json",
		success:function(res){
			if(res.code==200){
				var data=res.result;
				if(data.length<1){
//					$("#alluser").append("<center>你还没有关注别人呢，快去关注你喜欢的人吧！</center>");
				}else{
//					$("#alluser").append("<center>你共关注了<font color='red' size='2px'>"+data.length+"</font>个小伙伴</center>");
				}
				for(var i=data.length-1;i>=0;i--){
					$("#alluser").append("<div class='user'><img src='http://img.duola.vip/image/tx/"+data[i].headImg+".jpg'><a href='author.html?"+data[i].noticedId+"' target='_blank'>"+data[i].noticedName+"</a>&emsp;<font color='gray' size='1px'>"+data[i].fanNums+"粉丝</font>&emsp;<font  color='gray' size='1px'>"+data[i].joinDay+"天共"+data[i].diaryNum+"篇日记</font></div><hr>");
				}
			}else{
				alert("查询失败");
			}
		}
	});
}
/**
 * 
 */
function changeMode(){
	var p=document.getElementById("audio");
	p.setAttribute("loop", "loop");
//	alert("已切换为循环播放")
}
//.底部栏功能切换
function tabOnItem(which){
	if(which=="0"){//每日一句
		window.open("http://blog.duola.vip/msgboard.jsp", "_blank");
	}else if(which=="1"){//用户使用指南
		window.open("https://support.qq.com/products/136712/team/","_blank");
	}else if(which=="2"){//赞赏支持
		var si=document.getElementById("sponsorImage").style.display;
		if(si=="none"){
			document.getElementById("sponsorImage").style.display="inline-block";
			document.getElementById("sponsor").style.color="red";
		}else{
			document.getElementById("sponsorImage").style.display="none";
			document.getElementById("sponsor").style.color="black";
		}
	}else if(which=="3"){//联系作者
		window.open("https://support.qq.com/products/136712","_blank");
	}else if(which=="4"){//赞助记录
		window.open("http://blog.duola.vip/sponsor/showSponsor.jsp","_blank");
	}
}
//.支付宝、微信、QQ收款码切换
function switchImg(which) {
	if(which=="pay"){
		document.getElementById("paypal").style.display="inline-block";
		document.getElementById("wechat").style.display="none";
		document.getElementById("qq").style.display="none";
		document.getElementById("payBtn").style.color="red";
		document.getElementById("weBtn").style.color="black";
		document.getElementById("qqBtn").style.color="black";
	}else if(which=="we"){
		document.getElementById("wechat").style.display="inline-block";
		document.getElementById("paypal").style.display="none";
		document.getElementById("qq").style.display="none";
		document.getElementById("payBtn").style.color="black";
		document.getElementById("weBtn").style.color="red";
		document.getElementById("qqBtn").style.color="black";
	}else{
		document.getElementById("paypal").style.display="none";
		document.getElementById("wechat").style.display="none";
		document.getElementById("qq").style.display="inline-block";
		document.getElementById("payBtn").style.color="black";
		document.getElementById("weBtn").style.color="black";
		document.getElementById("qqBtn").style.color="red";
	}
}

