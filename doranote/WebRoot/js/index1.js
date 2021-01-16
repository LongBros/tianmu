var curPage=1;//当前页码
var perPage=10;//当前一页展示日记数量
var user=getCookie("userId")+"";

/*1.个人信息*/
function myselfinfo(){
	layer.open({
		type: 1,
		area: ['300px','200px'],
		fix: false, //不固定
		maxmin: true,
		shade:0.4,
		title: '查看信息',
		content: '<div>管理员信息</div>'
	});
}

/*
 * 2.根据页码加载日记--用于首页和作者页
 * @param from:作者页、首页
 * @param author作者	
 * @param page页码
 * @param perPage
 * @param userId
*/
function loadDiary(from,author,page,perPage,userId){
	var au="0,2";//完全公开的
	if(user!=null&&user!=''){//登录用户可看到完全公开和登录可见的
		au="0,2";
	}
	if(from=="author"){//作者页要定作者的性别，以此来设置tab及其他 01-28
		$(".sexCall").text(call);//设置tab
	}
	$("#diarys").text("");
	$.ajax({
		url:"note/diary/getDiaryBy.do",
		type:"get",
		async:false,
		dataType:"Json",
		data:{
			author:author,
			page:page,
			authority:au,
			perPage:perPage,
			user:userId
		},
		success:function(data){
			var isFirst="";
			var vs=new Array("chongqingwenlvcheng1.mp4",
					"mv_756_nibushizhenzhengdekuaile.mp4","mv_132_xiaoxingyun.mp4","mv_1037_yunyanchengyu.mp4");
			var which=random(0, vs.length-1);
			console.log("第"+which+"个视频")
			var v=vs[which];
			//if(i==0&&page==1){//第一个后面加视频
				isFirst="<video width='835px' height='300px' controls='controls' autoplay src='http://img.duola.vip/v/"+v+"'></video>";
			//}
			$("#diarys").append(isFirst+"<hr width='100%'>");
			for(var i=0;i<data.length;i++){
				//处理内容和标题
				var title=data[i].ntitle+"";
				var con="";
				if(listStyle==0){
					con=handleCon(data[i].ncontent);
					//console.log(con);
					if(con.length>250){
						con=con.substring(0,250)+"......";
					}
				}else{//仅显示标题
					con=title;
				}
				
				if(title.length>10){
					title="《"+title.substring(0,8)+"...》";
				}else{
					title="《"+title+"》";
				}
				if(data[i].nTop>1){//站长置顶
					title=title+"<font color='red'>(置顶)</font>"
				}
				var userName=data[i].userName;
				if(user==data[i].nwritter){//当前登录人的日记特殊显示作者
					userName="<font color='red'>"+data[i].userName+"(朕)</font>";
				}
				//分类
				var cate=getCateById(data[i].ntype);
				//是否有音频
				var music=0;//默认无音频
				var fun='';
				var ai=data[i].audioInfo
				if(data[i].nSongId!=null&&data[i].nSongId!=''){
					music=1;//有音频
					if(ai){
						fun="playerAudio("+ai.substring(0, ai.indexOf("-"))+",2)";
					}else{
						fun="playerAudio("+data[i].nid+",1)";
					}
				}
				var com="";
				if(data[i].nallowComment==0){//允许评论的才显示评论图标
					com="&nbsp;<i class=\"Hui-iconfont\">&#xe622;</i><span id='commentNum'>"+data[i].commentNum+"</span>";
				}
				//未登录所有日记不显示不看他按钮,已登录自己的日记不显示不看他按钮
				var nsh="";
				if((data[i].nwritter+"")!=(user+"")&&user!=""){
					nsh="&nbsp;<i class=\"Hui-iconfont\" title='不看他' onclick='addToUnlike(\"1\",\""+data[i].nwritter+"\",\""+data[i].userName+"\")'>&#xe624;</i>";
					nsh=nsh+"&nbsp;<i class=\"Hui-iconfont\" title='不给ta看' onclick='addToUnlike(\"0\",\""+data[i].nwritter+"\",\""+data[i].userName+"\")'>&#xe691;</i>";
				}
				var top="";
				if(data[i].nUserTop==1){//用户置顶
					top=top+"<font color='#c88326'>(顶)</font>"
				}
				var loc=data[i].nlocation+"";
				if(loc.length>6){
					loc=loc.substring(0,6)+"..."
				}
				var wordSize="",ti="";
				if(show==1){
					wordSize="("+data[i].wordSize+"字)";
					if(ai){//含有音频
						ti=ti+"title='该篇日记共计"+data[i].wordSize+"字(包含格式所占字符),\r含有音频歌曲："+data[i].audioInfo+"'";
					}else{
						ti="title='该篇日记共计"+data[i].wordSize+"字(包含格式所占字符)'";
					}
				}else{
					if(data[i].audioInfo){//含有音频
						ti=ti+"title='该篇日记含有音频歌曲："+data[i].audioInfo+"'";
					}
				}
				
				var tx="";
				var au="";
				if(from=="index"){//首页列表中显示头像和作者
					tx="<img src='http://img.duola.vip/image/tx/"+data[i].headImage+".jpg' class='touxiang' onclick='openOther(1,\""+data[i].nwritter+"\")'>";
					var sex=data[i].authorSex;
					if(sex==0){//女性
//						au="<i class=\"Hui-iconfont\" style='color:red'>&#xe60d;</i><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
						au="<img src='http://img.duola.vip/image/female.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
					}else{
//						au="<i class=\"Hui-iconfont\">&#xe60d;</i><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
						au="<img src='http://img.duola.vip/image/male.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
					}
				}
				var ifPraise=data[i].ifPraise;
				if(ifPraise==0){
					color="gray";
				}else{
					color="red";
				}
				var classAll="diary";
				if(data[i].nTop>1){//站长置顶
					classAll="diary top";
				}
				
//				if(i==data.length-1&&page==1){//最后一个后面加视频
//					isFirst="<video width='835px' height='300px' controls='controls' src='http://img.duola.vip/v/82_2020-10-20.mp4'></video>";
//				}
				//onclick='openOther(0,"+data[i].nid+")'	href=\"diary.html?"+data[i].nid+"\"
				$("#diarys").append("<div class=\""+classAll+"\">"+tx+"<a  onclick='openOther(0,"+data[i].nid+","+data[i].nauthority+")' "+ti+">"+con+"</a><br>"
				+"<div class='info'>"+au+"<i class=\"Hui-iconfont\">&#xe690;</i>"+data[i].ntime
				+"&emsp;<i class=\"Hui-iconfont\">&#xe681;</i>"+cate+"&nbsp;:<span title='"+data[i].ntitle+"'>"+title+"</span>&nbsp;<span>"+(music=='1'?'<font color=\'red\' title=\'有音频喔，点此加入播放列表\'>'+wordSize+'<img onclick=\''+fun+'\'  style="width: 16px;height: 16px" src="http://img.duola.vip/image/playing1.gif"\'></font>':'<font color=\'red\'>'+wordSize+'</font>')+"</span>&emsp;<i class=\"Hui-iconfont\">&#xe6c9;</i><span title='"+data[i].nlocation+"'>"+loc
				+"</span><div class='zan'><i class=\"Hui-iconfont\">&#xe725;</i>"+data[i].visitNum+com
				
				+"&nbsp;<i class=\"Hui-iconfont\" style=\"color:"+color+"\"  onclick='praiseDiary("+data[i].nid+","+data[i].nwritter+","+i+")'  id=\"diary"+i+"\">&#xe66d;</i><span id=\"praiseNum"+i+"\" >"+data[i].praiseNum
				
				+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe630;</i><span>"+data[i].storeNum
				+"</span>"+nsh+top+"</div></div></div>"
				+"<hr width='100%'>");//740px
			}
		}
	});
	curPage=parseInt(page);
	perPage=parseInt(perPage);
	setPage(from,author,perPage,userId);
}

/**
 * 8.根据日记数量初始化页码按钮
 * @param from，首页/作者页
 * @param author，作者
 * @param perPage，每页数量
 * @param userId，登录用户
*/
function setPage(from,author,perPage,userId){
	$(".pages").text('');
	var num=0;
	var au="0,2";//完全公开的
	if(user!=null&&user!=''){//登录用户可看到完全公开和登录可见的
		au="0,2";
	}
	$.ajax({
		url:"note/diary/getDiaryNumBy.do",
		type:"get",
		async:false,
		data:{
			NWritter:author,
			NBookid:userId,//此处的NBookid作当前登录用户使用
			NLocation:au//12-12做权限使用
		},
		dataType:"text",
		success:function(data){
			num=data;
		}
	});
	var page=0;
	if(num%perPage==0){//可整除的话，页码数为总日记数除以10
		page=num/perPage;
	}else{//不可整除的话，页码数为总日记数除以10加1
		page=parseInt(num/perPage)+1;
	}
	if(perPageNum=="0"){
		var value=new Array("10","20","30","40");
		var sel="<select onchange='setPer("+from+","+userId+",options[selectedIndex].value)'>";
		for(var i=0;i<value.length;i++){
			if(value[i]==perPage){
				sel=sel+"<option value='"+value[i]+"' selected>每页"+value[i]+"篇</option>";
			}else{
				sel=sel+"<option value='"+value[i]+"'>每页"+value[i]+"篇</option>";
			}
		}
		sel=sel+"</select>";
		$(".pages").append(sel);
	}else{
		$(".pages").append("每页"+perPage+"篇");
	}
	if(num>10){
		$(".pages").append("&nbsp;共"+num+"篇日记&nbsp;"+curPage+"/"+page+"&emsp;");
	}else{//只有10篇无需显示选择每页多少篇
		$(".pages").append("&nbsp;共"+num+"篇日记&nbsp;");
	}
	if(curPage!=1){
		$(".pages").append("<span onclick=\"loadDiary('"+from+"','"+author+"','1','"+perPage+"','"+userId+"')\">首</span>&emsp;")
		$(".pages").append("<span onclick=\"loadDiary('"+from+"','"+author+"','"+(curPage-1)+"','"+perPage+"','"+userId+"')\">←</span>&emsp;");
	}
	if(page>5){//多于5页，只显示5页
		if(curPage>page-5){//当前页码大于总页码-5，输出后六页
			for(var i=page-4;i<=page;i++){
	              if(i==curPage){
	  				   $(".pages").append("<span onclick=\"loadDiary('"+from+"','"+author+"','"+i+"','"+perPage+"','"+userId+"')\" style=\"color:white;background:black;\">"+i+"</span>&emsp;")
		          }else{
					   $(".pages").append("<span onclick=\"loadDiary('"+from+"','"+author+"','"+i+"','"+perPage+"','"+userId+"')\">"+i+"</span>&emsp;")
	         	  }
	        }
		}else{//当前页码小于总页码-6，输出当前页码后的六页
            for(var i=curPage;i<curPage+5;i++){
                if(i==curPage){
	  				   $(".pages").append("<span onclick=\"loadDiary('"+from+"','"+author+"','"+i+"','"+perPage+"','"+userId+"')\" style=\"color:white;background:black;\">"+i+"</span>&emsp;")
                }else{
					   $(".pages").append("<span onclick=\"loadDiary('"+from+"','"+author+"','"+i+"','"+perPage+"','"+userId+"')\">"+i+"</span>&emsp;")
                }
            }
         }
		
	}else{//少于5页，显示所有页码
		if(page!=1){//只有一页无需显示页码
			for(var i=1;i<=page;i++){
				if(curPage==i){
					$(".pages").append("<span onclick=\"loadDiary('"+from+"','"+author+"','"+i+"','"+perPage+"','"+userId+"')\" style=\"color:white;background:black;\">"+i+"</span>&emsp;")
				}else{
					$(".pages").append("<span onclick=\"loadDiary('"+from+"','"+author+"','"+i+"','"+perPage+"','"+userId+"')\">"+i+"</span>&emsp;")
				}
			}
		}
	}
	if(curPage+1<=page){//＜＞
		$(".pages").append("<span onclick=\"loadDiary('"+from+"','"+author+"','"+(curPage+1)+"','"+perPage+"','"+userId+"')\">→</span>&emsp;")
		$(".pages").append("<span onclick=\"loadDiary('"+from+"','"+author+"','"+page+"','"+perPage+"','"+userId+"')\">尾</span>&emsp;")
	}
	/*if(page>5){//多于5页显示下拉选择页码功能
		var pagesC="";
		pagesC+="<select name='selPage' οnchange=\"loadDiary('"+author+"',options[selectedIndex].value,'"+perPage+"','"+userId+"')\">";
		for(var i=1;i<=page;i++){
			pagesC+="<option value="+i+">"+i+"</option>";
		}
		pagesC+="</select>";
		$(".pages").append(pagesC);
	}*/
}
/**
 * 9.2019-10-26	加载当前登录用户有多少未读喜欢、收藏、被关注等消息
 */
function initUnReadMessage(){
	$.ajax({
		url:"note/praise/getPraiseNum.do",
		type:"get",
		async:false,
		data:{
			PPraised:user,
			PReadStatus:0
		},
		dataType:"text",
		success:function(data){
			document.getElementById("unReadNum").innerText=data;
		}
	});
}
/**
 * 10.选择每页数量时自动设置页码
 * @param pernum
 */
function setPer(from,userId,pernum){
	perPage=pernum;
	setPage(from,author,perPage,userId);
	loadDiary(from,author,curPage,perPage,userId);
}
/**
 * 11.添加某人至不看列表
 * @param userId
 * @param userName
 */
function addToUnlike(which,userId,userName){
	var w="确定添加‘"+userName+"’至不看列表？(添加后在你的首页不会显示ta的文章)";
	if(which==0){
		w="确定添加‘"+userName+"’至不给看列表？(添加后在ta的首页不会显示你的文章)";
	}
	//user:当前登录用户,userId:待移除用户
	var r=window.confirm(w);
	if(r==false){
		return;
	}
	$.ajax({
		url:"note/userinfo/addToOrRemoveFromList.do?type=0&user="+user+"&userId="+userId+"&which="+which,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(res){
			if(res.code==200){
				alert(res.message);
			}
		}
	});
	if(which!=0){//添加至不看列表时刷新
		window.open(document.URL,"_self");
	}
}
//12.切换tab-推荐、关注、时间轴
function switchTab(which){
	if(which=="-1"){//初始化页面，即非用户点击
		which=showWhichTab;
		if(which==5){//随机tab
			which=Math.floor(Math.random() * 5)
		}
	}
	var tabs=new Array("recommend","notice","time","yesterday","listen");
	for(var i=0;i<5;i++){
		if(i==which){
			$("#"+tabs[i]).css("color","red");
			$("#"+tabs[i]).css("fontWeight","bolder");
			$("#"+tabs[i]).css("fontSize","17px");
		}else{
			$("#"+tabs[i]).css("color","white");
			$("#"+tabs[i]).css("fontWeight","normal");
			$("#"+tabs[i]).css("fontSize","14px");
		}
	}
//	document.getElementById("recommend").style.color="red";
//	document.getElementById("notice").style.color="white";
//	document.getElementById("time").style.color="white";
//	document.getElementById("yesterday").style.color="white";
//	document.getElementById("listen").style.color="white";
	if(which==0){//推荐
		openRecommend();
	}else if(which==1){//关注
		openNotice();
	}else if(which==2){//时间轴
		loadDiary('index','','1',perPage,user);//分页加载日记，12-05使用user去除黑名单
	}else if(which==3){//时间轴
		loadYesterDiary();
	}else if(which==4){//聆听
//		alert("提示：点击歌曲信息来播放歌曲");
		openAudio();
	}
	
}
//13.打开推荐
function openRecommend(){
	$("#diarys").text("");
	$(".pages").text('');
	$.ajax({
		url:"note/diary/randomRecommend.do",
		type:"get",
		async:false,
		dataType:"Json",
		data:{
			n:20
		},
		success:function(res){
			var data=res.result;
			$("#diarys").append("<center>哆啦小子使尽浑身解数，为你随机推荐了"+data.length+"篇日记^_^</center><hr width='100%'>");
			for(var i=0;i<data.length;i++){
				//处理内容和标题
				var title=data[i].ntitle+"";
				var con=handleCon(data[i].ncontent);

				if(con.length>250){
					con=con.substring(0,250)+"......";
				}
				
				if(title.length>10){
					title="《"+title.substring(0,8)+"...》";
				}else{
					title="《"+title+"》";
				}
				if(data[i].nTop==1){//站长置顶
					title=title+"<font color='red'>(置顶)</font>"
				}
				var userName=data[i].userName;
				if(user==data[i].nwritter){//当前登录人的日记特殊显示作者
					userName="<font color='red'>"+data[i].userName+"(朕)</font>";
				}
				//分类
				var cate=getCateById(data[i].ntype);
				//是否有音频
				var music=0;//默认无音频
				if(data[i].nSongId!=null&&data[i].nSongId!=''){
					music=1;//有音频
				}
				var com="";
				if(data[i].nallowComment==0){//允许评论的才显示评论图标
					com="&nbsp;<i class=\"Hui-iconfont\">&#xe622;</i><span id='commentNum'>"+data[i].commentNum+"</span>";
				}
				//未登录所有日记不显示不看他按钮,已登录自己的日记不显示不看他按钮
				var nsh="";
				if((data[i].nwritter+"")!=(user+"")&&user!=""){
					nsh="&nbsp;<i class=\"Hui-iconfont\" title='不看他' onclick='addToUnlike(\""+data[i].nwritter+"\",\""+data[i].userName+"\")'>&#xe68b;</i>";
				}
				var top="";
				if(data[i].nUserTop==1){//用户置顶
					top=top+"<font color='#c88326'>(顶)</font>"
				}
				var loc=data[i].nlocation+"";
				if(loc.length>6){
					loc=loc.substring(0,6)+"..."
				}
				var wordSize="",ti="";
				if(show==1){
					wordSize="("+data[i].wordSize+"字)";
					ti="title='该篇日记共计"+data[i].wordSize+"字(包含格式所占字符)'";
				}
				var tx="<img src='http://img.duola.vip/image/tx/"+data[i].headImage+".jpg' class='touxiang' onclick='openOther(1,\""+data[i].nwritter+"\")'>";
				var sex=data[i].authorSex;
				if(sex==0){//女性
					au="<img src='http://img.duola.vip/image/female.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
				}else{
					au="<img src='http://img.duola.vip/image/male.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
				}
				$("#diarys").append("<div class=\"diary\">"+tx+"<a href=\"diary/"+data[i].nid+"\"  "+ti+">"+con+"</a><br>"
				+"<div class='info'>"+au+"<i class=\"Hui-iconfont\">&#xe690;</i>"+data[i].ntime
				+"&emsp;<i class=\"Hui-iconfont\">&#xe681;</i>"+cate+"&nbsp;:<span title='"+data[i].ntitle+"'>"+title+"</span>&nbsp;<span>"+(music=='1'?'<font color=\'red\' title=\'有音频喔\'>'+wordSize+'音</font>':'<font color=\'red\'>'+wordSize+'</font>')+"</span>&emsp;<i class=\"Hui-iconfont\">&#xe6c9;</i><span title='"+data[i].nlocation+"'>"+loc
				+"</span><div class='zan'><i class=\"Hui-iconfont\">&#xe725;</i>"+data[i].visitNum+com+"&nbsp;<i class=\"Hui-iconfont\">&#xe66d;</i><span>"+data[i].praiseNum
				+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe630;</i><span>"+data[i].storeNum
				+"</span>"+nsh+top+"</div></div>"
				+"</div><hr width='100%'>");//740px
			}
		}
	});
}
//14.打开关注用户的日记
function openNotice(){
	$("#diarys").text("");
	$(".pages").text('');
	if(user==""){
		alert("请先登录");
		$("#diarys").append("<center>登录后方可查看关注用户的日记喔，快快登录吧^_^</center>");
		login_popup();
		return;
	}
	
	$.ajax({
		url:"note/diary/noticeUserDiary.do",
		type:"get",
		async:false,
		dataType:"Json",
		data:{
			user:user,
			n:10
		},
		success:function(res){
			var data=res.result;
			if(data.length==0){
				$("#diarys").append("<center>这个星球没有日记呢，可能原因：你还没有关注别人，或者你关注的人还没发布日记，去多关注点朋友吧^_^</center>");
			}else{
				$("#diarys").append("<center>哆啦小子使尽浑身解数，为你加载了"+data.length+"篇你关注的人的日记^_^</center><hr width='100%'>");
			}
			for(var i=0;i<data.length;i++){
				//处理内容和标题
				var title=data[i].ntitle+"";
				var con=handleCon(data[i].ncontent);

				if(con.length>250){
					con=con.substring(0,250)+"......";
				}
				
				if(title.length>10){
					title="《"+title.substring(0,8)+"...》";
				}else{
					title="《"+title+"》";
				}
				if(data[i].nTop>1){//站长置顶
					title=title+"<font color='red'>(置顶)</font>"
				}
				var userName=data[i].userName;
				if(user==data[i].nwritter){//当前登录人的日记特殊显示作者
					userName="<font color='red'>"+data[i].userName+"(朕)</font>";
				}
				//分类
				var cate=getCateById(data[i].ntype);
				//是否有音频
				var music=0;//默认无音频
				if(data[i].nSongId!=null&&data[i].nSongId!=''){
					music=1;//有音频
				}
				var com="";
				if(data[i].nallowComment==0){//允许评论的才显示评论图标
					com="&nbsp;<i class=\"Hui-iconfont\">&#xe622;</i><span id='commentNum'>"+data[i].commentNum+"</span>";
				}
				//未登录所有日记不显示不看他按钮,已登录自己的日记不显示不看他按钮
				var nsh="";
				if((data[i].nwritter+"")!=(user+"")&&user!=""){
					nsh="&nbsp;<i class=\"Hui-iconfont\" title='不看他' onclick='addToUnlike(\""+data[i].nwritter+"\",\""+data[i].userName+"\")'>&#xe68b;</i>";
				}
				var top="";
				if(data[i].nUserTop==1){//用户置顶
					top=top+"<font color='#c88326'>(顶)</font>"
				}
				var loc=data[i].nlocation+"";
				if(loc.length>6){
					loc=loc.substring(0,6)+"..."
				}
				var wordSize="",ti="";
				if(show==1){
					wordSize="("+data[i].wordSize+"字)";
					ti="title='该篇日记共计"+data[i].wordSize+"字(包含格式所占字符)'";
				}
				var tx="<img src='http://img.duola.vip/image/tx/"+data[i].headImage+".jpg' class='touxiang' onclick='openOther(1,\""+data[i].nwritter+"\")'>";
				var au="";
				var sex=data[i].authorSex;
				if(sex==0){//女性
					au="<img src='http://img.duola.vip/image/female.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
				}else{
					au="<img src='http://img.duola.vip/image/male.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
				}
				$("#diarys").append("<div class=\"diary\">"+tx+"<a href=\"diary/"+data[i].nid+"\"  "+ti+">"+con+"</a><br>"
				+"<div class='info'>"+au+"<i class=\"Hui-iconfont\">&#xe690;</i>"+data[i].ntime
				+"&emsp;<i class=\"Hui-iconfont\">&#xe681;</i>"+cate+"&nbsp;:<span title='"+data[i].ntitle+"'>"+title+"</span>&nbsp;<span>"+(music=='1'?'<font color=\'red\' title=\'有音频喔\'>'+wordSize+'音</font>':'<font color=\'red\'>'+wordSize+'</font>')+"</span>&emsp;<i class=\"Hui-iconfont\">&#xe6c9;</i><span title='"+data[i].nlocation+"'>"+loc
				+"</span><div class='zan'><i class=\"Hui-iconfont\">&#xe725;</i>"+data[i].visitNum+com+"&nbsp;<i class=\"Hui-iconfont\">&#xe66d;</i><span>"+data[i].praiseNum
				+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe630;</i><span>"+data[i].storeNum
				+"</span>"+nsh+top+"</div></div>"
				+"</div><hr width='100%'>");//740px
			}
		}
	});
}
//15.昨日日记回顾
function loadYesterDiary(){
	$("#diarys").text("");
	$(".pages").text('');
	var au="0";//完全公开的
	if(user!=null&&user!=''){//登录用户可看到完全公开和登录可见的
		au="0,2";
	}
	$.ajax({
		url:"note/diary/getDiaryBy.do",
		type:"get",
		async:false,
		dataType:"Json",
		data:{
			authority:au,
			user:user,
			time:1
		},
		success:function(data){
			if(data.length==0){
				$("#diarys").append("<center>这个星球没有日记呢</center>");
			}else{
				$("#diarys").append("<center>哆啦小子同你一起回顾昨日的"+data.length+"篇日记^_^</center><hr width='100%'>");
			}
			for(var i=0;i<data.length;i++){
				//处理内容和标题
				var title=data[i].ntitle+"";
				var con="";
				if(listStyle==0){
					con=handleCon(data[i].ncontent);
//					console.log(con);
					if(con.length>250){
						con=con.substring(0,250)+"......";
					}
				}else{//仅显示标题
					con=title;
				}
				
				if(title.length>10){
					title="《"+title.substring(0,8)+"...》";
				}else{
					title="《"+title+"》";
				}
				if(data[i].nTop>1){//站长置顶
					title=title+"<font color='red'>(置顶)</font>"
				}
				var userName=data[i].userName;
				if(user==data[i].nwritter){//当前登录人的日记特殊显示作者
					userName="<font color='red'>"+data[i].userName+"(朕)</font>";
				}
				//分类
				var cate=getCateById(data[i].ntype);
				//是否有音频
				var music=0;//默认无音频
				if(data[i].nSongId!=null&&data[i].nSongId!=''){
					music=1;//有音频
				}
				var com="";
				if(data[i].nallowComment==0){//允许评论的才显示评论图标
					com="&nbsp;<i class=\"Hui-iconfont\">&#xe622;</i><span id='commentNum'>"+data[i].commentNum+"</span>";
				}
				//未登录所有日记不显示不看他按钮,已登录自己的日记不显示不看他按钮
				var nsh="";
				if((data[i].nwritter+"")!=(user+"")&&user!=""){
					nsh="&nbsp;<i class=\"Hui-iconfont\" title='不看他' onclick='addToUnlike(\"1\",\""+data[i].nwritter+"\",\""+data[i].userName+"\")'>&#xe624;</i>";
					nsh=nsh+"&nbsp;<i class=\"Hui-iconfont\" title='不给ta看' onclick='addToUnlike(\"0\",\""+data[i].nwritter+"\",\""+data[i].userName+"\")'>&#xe691;</i>";
				}
				var top="";
				if(data[i].nUserTop==1){//用户置顶
					top=top+"<font color='#c88326'>(顶)</font>"
				}
				var loc=data[i].nlocation+"";
				if(loc.length>6){
					loc=loc.substring(0,6)+"..."
				}
				var wordSize="",ti="";
				if(show==1){
					wordSize="("+data[i].wordSize+"字)";
					ti="title='该篇日记共计"+data[i].wordSize+"字(包含格式所占字符)'";
				}
				var tx="";
				var author="";
				tx="<img src='http://img.duola.vip/image/tx/"+data[i].headImage+".jpg' class='touxiang' onclick='openOther(1,\""+data[i].nwritter+"\")'>";
				var sex=data[i].authorSex;
				if(sex==0){//女性
					author="<img src='http://img.duola.vip/image/female.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
				}else{
					author="<img src='http://img.duola.vip/image/male.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
				}
				
				$("#diarys").append("<div class=\"diary\">"+tx+"<a href=\"diary/"+data[i].nid+"\"  "+ti+">"+con+"</a><br>"
				+"<div class='info'>"+author+"<i class=\"Hui-iconfont\">&#xe690;</i>"+data[i].ntime
				+"&emsp;<i class=\"Hui-iconfont\">&#xe681;</i>"+cate+"&nbsp;:<span title='"+data[i].ntitle+"'>"+title+"</span>&nbsp;<span>"+(music=='1'?'<font color=\'red\' title=\'有音频喔\'>'+wordSize+'音</font>':'<font color=\'red\'>'+wordSize+'</font>')+"</span>&emsp;<i class=\"Hui-iconfont\">&#xe6c9;</i><span title='"+data[i].nlocation+"'>"+loc
				+"</span><div class='zan'><i class=\"Hui-iconfont\">&#xe725;</i>"+data[i].visitNum+com+"&nbsp;<i class=\"Hui-iconfont\">&#xe66d;</i><span>"+data[i].praiseNum
				+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe630;</i><span>"+data[i].storeNum
				+"</span>"+nsh+top+"</div></div>"
				+"</div><hr width='100%'>");//740px
			}
		}
	});
}
$(function(){
	 $("select[name='qualifications']").change(function(){
//		 loadDiary('"+author+"',options[selectedIndex].value,'"+perPage+"');
		 alert("aaa")
	})
})
//16.点赞、取消点赞日记
function praiseDiary(diaryId,author,index){
	if(!user){
		alert("点赞失败，请先登录");
		login_popup();
		return;
	}
	var url='';
	var back=document.getElementById("diary"+index).style.color+"";
	if(back=="gray"){
		url='note/praise/praiseDiary.do?PPraiser='+user+'&PDiary='+diaryId+'&type=0&PPraised='+author+'&PPraiseTime='+formatW2(new Date()+"");
		document.getElementById("diary"+index).style.color="red";
		document.getElementById("praiseNum"+index).innerText=parseInt($("#praiseNum"+index).text())+1;
	}else{
		url='note/praise/removePraiseDiary.do?PPraiser='+user+'&PDiary='+diaryId+'&type=0&PPraised='+author;
		document.getElementById("diary"+index).style.color="gray";
		document.getElementById("praiseNum"+index).innerText=parseInt($("#praiseNum"+index).text())-1;
	}
	$.ajax({
		url:url,
		type:"get",
		async:true
	});
}
//17	09-05加载音频日记
var allSong=[];//要批量加入列表的歌曲
var allAudio=[];//要批量加入列表的音频
function openAudio(){
	allSong=[];
	allAudio=[];
	$("#diarys").text("");
	$(".pages").text('');
	$.ajax({
		url:"note/diary/getAudioDiary.do",
		type:"get",
		async:false,
		dataType:"Json",
		data:{
			page:2,//服务端采取随机页码形式，此处传的参数无效
			perPage:24,
			onlySong:0//0加载所有音频，1只加载歌曲,2加载非歌曲音频
		},
		success:function(data){
			var res=data.result;
			var imgs=['http://p3.music.126.net/rut8JwaDf8FxLpB7AhcqRg==/109951165293238241.jpg',
			            'http://p3.music.126.net/mX6DKxPxdt2nInfNCIz9Fw==/109951165015483353.jpg',
					'http://p4.music.126.net/ZXByCLzRjyIQTyTCGXS3zg==/109951165277008551.jpg',
					'http://p3.music.126.net/yeBk2nQztSrrLCb0Z7OS2w==/109951165274611771.jpg',
					'http://p3.music.126.net/5Dc4JMRNzyteRVsEGGZYiA==/109951165071456067.jpg'];
			for(var i=0;i<res.length;i++){
				var audioInfos=res[i].audioInfo+"";//全部信息
				var songDoraId='';//10-04 歌曲的哆啦id
				var audioInfo='';//信息长会被截取
				//songId
				var songId=res[i].nSongId+'';
				if(songId.indexOf('\r')||songId.indexOf('n')||songId.indexOf('\r\n')){
					songId=songId.replace('\r', '').replace('\n','').replace('\r\n','');
				}
				if(!audioInfos||audioInfos==''||audioInfos=='null'){//非歌曲的音频，以日记名作为音频信息
					audioInfos="音频："+res[i].ntitle;
					songDoraId="\""+res[i].nid+"\",1";
					allAudio.push(res[i].nid);
				}else{
					songDoraId=audioInfos.substring(0, audioInfos.indexOf("-"))
					allSong.push(songDoraId);
					songDoraId="\""+songDoraId+"\",2";
					audioInfos="歌曲："+audioInfos.substring(audioInfos.indexOf("-")+1);
				}
				if(audioInfos.length>14){
					audioInfo=audioInfos.substring(0,14)+'..'
				}else{
					audioInfo=audioInfos;
				}
				var img="";
				if(res[i].nwritter=='88888888'){
					var j=Math.floor(Math.random() * 10);
					if(j<5){
						img=imgs[j];
					}else{
						img="http://img.duola.vip/image/tx/"+res[i].headImage+".jpg";
					}
				}else{
					img="http://img.duola.vip/image/tx/"+res[i].headImage+".jpg";
				}
				
				$("#diarys").append("<div class='notebook' title='点击播放"+audioInfos+"'>" +
						"<img onclick='playerAudio("+songDoraId+")' title='"+res[i].userName+"于"+res[i].ntime+"分享' src='"+img+"'>"
						+"<div class='bookinfo'>"
						+"<span onclick='playerAudio("+songDoraId+")'>"+audioInfo+"</span><img style='width: 12px;height: 12px' src='http://img.duola.vip/image/playing1.gif'/>"
						+"<br><span><a title='进去看看这篇文章' href='diary/"+res[i].nid
						+"'>读原文</a>&emsp;<a  title='进去看看作者' href='http://www.duola.vip/author.html?"+res[i].nwritter
						+"' target='_blank'>作者："+res[i].userName+"</a></span></div></div>"
						);
			}
			
		}
	});
}
//10-31 播放多个音频
function playAllAudio(){
	if(allSong.length==0&&allAudio.length==0){//不在聆听tab时先切到聆听tab
//		alert("请先切换到聆听tab再使用一键播放所有音频功能");
//		return;
		switchTab(4);
	}
	console.log("begin->开始将音频批量加入至播放列表")
	var successSongNum=0;
	var successAudioNum=0;
	for(var i=0;i<allSong.length;i++){
		var ifSuc= playerAudio(allSong[i],2);
		if(ifSuc==1){
			successSongNum++;
		}else if(ifSuc==2){//超出播放列表持音频数量限制，break后会只弹一次弹窗
			break;
		}
	}
	for(var i=0;i<allAudio.length;i++){
		var ifSuc= playerAudio(allAudio[i],1);
		if(ifSuc==1){
			successAudioNum++;
		}else if(ifSuc==2){//超出播放列表持音频数量限制
			break;
		}
	}
	console.log("end->音频批量添加成功，歌曲："+successSongNum+"，音频："+successAudioNum)
}
//var isShow=0; onclick="showorhideqr()"
function showorhideqr(isShow) {
	if(isShow==0){
		$(".dora_qr").show();
		isShow=1;
	}else{
		$(".dora_qr").hide();
		isShow=0;
	}
}
function openPlayer(){
	var showPlayer=getCookie("showPlayer")+"";//播放页面是否已显示
	console.log("播放器显示状态(0未显示，1已显示):"+showPlayer)
	if(showPlayer=="1"){
		
	}else{
		setCookie("showPlayer","1");
		window.open("player.html", "_blank")
	}
}
//2020-12-13
function changeTip(){
	var se=new Array();
	se[0]="哆啦网播放器中点击歌手可直达搜索其歌曲";
	se[1]="大家好，我是小喇叭，欢迎您访问本站。";
	se[2]="哆啦网全站音频都会流入哆啦网播放器";
	se[3]="登录后可添加更多音频至哆啦网播放器中";
	se[4]="我的家园页设置生日，哆啦网当天送去祝福";
	se[5]="你可以点赞、收藏、评论你喜欢的文章";
	se[6]="你可以关注你欣赏的作者，向他倾诉";
	se[7]="在我的家园页可以选择你喜欢的背景";
	se[8]="“音频设置”支持你更改自己的家歌";
	se[9]="你可以在我的家园页私密你的信息";
	se[10]="来哆啦网播放器，听最新、最热的歌曲";
	se[11]="哆啦网，用文本、音频记录美好生活";
	se[12]="哆啦网QQ交流群：415086137，期待你的添加";
	se[13]="首页右下角第一个悬浮按钮可唤起播放器";
	se[14]="首页右下角第二个悬浮按钮可关注公众号";
	se[15]="哆啦网期待你的注册与使用";
	//随机生成0~sen.length-1内的整数
	var i=Math.round(Math.random()*(se.length-1-0)+0);//使用Math.round来取整
	//alert(se.length-1);
	document.getElementById("word").innerHTML=se[i];
	//如何实现逐个循环显示，而不是随机显示？
	//var i=0;
	//document.getElementById("word").innerHTML=se[i];
	//i++;
}
/**
**
*
*	2.根据页码加载日记--用于首页和作者页
*	 7.打开其他的界面：作者、某日记	8.根据日记数量初始化页码按钮		9. 加载当前登录用户有多少未读喜欢、收藏、被关注等消息	
*	10.选择每页数量时自动设置页码		11.添加某人至不看列表	12.切换tab-推荐、关注、时间轴
*	13.打开推荐	14.打开关注用户的日记	15.昨日日记回顾	16.点赞、取消点赞日记	17 加载音频日记
**/