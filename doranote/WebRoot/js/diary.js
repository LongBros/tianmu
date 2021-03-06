/**
 * 切记一个页面中不能有两个同名id，因同名id会导致数据设置错误
 * 例(storeNum，和storeNum1；praiseNum和praiseNum1)
 * 
 */
var user=getCookie("userId")+"";//当前登录用户

/**
 * 1.个人信息
 */
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

/**
 * 2.根据日记id加载日记
 * @param id
 */
function loadDiary(id){
	$("#diary").text("");
	$.ajax({
		url:"note/diary/getDiaryById.do?id="+id,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(data){
				//处理内容和标题
				var con=handleCon(data.ncontent);
				if(con.length>50){
					//con=con.substring(0,50)+"...";
				}
				author=data.nwritter;
				document.getElementById("userId").innerText=author;
				//
				var audioInfo="";
				var songDoraId='';
				var ai=data.audioInfo+'';
				if(ai){
					audioInfo="&emsp;<span style='font-size:8px'>本文含有歌曲音频：<a href='http://m.duola.vip/amaze/songsList.jsp' target='_blank' style='color:red'>"+ai.substring(ai.indexOf("-")+1)+"</a>，点击标题后方按钮可唤起播放</span><br><br>";
					songDoraId=ai.substring(0, ai.indexOf("-"))
					songDoraId=""+songDoraId+",2";
				}else{
					songDoraId=""+id+",1";
				}
				var songId=data.nSongId+"";
				var title=data.ntitle+"";
				var title1="";
				if(songId.length<5){
					title1=data.ntitle+"";
				}else{
					console.log("doraId:"+songDoraId)
					ifAutoPlay(songDoraId);//10-07 改为传歌曲id或音频对应日记的id
					title1=data.ntitle+"<span title=\"点击可播放喔\" style=\"cursor:pointer;color:red;\" onclick=\"playerAudio("+songDoraId+")\">▷</span><img style=\"width: 28px;height: 28px;\" src=\"http://img.duola.vip/image/picture/hot1.gif\">";
				}
				
				document.title="《"+title+"》~";
				if(title.length>10){
					title=title.substring(0,8)+"...";
				}
				//分类
				var cate=getCateById(data.ntype);
				
				$("#diary").append("<h2><center>"+title1+"</center></h2>"
						+"<div class='info'><i class=\"Hui-iconfont\">&#xe60d;</i>&nbsp;<a href='author.html?author="+author+"' style=''>"+data.userName
						+"</a>&emsp;<i class=\"Hui-iconfont\">&#xe690;</i>"+data.ntime
						+"&emsp;<i class=\"Hui-iconfont\">&#xe681;</i>"+cate+"&nbsp;:<span title='"+data.ntitle+"'>《"+title+"》</span>&emsp;<i class=\"Hui-iconfont\">&#xe6c9;</i>"+data.nlocation
						+"<div class='zan'><i class=\"Hui-iconfont\">&#xe725;</i><span id='browseNum'>"+data.visitNum+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe622;</i><span id='commentNum'>"
						+data.commentNum+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe66d;</i><span id='praiseNum1'>"+data.praiseNum
						+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe630;</i><span id='storeNum1'>"+data.storeNum+"</span></div></div>"
						+"<div class='content'>"+audioInfo+con+"</div>"
						);
				var updTime=data.updateTime+"";
//				if(updTime.length>5){
//					$("#diary").append("<span style='float:right;margin-right:28px;'>文章于<font color='red'>"+updTime+"</font>被更新</span><br>");
//				}
				
				$("#diary").append("<br>&emsp;&emsp;&emsp;<span>本文链接：<font color='blue'>"+document.URL+"</font>，全文"+data.wordSize+"字符，主人公：<a href='author.html?author="+author+"' style='color:red'>"+data.userName+"</a>");
				$("#diary").append("<br>&emsp;&emsp;&emsp;如需分享请注明出处，谢谢喜欢！</span><br>");

				if(data.nallowComment==1){//不允许评论
					$("#comment").text("");
				}
		}
	});
}
/**
 * 3.根据分类id得到分类名
 * @param id
 * @returns {String}
 */
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
/**
 * 4.处理日记内容
 * @param content
 * @returns
 */
function handleCon(content){
	var con=""+content;//&emsp;&emsp;
	con=con.replace(new RegExp("&amp;","gm"), "&");
	con=con.replace(new RegExp("&lt;","gm"), "<");
	con=con.replace(new RegExp("::::","gm"), ".jpg'>");
	con=con.replace(new RegExp(":::","gm"), ".png'>");
	con=con.replace(new RegExp("::","gm"), ".gif'>");
	con=con.replace(new RegExp("<<<","gm"), "<img alt='' src='http://img.duola.vip/image/expre/newtieba/");
	con=con.replace(new RegExp("<<","gm"), "<img alt='' src='http://img.duola.vip/image/expre/tieba/");
	con=con.replace(new RegExp("&&&&","gm"), "<img alt='' src='http://img.duola.vip/image/expre/weibo/");
	con=con.replace(new RegExp("&&&","gm"), "<img alt='' src='http://img.duola.vip/image/expre/huang/");
	con=con.replace(new RegExp("&&","gm"),"<img alt='' src='http://img.duola.vip/image/expre/aodamiao/");
	//修改“古诗网”内容的img
	con=con.replace(new RegExp("uploads/allimg","gm"), "http://www.exam58.com/uploads/allimg");
	return con.replace(new RegExp("<br>","gm"), "<br>&emsp;&emsp;");
}
/**
 * 5.打开作者的界面
 * @param author
 */
function openAuthor(author){
	window.open("author.html?author="+author, "_blank")
}
/**
 * 6.判断当前登录人是否已点赞、收藏该日记，并对图标做修改
 * @param id
 */
function setIcon(id){
	var user=getCookie("userId")+"";
	var praise=0;//该篇日记当前登录人是否已点赞
	var store=0;//该篇日记当前登录人是否已收藏
	$.ajax({
		url:"note/praise/getPraise.do",
		type:"get",
		async:false,
		dataType:"Json",
		data:{
			PDiary:id,
			type:0,
			PPraiser:user
		},
		success:function(data){
			if(data.pdiary==id){//当前用户已喜欢
				praise=1;
			}
		}
	});
	$.ajax({
		url:"note/store/getStore.do",
		type:"get",
		async:false,
		dataType:"Json",
		data:{
			SDiary:id,
			SStorer:user
		},
		success:function(data){
			if(data.sdiary==id){//当前用户已收藏
				store=1;
			}
		}
	});
	
	var pra=document.getElementById("praise");
	var st=document.getElementById("store");
	if(praise==0){//点赞记录表中无登录用户对于当前日记的点赞记录，视为没点赞
		pra.title="点赞";
		pra.innerHTML="&#xe649;";
	}else{
		pra.title="取消点赞";
		pra.innerHTML="&#xe648;";
	}
	if(store==0){
		st.title="收藏";
		st.innerHTML="&#xe69e;";
	}else{
		st.title="取消收藏";
		st.innerHTML="&#xe630;";
	}
}
/**
 * 7.点赞与取消点赞
 */
function praise(){
	if(!ifLogin()){
		alert("点赞失败，请先登录");
		login_popup();
		return;
	}
	var user=getCookie("userId")+"";
	var pra=document.getElementById("praise");
	var pNum=document.getElementById("praiseNum1");
	if(pra.title=="点赞"){
		$.ajax({
			url:"note/praise/praiseDiary.do",
			type:"get",
			async:false,
			dataType:"text",
			data:{
				PDiary:id,
				type:0,
				PPraiser:user,
				PPraised:author,
				PPraiseTime:formatW2(new Date()+"")
			},
			success:function(res){
				//alert("点赞成功")
			}
		});
		pra.title="取消点赞";
		pra.innerHTML="&#xe648;";
		pNum.innerText=parseInt(pNum.innerText)+1;
	}else{
		$.ajax({
			url:"note/praise/removePraiseDiary.do",
			type:"get",
			async:false,
			dataType:"text",
			data:{
				PDiary:id,
				type:0,
				PPraiser:user
			},
			success:function(res){
				//alert("取消喜欢成功")
			}
		});
		pra.title="点赞";
		pra.innerHTML="&#xe649;";
		pNum.innerText=parseInt(pNum.innerText)-1;
	}
}
/**
 * 8.收藏与取消收藏
 */
function store(){
	if(!ifLogin()){
		alert("收藏失败，请先登录");
		login_popup();
		return;
	}
	var user=getCookie("userId")+"";
	var st=document.getElementById("store");
	var sNum=document.getElementById("storeNum1");
	if(st.title=="收藏"){
		$.ajax({
			url:"note/store/storeDiary.do",
			type:"get",
			async:false,
			dataType:"text",
			data:{
				SDiary:id,
				SStorer:user,
				SStored:author,
				SStoreTime:formatW2(new Date()+"")
			},
			success:function(res){
				//alert("收藏成功")
			}
		});
		st.title="取消收藏";
		st.innerHTML="&#xe630;";
		sNum.innerText=parseInt(sNum.innerText)+1;
	}else{
		$.ajax({
			url:"note/store/removeStoreDiary.do",
			type:"get",
			async:false,
			dataType:"text",
			data:{
				SDiary:id,
				SStorer:user
			},
			success:function(res){
				//alert("取消收藏成功")
			}
		});
		st.title="收藏";
		st.innerHTML="&#xe69e;";
		sNum.innerText=parseInt(sNum.innerText)-1;

	}
}

/**
 * 10.得到当前文章的上下篇
 */
function getBeforeAndNextId(){
	$.ajax({
		url:"note/diary/getBeforeAndNextId.do?author="+author+"&id="+id+"&user="+user,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(data){
			for(var i=0;i<data.length;i++){//返回的list有0,1,2两种可能
				if(data[i].t=='1'){
					//上一篇的id
					var prev=data[i].id;
//					$("#pre").append("<a href='diary.html?id="+prev+"'>上一篇:"+data[i].title+"</a>");
//					$("#pre1").append("<a href='diary.html?id="+prev+"'>上一篇:"+data[i].title+"</a>");
					$("#pre").append("<a href='diary/"+prev+"'>上一篇:"+data[i].title+"</a>");
					$("#pre1").append("<a href='diary/"+prev+"'>上一篇:"+data[i].title+"</a>");
				}else if(data[i].t=='2'){
					//下一篇的id
					var nextT=data[i].id;
//					$("#next").append("<a href='diary.html?id="+nextT+"'>下一篇:"+data[i].title+"</a>");
//					$("#next1").append("<a href='diary.html?id="+nextT+"'>下一篇:"+data[i].title+"</a>");
					$("#next").append("<a href='diary/"+nextT+"'>下一篇:"+data[i].title+"</a>");
					$("#next1").append("<a href='diary/"+nextT+"'>下一篇:"+data[i].title+"</a>");
				}
			}
		}
	});
}
/**
 * 11.评论
 */
function submit_comment(){
	var con=document.getElementById("content").value+"";//内容
	if(con.length<5){
		alert("评论内容不得低于5字符");
		return;
	}
//	alert(id);//当前被评论日记的id
//	alert(author);//被评论日记的作者
	var cid="";
	$.ajax({
		url:"note/comment/commentDiary.do",
		type:"get",
		async:false,
		data:{
			CReviewer:user==""?"":user,
			CReviewedDiary:id,
			CComment:con,
			CReviewed:author
		},
		dataType:"Json",
		success:function(res){
			cid=res.result;
			alert(res.message);
		}
	});
	var at=$("#calledFri").text()+"";//@的人
	if(at.indexOf("、")!=-1){
		$.ajax({
			url:"note/call/callFriend.do",
			type:"get",
			async:false,
			data:{
				AAtorUser:user==""?"":user,
				AType:1,
				ADiary:id,
				AAtedUser:at
			},
			dataType:"Json",
			success:function(res){
				cid=res.result;
				alert(res.message);
			}
		});
	}
	
	loadCom();
	$("#content").val("");
	$("#calledFri").text("");
}
/**
 * 12.加载当前文章的评论
 */
function loadCom(){
	$('#comments').text("");
	$.ajax({
		url:"note/comment/getComByDiaryId.do?id="+id,
		type:"get",
		async:false,
		success:function(res){
			var data=res.result;
			if(data.length<1){
				$('#comments').append("<center>嗨，留下你的神评呗^_^，一楼属于你哒</center>");
			}else{
				$('#comments').append("&emsp;共<font color='red'>"+data.length+"</font>条评论");
			}
			var l=data.length;
			for(var k=0;k<data.length;k++){
				var cId=data[k].reviewId;//评论id
				var comer=data[k].reviewer;//评论者
				var con=data[k].reviewContent;
				con=con.replace(new RegExp("::::","gm"), ".jpg'>");
				con=con.replace(new RegExp(":::","gm"), ".png'>");
				con=con.replace(new RegExp("::","gm"), ".gif'>");
				con=con.replace(new RegExp("<<<","gm"), "<img alt='' src='http://img.duola.vip/image/expre/newtieba/");
				con=con.replace(new RegExp("<<","gm"), "<img alt='' src='http://img.duola.vip/image/expre/tieba/");
				con=con.replace(new RegExp("&&&&","gm"), "<img alt='' src='http://img.duola.vip/image/expre/weibo/");
				con=con.replace(new RegExp("&&&","gm"), "<img alt='' src='http://img.duola.vip/image/expre/huang/");
				con=con.replace(new RegExp("&&","gm"),"<img alt='' src='http://img.duola.vip/image/expre/aodamiao/");
				
				$('#comments').append("<hr>");
				var href="某本站访客";
				var img="dlam";
				if(data[k].reviewer!=''){
					href="<a href='author.html?author="+comer+"' target='_blank'>"+data[k].reviewerName+"</a>&emsp;&emsp;<span style='color:gray;font-size:1px'>"+l+"L</span>";
				}
				if(data[k].headImg){
					img=data[k].headImg;
				}
				var reviewTime=handleTime(data[k].reviewTime);
				$('#comments').append("<img src='http://img.duola.vip/image/tx/"+img+".jpg'>");
				$('#comments').append(href+"&nbsp;&nbsp;<span style='color:gray;font-size:10px;float:right;margin-right:20px'>"+reviewTime+"</span>");
				$('#comments').append("<br><div class='content1'>"+con+"</div>");
				
				
				var pra=wheHasPrCom(cId);//是否已点赞评论，1表示已点赞
				var pNum=getPraComNum(cId);//评论的被点赞数量
				//&#xe66d;	&#xe697;		&#xe66e;	&#xe72e;
				if(pra==1){//
					$('#comments').append("<div class='interact'><span onclick='replyCom("+cId+","+comer
							+")'>回复</span>&emsp;<i class='Hui-iconfont' onclick='praiseCom(\""+cId+"\",\""+comer
							+"\")' title='取消点赞' id='comPraise"+cId+"' style='color:red'>&#xe697;</i>&nbsp;<span id='comPraNum"+cId+"'>"+pNum
							+"</span></div>");
				}else{
					$('#comments').append("<div class='interact'><span onclick='replyCom("+cId+","+comer+")'>回复</span>&emsp;<i class=\"Hui-iconfont\" onclick='praiseCom(\""+cId+"\",\""+comer+"\")' title='点赞' id='comPraise"+cId+"'>&#xe697;</i>&nbsp;<span id='comPraNum"+cId+"'>"+pNum+"</span></div>");
				}
				//加载评论的回复
				loadAllReply(cId);
				l--;
			}
			
		}
	});
}
/**
 * 13.有音频时点击title后的播放按钮播放音频
 * @param songId
 */
function playAudio(sid){
	var url="";
	if(sid.substring(sid.length-5)==".html"){
		url="http://link.hhtjim.com/qq/"+sid.substring(0, sid.length-5)+".mp3";
	}else if(sid.substring(sid.length-3)==".kw"){
		url="http://link.hhtjim.com/kw/"+sid.substring(0, sid.length-3)+".mp3";
	}else if(sid.substring(sid.length-4)==".aac"||
			sid.substring(sid.length-4)==".m4a"||//其他音频平台：荔枝、喜马拉雅
			sid.substring(sid.length-4)==".mp3"||
			sid.indexOf("voice")!=-1){//微信的音频例：https://res.wx.qq.com/voice/getvoice?mediaid=MzI0NDI3MTE4MF8yNjU3NDU1Nzk0
		url=sid;
	}else if(sid.substring(sid.length-4)==".553"){
		url="http://www.duola.vip/res/audio/"+sid.substring(0, sid.length-4)+".mp3";
	}else{
		url="http://music.163.com/song/media/outer/url?id="+sid+".mp3";
	}
	var song=document.getElementById("audio");
	song.src=url;
	song.style.display="inline-block";
}
//14.判断是否已登录
function ifLogin(){
	var userPass=getCookie("userNick")+"";
	if(userPass!=""){//已登录用户，隐藏登录按钮
		return true;
	}
	return false;
}
//15根据登录用户对于音频的设置来处理是否播放音频
function ifAutoPlay(songId,type){
	var autoPlay=0;//0:提示，1:自动播放，2:不播放
	if(user){
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
	
	if(autoPlay==0){//提示是否播放
		var r=confirm("当前日记有对应音频，是否播放?\r(可到我的家园对音频是否自动播放进行设置)");
		if(r==true){
//			playAudio(songId);
			playerAudio(songId,type);
		}
	}else if(autoPlay==1){//无需提示直接播放
//		playAudio(songId);
		playerAudio(songId,type);
	}
}
//16.添加一条访问记录
function addVisitRecord(id){
	var user=getCookie("userId")+"";
	$.ajax({
		url:"note/visit/addVisitRecord.do",
		type:"get",
		async:false,
		data:{
			VDiary:id,
			VVisitor:user,
			VVisited:author
		},
		success:function(){
			
		}
	});
}
//17.@函数--登录用户方可使用
function callFriend(){
	$("#myAtten").text('');
	$("#searchSong").css("display","inline-block");
	$.ajax({
		url:"note/notice/getMyAtten.do?userId="+user,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(res){
			if(res.code==200){
				var data=res.result;
				if(data.length<1){
					alert("只能@你关注的人喔，请先去关注后再来@啦");
				}else{
					$("#myAtten").append("<center>你共关注了<font color='red' size='2px'>"+data.length+"</font>个小伙伴</center>");
				}
				for(var i=0;i<data.length;i++){
					$("#myAtten").append("<a href='author.html?author="+data[i].noticedId+
					"' target='_blank'>"+data[i].noticedName+"</a>&emsp;<font color='red' size='2px'><span onclick='athim(\""+
					data[i].noticedId+"\",\""+data[i].noticedName+"\")'>@他</span></font><hr>");
					
				}
			}else{
				alert("查询失败");
			}
		}
	});
}
//18.
function athim(ated,atedName){
	var con=$("#content").val();
	var at=$("#calledFri").text()+"";
	var i=at.split("、");
	if(at.indexOf(ated)!=-1){
		alert("你已@过这个朋友啦");
		return;
	}
	if(i.length==3){
		alert("单条评论最多可以@两个朋友");
		return;
	}
	$("#content").val(con+"@"+atedName+"  ");
//	$("#calledFri").append("<font title='点击取消@' onclick='cancelAt("+ated+")'>"+ated+"</font>、");
	$("#calledFri").append(ated+"、");
	closeSearch();
}
/*function cancelAt(ated){
	var at=$("#calledFri").text()+"";
	alert(at)
	$("#calledFri").text(at.replace(ated+"、",""));
}*/
/**
 * 19.点赞评论
 * @param cId 回复的评论的id
 * @param comer 被回复的评论者
 */
function praiseCom(cId,comer){
	if(!ifLogin()){
		alert("点赞失败，请先登录");
		login_popup();
		return;
	}
	var user=getCookie("userId")+"";
	var comPraise=document.getElementById("comPraise"+cId);
	var comPraNum=document.getElementById("comPraNum"+cId);
	if(comPraise.title=="点赞"){
		$.ajax({
			url:"note/praise/praiseDiary.do",
			type:"get",
			async:false,
			dataType:"text",
			data:{
				PDiary:cId,//
				type:1,//点赞类型为评论
				PPraiser:user,
				PPraised:comer,
				PPraiseTime:formatW2(new Date()+"")
			},
			success:function(res){
				//alert("点赞成功")
			}
		});
		comPraise.title="取消点赞";
		comPraise.style.color="red";
		comPraNum.innerText=parseInt(comPraNum.innerText)+1;
	}else{
		$.ajax({
			url:"note/praise/removePraiseDiary.do",
			type:"get",
			async:false,
			dataType:"text",
			data:{
				PDiary:cId,
				type:1,//点赞类型为评论
				PPraiser:user
			},
			success:function(res){
				//alert("取消喜欢成功")
			}
		});
		comPraise.title="点赞";
		comPraise.style.color="black";
		comPraNum.innerText=parseInt(comPraNum.innerText)-1;
	}
}
/**
 * 20.打开回复框
 * @param cId 回复的评论的id
 * @param comer 被回复的评论者
 */
function replyCom(cId,comer){
	$("#commId").text(cId);
	$(".replyBox").css("display","inline-block");
}
//21.关闭回复框
function closeReply(){
	$(".replyBox").css("display","none");
}
//22.回复评论
function replyComment(){
	if(!ifLogin()){
		alert("回复失败，请先登录");
		login_popup();
		return;
	}
	var user=getCookie("userId")+"";
	var replyCon=document.getElementById("replyCon").value+"";//内容
	if(replyCon.length<3||replyCon.length>30){
		alert("评论内容不得少于3字符，且不多于30字符");
		return;
	}
	var cid=$("#commId").text();
	$.ajax({
		url:"note/reply/replyCom.do",
		type:"post",
		async:false,
		data:{
			replyer:user==""?"":user,
			RCommentId:cid,
			RContent:replyCon
		},
		dataType:"Json",
		success:function(res){
			alert(res.message);
			loadCom();
			closeReply();
		}
	});
}

//21.判断当前登录人是否已点赞某评论
function wheHasPrCom(cId){
	var user=getCookie("userId")+"";
	var praise=0;
	$.ajax({
		url:"note/praise/getPraise.do",
		type:"get",
		async:false,
		dataType:"Json",
		data:{
			PDiary:cId,
			type:1,//点赞类型为评论
			PPraiser:user
		},
		success:function(data){
			if(data.pdiary==cId){//当前用户已喜欢
				praise=1;
			}
		}
	});
	return praise;
}
/**
 * 22.查询单条评论被点赞数量
 * @param cId
 * @returns {Number}
 */
function getPraComNum(cId){
	var praiseNum=0;
	$.ajax({
		url:"note/praise/getPraiseNum.do",
		type:"get",
		async:false,
		dataType:"text",
		data:{
			PDiary:cId,//评论id
			type:1//点赞类型为评论
		},
		success:function(data){
			praiseNum=data;
		}
	});
	return praiseNum;
}
//23.加载评论 下的回复
function loadAllReply(cId){
	$.ajax({
		url:"note/reply/getReplyById.do?cid="+cId,
		type:"get",
		async:false,
		success:function(res){
			var data=res.result;
			if(data.length>0){
				$('#comments').append("&emsp;&emsp;<font color='red'>"+data.length+"</font>条回复");
				for(var i=0;i<data.length;i++){
					var replyTime=handleTime(data[i].time);
					$('#comments').append("<br>&emsp;&emsp;&emsp;<img src='http://img.duola.vip/image/tx/"+data[i].headImg+".jpg'><a href='author.html?author="+data[i].replyer+"' target='_blank'>"+data[i].replyerName+"</a>&emsp;"+data[i].content+"&emsp;<span style='color:gray;font-size:10px;float:right;margin-right:20px'>"+replyTime+"</span>");
				}
			}
		}
	});
}
//10-07 diary.jsp使用
function playDiaryAudio(audioInfo,nid){
	var songDoraId='';
	if(audioInfo){
		songDoraId=audioInfo.substring(0, audioInfo.indexOf("-"))
		playerAudio(songDoraId,2);
	}else{
		playerAudio(nid,1);
	}
}