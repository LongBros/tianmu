<%@ page language="java" import="java.util.*" pageEncoding="utf-8" isELIgnored="false"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>哆啦网-记录你生活的点点滴滴</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta name="keywords" content="${diary.NTitle}">
	<meta name="description" content="${diary.userName}于${diary.NTime}写的日记：${diary.NTitle}">
	<meta charset="utf-8">
	<meta name="renderer" content="webkit|ie-comp|ie-stand">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
	<meta http-equiv="Cache-Control" content="no-siteapp" />
	<link rel="Bookmark" href="/favicon.ico" >
	<link rel="Shortcut Icon" href="http://img.duola.vip/image/logo/dlam.jpg" />
	<!--[if lt IE 9]>
	<script type="text/javascript" src="lib/html5shiv.js"></script>
	<script type="text/javascript" src="lib/respond.min.js"></script>
	<![endif]-->
	<link rel="stylesheet" type="text/css" href="hui/diary/css/index1.css">
	<link rel="stylesheet" type="text/css" href="hui/diary/css/index.css"><!-- 回顶部 -->
	<link rel="stylesheet" type="text/css" href="hui/static/h-ui/css/H-ui.min.css" />
	<link rel="stylesheet" type="text/css" href="hui/static/h-ui.admin/css/H-ui.admin.css" />
	<link rel="stylesheet" type="text/css" href="hui/lib/Hui-iconfont/1.0.8/iconfont.css" />
	<link rel="stylesheet" type="text/css" href="hui/static/h-ui.admin/skin/default/skin.css" id="skin" />
	<link rel="stylesheet" type="text/css" href="hui/static/h-ui.admin/css/style.css" />
	<script type="text/javascript" src="js/jsutil.js"></script>
	<script type="text/javascript" src="hui/diary/js/jquery.js"></script>
	<script type="text/javascript" src="js/index.js"></script><!-- 获取当前登录用户 -->
	<script type="text/javascript" src="js/timeDeal.js"></script><!-- 时间处理函数 -->
	<script type="text/javascript" src="js/new.js"></script><!-- 评论使用到 -->
	<script type="text/javascript" src="js/diary.js"></script>
	<script type="text/javascript" src="js/baidu.js"></script>
  </head>
  <style type="text/css">
	.contents{
		width: 880px;
		margin-left: 420px;
		background:white ;
	}
	.diary{
		width: 800px;
		margin-left: 10px;
		margin-top: 30px;
		padding-top:25px;
	}
	.diary img{
		width: 20px;
		height: 24px;
		padding: 1px;
	}
	.info{
		color: gray;
		font-size: 10px;
		margin-left: 50px;
	}
	.zan{
		float:right;
		margin-right: 15px;
	}
	.rights{
		top: 75px;
		left:38px;
		width:356px;
		position:fixed;
		float: right;
		background:white;
		height: 520px;
	}
	.rights img{
		width: 84px;
		height: 130px;
		padding: 1px;
		margin-left:20px;
		margin-top:20px;
		border-radius:5px;
	}
	.rights .perStatistic{
		padding-left: 20px;
		margin-top: 10px;
		padding-bottom: 10px;
	}
	.rights .perInfo{
		padding-left: 20px;
		margin-top: 10px;
		padding-bottom: 10px;
	}
	.rights .activeInfo{
		padding-left: 20px;
		margin-top: 20px;
	}
	.content{
		padding-left:40px;
		margin-top: 20px;
	}
	.praiseAStore{
		text-align: center;
		margin-top: 20px;
	}
	.comment{
		margin-left: 20px;
		margin-bottom: 20px;
	}
	.expre{
		margin-left: 10px;
		margin-top: 5px;
	}
	.expre img{
		width: 20px;
		height: 24px;
		padding: 1px;
		/*display:none;隐藏后不占空间*/
		/*visibility:visible;*//*隐藏后仍占空间*/
	}
	#comments{
		background:#FFF;
		width: 100%;
		padding:20px; 
		float: left;
	}
	#comments img{
		width: 20px;
		height: 24px;
		padding: 1px;
	}
	#comments .content1{
		margin-top: 3px;
		margin-bottom:5px;
		margin-left: 18px;
	}
	#comments .interact{
		float:right;
		margin-right: 20px;
		cursor: pointer;
	}
	#comments .interact span{
		font-size:10px;
	}
	#comments .interact i{
		color: black;
	}
	.replyBox{
		cursor:pointer;position:fixed;
		overflow:scroll;background:#3CBC8D;
		right:320px;top:200px;width:240px;
		height:240px;display: none
	}
	.replyBox #tips{
		margin-left: 5px;
	}
	.replyBox textarea{
		background: white;
		margin-left: 5px;
	}
	.replyBox button{
		float:right;
		margin-right: 10px;
		background: gray;
		width:66px;
		color: white;
	}
	</style>
  <body id="bodys" style="background:url(http://img.duola.vip/image/back/back3.jpg)">
    <header class="navbar-wrapper">
		<div class="navbar navbar-fixed-top">
			<div class="container-fluid cl"> <a class="logo navbar-logo f-l mr-10 hidden-xs" href="/">哆啦日记</a> 
			<a class="logo navbar-logo-m f-l mr-10 visible-xs" href="newDiary.html">写日记</a> 
				<span class="logo navbar-slogan f-l mr-10 hidden-xs">Doranote</span> 
				<a aria-hidden="false" class="nav-toggle Hui-iconfont visible-xs" onclick="loginPhone()" id="loginMobile">登录</a>
				<a aria-hidden="false" class="nav-toggle Hui-iconfont visible-xs" href="index.html">首页</a>
				<nav id="Hui-userbar" class="nav navbar-nav navbar-userbar hidden-xs">
				<ul class="cl">
					<li id="homepage" style="cursor:pointer;" onclick="openNewPage('1')">首页</li>
					<li class="dropDown dropDown_hover">
						<a href="#" class="dropDown_A"><span id="image">admin</span> <i class="Hui-iconfont">&#xe6d5;</i></a>
						<ul class="dropDown-menu menu radius box-shadow">
							<li><a href="javascript:;" id="myHome" style="display:none" onClick="openNewPage('2')">我的家园</a></li>
							<li><a href="javascript:;" id="write" style="display:none" onClick="openNewPage('3')">写日记</a></li>
							<li><a href="javascript:;" id="alarm" style="" onClick="openNewPage('4')">553Music</a></li>
							<li><a href="http://112.74.173.44/LongMusic/index0.jsp" target="_blank">哆啦闹铃</a></li>
							<li><a href="http://blog.duola.vip/msgboard.jsp" target="_blank">每日一句</a></li>
							<li><a href="javascript:;" id="exit" style="display:none" onClick="openNewPage('6')">退出</a></li>
							<li><a class="login" id="login" style="display:block">登录</a></li>
						</ul>
					</li>
					<li id="Hui-msg" class="dropDown right dropDown_hover"> 
						<a href="#" title="消息">
						<span class="badge badge-danger" id="unReadNum">
						${(message.comNum+message.praiseNum+message.noticedNum)==0?'':(message.comNum+message.praiseNum+message.noticedNum)}</span>
						<i class="Hui-iconfont" style="font-size:18px">&#xe68a;</i>
						</a> 
						<ul class="dropDown-menu menu radius box-shadow">
							<li><a href="message.html?tab=0" data-val="red" title="公告数目">公告<font color="red"><span id="advNum"></span></font></a></li>
							<li><a href="message.html?tab=2" target='_blank' data-val="default" title="评论数目">评论<font color="red"><span>${message.comNum==0?'':message.comNum }</span></font></a></li>
							<li><a href="message.html?tab=3" target='_blank' data-val="blue" title="获赞数目">获赞<font color="red"><span>${message.praiseNum==0?'':message.praiseNum }</span></font></a></li>
							<li><a href="message.html?tab=1" target='_blank' data-val="green" title="关注数目">关注<font color="red"><span>${message.noticedNum==0?'':message.noticedNum }</span></font></a></li>
							<li><a href="javascript:;" data-val="yellow" title="点击后消息标记为已读" id="cleanBtn" style="display:none" onclick="setAsReaded()">朕已阅✔</a></li>
							<li><a href="message.html?tab=5" target='_blank'data-val="yellow" title="消息设置">设置</a></li>
						</ul>
					</li>
					<li id="Hui-skin" class="dropDown right dropDown_hover"> <a href="javascript:;" class="dropDown_A" title="换肤"><i class="Hui-iconfont" style="font-size:18px">&#xe62a;</i></a>
						<ul class="dropDown-menu menu radius box-shadow">
							<li><a href="javascript:;" data-val="default" title="默认（黑色）">默认（黑色）</a></li>
							<li><a href="javascript:;" data-val="blue" title="蓝色">蓝色</a></li>
							<li><a href="javascript:;" data-val="green" title="绿色">绿色</a></li>
							<li><a href="javascript:;" data-val="red" title="红色">红色</a></li>
							<li><a href="javascript:;" data-val="yellow" title="黄色">黄色</a></li>
							<li><a href="javascript:;" data-val="orange" title="橙色">橙色</a></li>
						</ul>
					</li>
				</ul>
			</nav>
		</div>
	</div>
	</header>

	<div class="modal fade" id="loginModal" style="display:none;">
		<div class="modal-dialog modal-sm" style="width:540px;">
			<div class="modal-content" style="border:none;">
				<div class="col-left"></div>
				<div class="col-right">
					<div class="modal-header">
						<button type="button" id="login_close" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
						<h4 class="modal-title" id="loginModalLabel" style="font-size: 18px;"><span onclick="loginOrRegister(0)">登录</span>&emsp;&emsp;<span onclick="loginOrRegister(1)">注册</span></h4>
					</div>
					<div class="modal-body">
						<section class="box-login v5-input-txt" id="box-login">
							<div id="loginBox">
								<form id="login_form" name="login_form" action="" method="post" autocomplete="off">
								<ul>
									<li class="form-group"><input class="form-control" id="id_account_l" maxlength="50" name="account_l" placeholder="请输入哆啦id" type="text"></li><br>
									<li class="form-group"><input class="form-control" id="id_password_l" name="password_l" placeholder="请输入密码" type="password"></li>
								</ul>
								</form>
								<p class="good-tips marginB10"><a id="btnForgetpsw" class="fr"><!-- 忘记密码？ --></a>还没有账号？<a href="javascript:;" onclick="loginOrRegister(1)" target="_blank" id="btnRegister">立即注册</a></p>
								 <div class="login-box marginB10">
									<button id="login_btn" type="button" onclick="login()" class="btn btn-micv5 btn-block globalLogin">登录</button>
									<div id="login-form-tips" class="tips-error bg-danger" style="display: none;">错误提示</div>
								</div>
							</div>
							<div id="registerBox" style="display:none">
								<form id="register_form" name="register_form" action="" method="post" autocomplete="off">
									<ul>
										<li class="form-group"><input class="form-control" id="id_dora_r" maxlength="8" name="dora_r" placeholder="请输入哆啦id(可空)" type="text"></li>
										<li class="form-group"><input class="form-control" id="id_userName_r" maxlength="20" name="userName_r" placeholder="请输入用户名" type="text"></li>
										<li class="form-group"><input class="form-control" id="id_password_r" name="password_r" placeholder="请输入密码" type="password"></li>
										<li class="form-group"><input class="form-control" id="id_inviter_r" name="inviter_r" placeholder="请输入邀请码(可空)" type="text"></li>
									</ul>
								</form>
								<div class="login-box marginB10">
									<button id="login_btn" type="button" onclick="register()" class="btn btn-micv5 btn-block globalLogin">注册</button>
									<div id="login-form-tips" class="tips-error bg-danger" style="display: none;">错误提示</div>
								</div>
							</div>
<!-- 								<div class="threeLogin"><span>其他方式登录</span><a class="nqq" href="javascript:;"></a><a class="nwx" href="javascript:;"></a><a class="nwb"></a></div>
 -->					</section>
					</div>
				</div>
			</div>
		</div>
	</div>	

	<div class="contents" id="contents">
		<span id="pre" style="float: left;margin-left: 20px;margin-top: 10px;"></span>
		<span id="next" style="float: right;margin-right: 20px;margin-top: 10px;"></span>
		<audio id="audio" src="" autoplay="autoplay" controls="controls" style="float: left;margin-left: 20px;margin-top: 10px;display:none"></audio>
		<div class="diary" id="diary">
			<h2>
			<center>
				${diary.NTitle }
				<c:if test="${not empty diary.nSongId}">
					<span title="点击可播放喔" style="cursor:pointer;color:red;" onclick="playDiaryAudio('${diary.audioInfo}','${diary.NId}')">▷</span>
					<img style="width: 28px;height: 28px;" src="http://img.duola.vip/image/picture/hot1.gif">
				</c:if>
			</center>
			</h2>
			<div class='info'>
				<i class="Hui-iconfont">&#xe60d;</i><span style='cursor:pointer'>${diary.userName}</span>&emsp;
				<i class="Hui-iconfont">&#xe690;</i>${diary.NTime }&emsp;
				<i class="Hui-iconfont">&#xe681;</i>
				<c:choose><c:when test="${diary.NType=='0'}">生活日记</c:when><c:when test="${diary.NType=='1'}">工作笔记</c:when>
				<c:when test="${diary.NType=='2'}">idea</c:when><c:when test="${diary.NType=='3'}">诗词(文学)</c:when>
				<c:when test="${diary.NType=='4'}">深度好文</c:when></c:choose>
				&nbsp;:
				
				<span title='${diary.NTitle}'>${diary.NTitle}</span>&emsp;
				<i class="Hui-iconfont">&#xe6c9;</i>${diary.NLocation}
				<div class='zan'>
					<i class="Hui-iconfont">&#xe725;</i><span id='browseNum'>${diary.visitNum}</span>&nbsp;
					<i class="Hui-iconfont">&#xe622;</i><span id='commentNum'>${diary.commentNum}</span>&nbsp;
					<i class="Hui-iconfont">&#xe66d;</i><span id='praiseNum1'>${diary.praiseNum}</span>&nbsp;
					<i class="Hui-iconfont">&#xe630;</i><span id='storeNum1'>${diary.storeNum}</span>
				</div>
			</div>
			<div class='content'>
			<c:if test="${not empty diary.audioInfo}">
				&emsp;<span style='font-size:8px'>本文含有歌曲音频：<a href='http://m.duola.vip/amaze/songsList.jsp' target='_blank' style='color:red'>${diary.audioInfo}</a>，点击标题后方按钮可唤起播放</span><br><br>
			</c:if>
			${diary.NContent}
			</div>
			<br>&emsp;&emsp;&emsp;<span>本文链接：${url}<font color='blue'></font>，全文${diary.wordSize}字符，主人公：<a href='author.html?author=${diary.NWritter}' style='color:red'>${diary.userName}</a>			
		    <br>&emsp;&emsp;&emsp;如需分享请注明出处，谢谢喜欢！</span><br>
		</div>
		<span id="pre1" style="float: left;margin-left: 20px;margin-top: 10px;"></span>
		<span id="next1" style="float: right;margin-right: 20px;margin-top: 10px;"></span>
		<br>
		<div class="praiseAStore">
			<i class="Hui-iconfont" id="praise" onclick="praise()" title="点赞" style="font-size: 33px;cursor: pointer;">&#xe649;</i>
	  &emsp;<i class="Hui-iconfont" id="store" onclick="store()" title="收藏" style="font-size: 33px;cursor: pointer;">&#xe69e;</i>
		</div>
		
		<div class="comment" id="comment">
			<div class="row cl">
				<div class="formControls col-xs-8 col-sm-10">
					<textarea rows="16" name="content" id="content" class="textarea" onkeyup="calcInput()" placeholder="期待你的神评喔..."></textarea>
					<p class="textarea-numberbar"><em class="textarea-length" id="inputNum">0</em>/2000</p>
				</div>
				<button onClick="submit_comment();" class="btn btn-secondary radius" type="button"><i class="Hui-iconfont">&#xe632;</i> 提交评论</button>
			</div>
			<div class="row cl">
				<div class="formControls col-xs-8 col-sm-6">
					<img alt="嗷大喵表情" title="嗷大喵表情" style="width: 18px;height: 18px" src="http://img.duola.vip/image/expre/aodamiao/weixiao.gif" onmousedown="oocImage('0','1')">
					<img alt="小黄脸表情" title="小黄脸表情" style="width: 18px;height: 18px" src="http://img.duola.vip/image/expre/huang/wx.gif" onmouseover="closeImgHu()" onmousedown="oocImage('1','1')">
					<!-- <img alt="aru表情" title="aru表情" style="width: 18px;height: 18px" src="image/expre/aru/1.png" onmouseover="" onmousedown="oocImage('2')"> -->
					<img alt="新贴吧表情" title="新贴吧表情" style="width: 18px;height: 18px" src="http://img.duola.vip/image/expre/newtieba/a.png" onmouseover="" onmousedown="oocImage('3','1')">
					<!--  <img alt="qq表情" title="qq表情" style="width: 18px;height: 18px" src="image/expre/qq/aini.gif" onmouseover="" onmousedown="oocImage('4')">-->
					<img alt="贴吧表情" title="贴吧表情" style="width: 18px;height: 18px" src="http://img.duola.vip/image/expre/tieba/a.png" onmouseover="" onmousedown="oocImage('5','1')">
					<img alt="微博表情" title="微博表情" style="width: 18px;height: 18px" src="http://img.duola.vip/image/expre/weibo/aini.png" onmouseover="" onmousedown="oocImage('6','1')">
					<span onclick="callFriend()">@</span>&emsp;<span title="@的朋友以此为准" id="calledFri"></span>
				</div>
				<div class="expre" id="expre" style="width: 200px">
				</div>
			</div>
			<div id="searchSong" style="cursor:pointer;position:fixed;overflow:scroll;background:#3CBC8D;right:150px;top:200px;width:240px;height:350px;display: none">
				<span onclick="closeSearch()" style="color:black;margin-left: 210px;">X</span>
				<input id="key" name="key" type="text" oninput="searchMusic()" placeholder="搜索你想@的用户">
				<div id="myAtten">
					<br><br><br><br>
				</div>
			</div>
		</div>
		<!-- 评论 -->
		<div id="comments">
		</div>
	</div>
	<div class="replyBox" id="replyBox">
		<span onclick="closeReply()" style="color:black;margin-left: 210px;">X</span>
		<span id="tips">请在下方输入回复：</span>
		<textarea id="replyCon" cols="30" rows="8" placeholder="回复内容不得少于3字符，且不多于30字符"></textarea>
		<span id="commId">44</span>
		<button onclick="replyComment()">回复</button>
	</div>
	<div class="rights" id="rights">
			<img src='http://img.duola.vip/image/logo/dlam.jpg' id="touxiang" class='touxiang'>
			<!-- 自己的账号显示上传头像按钮，别人的根据有没有关注而显示 -->
			<span id="attention" onclick="attenAuthor()" style="background: red;color:white;font-size: 12px;cursor: pointer;"></span>
		<div class="perStatistic">
			关注：<span title="她关注的人" id="careNum">0</span>&emsp;粉丝：<span title="关注她的人" id="noticedNum">0</span>&emsp;
			喜欢：<span title="她喜欢的日记" id="likeNum">0</span>&emsp;收藏：<span title="她收藏的日记" id="storeNum">0</span><br>	
			被读：<span title="她的日记总被阅读量" id="visitedNum">0</span>&emsp;阅读：<span title="她的阅读量" id="visitNum">0</span>&emsp;被评：<span title="她的日记总被评论量" id="comedNum">0</span>
			&emsp;被赞：<span title="她的日记总被赞数量" id="praisedNum">0</span>
		</div>
		<hr>
		<div class="perInfo">
			<!-- <span id="userNameT">LongBro</span><br> -->
			昵称：<span id="userName">${diary.userName}</span><br>
			哆啦ID：<span id="userId">${diary.NWritter}</span><br>
			家歌：<span id="homeSong">四块五</span><br>
			性别：<span id="sex">男</span><br>
			个性签名：<span id="signature">自先沉稳，而后爱人</span><br>
		</div>
		<hr>
		<div class="activeInfo">
			<i class="Hui-iconfont">&#xe690;</i><span id="joinTime">加入时间：</span><br>
			<i class="Hui-iconfont">&#xe690;</i><span id="recentLogin">最近登录：</span><br>
			<i class="Hui-iconfont">&#xe6d3;</i><span id="diaryDayNum" title="星星=1天，月亮=7天，太阳=49天">写日记天数：</span><br>
		</div>
	</div>
	<div class="toTop">
		<a href="#" title="点我回顶部喔">^^</a>
	</div>
	<!--_footer 作为公共模版分离出去-->
	<script type="text/javascript" src="hui/lib/jquery/1.9.1/jquery.min.js"></script> 
	<script type="text/javascript" src="hui/lib/layer/2.4/layer.js"></script>
	<script type="text/javascript" src="hui/static/h-ui/js/H-ui.min.js"></script>
	<script type="text/javascript" src="hui/static/h-ui.admin/js/H-ui.admin.js"></script> <!--/_footer 作为公共模版分离出去-->
	<script type="text/javascript">
		function GetQueryString(name)
		{
		     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		     var r = window.location.search.substr(1).match(reg);
		     if(r!=null)return  unescape(r[2]); return null;
		}
		$(".login").on("click", login_popup),function() {
		    var e = [];
		    $(".modal").on("show.bs.modal",
		    function() {
		        for (var s = 0; e.length > s; s++) e[s] && (e[s].modal("hide"), e[s] = null);
		        e.push($(this));
		        var o = $(this),
		        a = o.find(".modal-dialog"),
		        t = $('<div style="display:table; width:100%; height:100%;"></div>');
		        t.html('<div style="vertical-align:middle; display:table-cell;"></div>'),
		        t.children("div").html(a),
		        o.html(t)
		    })
		} ();
		var id ="";
		var author="";//当前日记的作者
		var user=getCookie("userId")+"";//当前登录用户
		$(function(){
			id=${diary.NId};
			var audioInfo='${diary.audioInfo}'+'';
			var songDoraId='';
			if(audioInfo.length>=5){
				songDoraId=audioInfo.substring(0,audioInfo.indexOf("-"))
				ifAutoPlay(songDoraId,2);
			}else{
				ifAutoPlay(id,1);
			}

			var unReadNum=$("#unReadNum").text();
			if(unReadNum>0){
				document.getElementById("cleanBtn").style.display="inline-block";
			}
			
			getUser();
			//网页title由loadDiary函数和loadAuthorInfo共同生成
			document.title="《${diary.NTitle }》~${diary.userName}";

			//document.getElementById("userId").innerText=user;
			//判断当前登录人是否已点赞、收藏该日记，并对图标做修改
			setIcon(id);//若该函数出错，会导致下方不能执行
			author=document.getElementById("userId").innerText;//在loadDiary函数中设置的
			
			loadAuthorInfo();//加载当前日记作者的关注、粉丝、喜欢、收藏及其他基本信息以显示
			
			getNearDiary();

			loadCom();//加载评论
			ifAttention();
			//12-12日记页和作者页定为相关作者的背景
			if(user!=""){
				getSetting(author);//加载登录用户的设置
			} 
			monitor();//手机访问时隐藏左边栏目
		});
		function getNearDiary(){
			var nearDiary='${nearDiary}';//
			var datas=nearDiary.replace(new RegExp("=","gm"), "\":\"").replace(new RegExp("{","gm"), "{\"")
								.replace(new RegExp("}","gm"), "\"}").replace(new RegExp(",","gm"), "\",\"")
								.replace(new RegExp(" ","gm"), "").replace(new RegExp("}\",\"{","gm"), "},{");
			var data=jQuery.parseJSON(datas);
			for(var i=0;i<data.length;i++){//返回的list有0,1,2两种可能
				if(data[i].t=='1'){
					//上一篇的id
					var prev=data[i].id;
					$("#pre").append("<a href='diary/"+prev+"'>上一篇:"+data[i].title+"</a>");
					$("#pre1").append("<a href='diary/"+prev+"'>上一篇:"+data[i].title+"</a>");
				}else if(data[i].t=='2'){
					//下一篇的id
					var nextT=data[i].id;
					$("#next").append("<a href='diary/"+nextT+"'>下一篇:"+data[i].title+"</a>");
					$("#next1").append("<a href='diary/"+nextT+"'>下一篇:"+data[i].title+"</a>");
				}
			}
		}
	</script> 
  </body>
</html>
