<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<c:set var="ctxPath" value="${pageContext.request.contextPath}" />
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>哆啦网-记录你生活的点点滴滴</title>
    <meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
    <meta name="keywords" content="哆啦网,哆啦日记首页,哆啦日记">
	<meta name="description" content="哆啦网,是一个以记录生活、工作、心情等为主题的网站,记录形式主要以文本、音频为主;它不仅仅是怀旧,更想为你记录你生活的点点滴滴。哆啦日记，做全网最有意思、最有用的日记记录网站。">
	<meta charset="utf-8">
	<meta name="renderer" content="webkit|ie-comp|ie-stand">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
	<meta http-equiv="Cache-Control" content="no-siteapp" />
	<link rel="Bookmark" href="/favicon.ico" >
	<link rel="Shortcut Icon" href="http://img.duola.vip/image/logo/dlam.jpg" />
	<link rel="stylesheet" type="text/css" href="css/index1.css">
	<link rel="stylesheet" type="text/css" href="css/index2.css"><!-- 首页 -->
	<link rel="stylesheet" type="text/css" href="css/index.css"><!-- 回顶部 -->
	<link rel="stylesheet" type="text/css" href="hui/static/h-ui/css/H-ui.min.css" />
	<link rel="stylesheet" type="text/css" href="hui/static/h-ui.admin/css/H-ui.admin.css" />
	<link rel="stylesheet" type="text/css" href="hui/lib/Hui-iconfont/1.0.8/iconfont.css" />
	<link rel="stylesheet" type="text/css" href="hui/static/h-ui.admin/skin/default/skin.css" id="skin" />
	<link rel="stylesheet" type="text/css" href="hui/static/h-ui.admin/css/style.css" />
	
	<script type="text/javascript" src="hui/diary/js/jquery.js"></script>
	<script type="text/javascript" src="js/index.js"></script>
	<script type="text/javascript" src="js/index1.js"></script>
	<script type="text/javascript" src="js/timeDeal.js"></script><!-- 时间处理函数 -->
	<script type="text/javascript" src="js/baidu.js"></script>
  </head>
  
  <body id="bodys" style="background:url(http://img.duola.vip/image/back/back3.jpg)">
    <header class="navbar-wrapper">
		<div class="navbar navbar-fixed-top">
			<div class="container-fluid cl"> <a class="logo navbar-logo f-l mr-10 hidden-xs" href="/">哆啦网</a> 
				<a class="logo navbar-logo-m f-l mr-10 visible-xs" href="newDiary.html">写日记</a> 
				<span class="logo navbar-slogan f-l mr-10 hidden-xs">Doranote</span> 
				<a aria-hidden="false" class="nav-toggle Hui-iconfont visible-xs" onclick="loginPhone()" id="loginMobile">登录</a>
				<nav id="Hui-userbar" class="nav navbar-nav navbar-userbar hidden-xs">
				<ul class="cl">
					<li class="dropDown dropDown_hover">
						<a href="#" class="dropDown_A"><span id="image">admin</span> <i class="Hui-iconfont">&#xe6d5;</i></a>
						<ul class="dropDown-menu menu radius box-shadow">
							<li><a href="javascript:;" id="myHome" style="display:none" onClick="openNewPage('2')">我的家园</a></li>
							<li><a href="javascript:;" id="write" style="display:none" onClick="openNewPage('3')">写日记</a></li>
							<li><a href="javascript:;" id="exit" style="display:none" onClick="openNewPage('6')">退出</a></li>
							<li><a href="https://support.qq.com/products/136712" target="_blank">留言板</a></li>
							<li><a class="login" id="login" style="display:block">登录</a></li>
						</ul>
					</li>
					<li id="Hui-msg" class="dropDown right dropDown_hover"> <a href="#" title="消息"><span class="badge badge-danger" id="unReadNum"></span><i class="Hui-iconfont" style="font-size:18px">&#xe68a;</i></a> 
						<ul class="dropDown-menu menu radius box-shadow">
							<li><a href="message.html?tab=0" data-val="red" title="公告数目">公告<font color="red"><span id="advNum"></span></font></a></li>
							<li><a href="message.html?tab=2" target='_blank' data-val="default" title="评论数目">评论<font color="red"><span id="comNum"></span></font></a></li>
							<li><a href="message.html?tab=3" target='_blank' data-val="blue" title="获赞数目">获赞<font color="red"><span id="praiseNum"></span></font></a></li>
							<li><a href="message.html?tab=1" target='_blank' data-val="green" title="关注数目">关注<font color="red"><span id="noticeNum"></span></font></a></li>
							<li><a href="javascript:;" data-val="yellow" title="点击后消息标记为已读" id="cleanBtn" style="display:none" onclick="setAsReaded()">朕已阅✔</a></li>
							<li><a href="message.html?tab=5" target='_blank'data-val="yellow" title="消息设置">设置</a></li>
						</ul>
					</li>
					<li id="Hui-skin" class="dropDown right dropDown_hover"> <a href="javascript:;" class="dropDown_A" title="换肤"><i class="Hui-iconfont" style="font-size:18px">&#xe62a;</i></a>
						<ul class="dropDown-menu menu radius box-shadow">
							<li><a href="javascript:;" data-val="default" title="黑色">默认（黑色）</a></li>
							<li><a href="javascript:;" data-val="blue" title="默认（蓝色）">蓝色</a></li>
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
						<h4 class="modal-title" id="loginModalLabel" style="font-size: 18px;">
							<span onclick="loginOrRegister(0)">登录</span>&emsp;&emsp;
							<span onclick="loginOrRegister(1)">注册</span>
						</h4>
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
 -->							</section>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="contents" id="contents">
		<div class="tabs"  style="background: #5fb878;color:white;height: 40px;cursor: pointer;">
			<span id="recommend" onclick="switchTab(0)" title="随机推荐几篇日记">推荐</span>
			<span id="notice" onclick="switchTab(1)" title="你关注的人的最新10篇日记">关注</span>
			<span id="time" onclick="switchTab(2)">时间轴</span>
			<span id="yesterday" onclick="switchTab(3)">昨天</span>
			<span id="listen" onclick="switchTab(4)">聆听</span>
		</div>
		<div class="pages" style="cursor: pointer;">
		</div>
		<!-- <div id="album" style="display:none">
			<img alt="" src="image/album.png" style="float: right;margin-right: 260px;">
			<span id="logoword" style="float: right;position: fixed;margin-left: 373px;margin-top: 80px;font-size:1px;color: white">DoraNote</span>
		</div> -->
		<div class="diarys" id="diarys">
			<div class="diary" >
				<center><img alt="" src="http://img.duola.vip/image/loading.gif" style="width: 88px;height: 88px;"></center>
				<center><span style="color:blue;font-size: 20px;margin-top: 20px;">数据加载中，客官请稍后^_^<br></span></center>
			</div>
		</div>
		<div class="pages" style="cursor: pointer;">
		</div>
	</div>
	<div class="rights" id="rights">
		<div style="background: #5fb878;color:white;height: 25px;cursor: pointer;">
			<span style="margin-left: 10px;margin-top: 7px;font-size: 8px;">哆啦寄语：</span>
		</div>
		<div style="background:#5fb878;height: 1px;"></div>
		<div class="website" style="margin-top: 10px">
			www.duola.vip，哆啦日记，记录你生活的点点滴滴！<br>
		</div>
		<!-- <div class="statistic">
			&emsp;哆啦统计<br>在线人数：8888<br>用户数：888888<br>
			今日笔记：88<br>总日记数：8888888<br><br>
		</div> -->
		<div style="background:#5fb878;height: 1px;margin-top: 10px"></div>
		<div style="background: #5fb878;color:white;height: 25px;cursor: pointer;">
			<span style="margin-left: 10px;margin-top: 7px;font-size: 8px;">推荐关注：</span>
		</div>
		<div class="alluser" id="alluser">
		</div>
		<div style="height: 100px;">
			<div style="background: #5fb878;color:white;height: 25px;cursor: pointer;">
				<span style="margin-left: 10px;margin-top: 7px;font-size: 8px;">友情链接：</span>
			</div>
			<div style="background:#5fb878;height: 1px;"></div>
			<div class="website" style="margin-top: 10px;margin-bottom: 10px;">
				<a href="http://m.duola.vip/amaze/songsList.jsp" target="_blank">553Music</a>&emsp;
				<a href="http://www.gold404.cn/" target="_blank">K先生的博客</a>&emsp;
				<a href="http://112.74.173.44/LongMusic/util/index0.jsp" target="_blank">哆啦闹铃</a>&emsp;
				<a href="http://www.17419.vip/" target="_blank">17419</a><br>
				<a href="https://www.autopiano.cn/" target="_blank">自由钢琴</a>&emsp;
				<a href="http://blog.duola.vip/msgboard.jsp" target="_blank">每日一句</a>&emsp;
<!-- 				<br><center><a href="http://www.beian.miit.gov.cn/" target="_blank">豫ICP备19043404号</a></center>
 -->
			</div>
		</div>
		<audio id="audio" src="" autoplay="autoplay" controls="controls" style="float: left;margin-left: 20px;margin-top: 10px;display:none"></audio>
	</div>
	<div class="toTop">
		<a href="#" title="点我回顶部喔">^^</a>
	</div>
	<div id="sponsorImage" style="display:none;background:#009688;width:200px;bottom:50px;height:240px;position:fixed;cursor: pointer;">
		
		<img id="paypal" alt="" style="margin-left: 20px;display:inline-block" src="http://img.duola.vip/image/picture/paypal.jpg" width="160px" height="219px">
    	<img id="wechat" alt="" style="margin-left: 20px;display: none" src="http://img.duola.vip/image/picture/wechat.jpg" width="160px" height="219px">
    	<img id="qq" alt="" style="margin-left: 20px;display: none" src="http://img.duola.vip/image/picture/qq.jpg" width="160px" height="219px">
    	<div style="background-color: pink;padding-bottom: 8px;padding-top: 4px;">
			<span id="payBtn" style="float: left;margin-left: 20px;color:red" onclick="switchImg('pay')">支付宝</span>&emsp;
			<span id="weBtn" style="float: center;margin-left: 17px;margin-right: 20px" onclick="switchImg('we')">微信</span>&emsp;
			<span id="qqBtn" style="float: right;margin-right: 18px" onclick="switchImg('qq')">QQ</span>
		</div>
    </div>
	<div style="background: #fff;position:fixed;bottom:0; left:0px;width:100%;height:30px;cursor:pointer; ">
		
		<div style="margin-left:50px;padding-top:1px;font-size: 13px;float: left;">
			<span id="sponsor" onclick="tabOnItem('2')">赞赏支持</span>&nbsp;<i class="Hui-iconfont" title="赞助记录" onclick="tabOnItem('4')" style="font-size:18px">&#xe627;</i>&nbsp;|&emsp;
			<span onclick="tabOnItem('0')">每日一句</span>&emsp;|&emsp;
			<span onclick="tabOnItem('1')">用户使用指南</span>&nbsp;<img alt="" style="width: 18px;height: 18px;" src="http://v.duola.vip/image/picture/hot1.gif">&nbsp;|&emsp;
			<span onclick="tabOnItem('3')" title="给作者留下你的珍贵性建议">留言作者</span>&emsp;<!-- |&emsp;
			<span onclick="tabOnItem('5')">哆啦统计</span><img alt="" style="width: 18px;height: 18px;" src="image/picture/hot1.gif"> -->
		</div>
		<span style="margin-right:50px;padding-top:3px;font-size: 15px;float: right;"><a href="http://www.duola.vip" style="text-decoration: none">www.duola.vip</a> © 2018~2020	&emsp;|&emsp;<a href="http://www.duola.vip" style="text-decoration: none">豫ICP备19043404号-1</a></span>
	</div>
	<!--_footer 作为公共模版分离出去-->
	<script type="text/javascript" src="hui/lib/jquery/1.9.1/jquery.min.js"></script> 
	<script type="text/javascript" src="hui/lib/layer/2.4/layer.js"></script>
	<script type="text/javascript" src="hui/static/h-ui/js/H-ui.min.js"></script>
	<script type="text/javascript" src="hui/static/h-ui.admin/js/H-ui.admin.js"></script> <!--/_footer 作为公共模版分离出去-->
	<script type="text/javascript">
		getUser();
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
		var author='';
		var user=getCookie("userId")+"";//当前登录用户
		var perPageNum=0;//已登录用户设置的显示日记篇数
		var perPage=10;//默认每页显示日记篇数
		$(function(){
			loadNotice();//index.js中
			if(user!=""){//需放到加载日记之前，以实现是否显示日记字数的设定
				getSetting(user);//加载登录用户的设置
			}
			if(perPageNum!="0"){
				perPage=perPageNum;
			}
			
			var diarys=${diarys!=null?diarys:[]}
			if(diarys.length>0){
				$("#diarys").text("");
				$.each(diarys, function(index, item){
					var title=item.NTitle+"";
					var con="";
					if(listStyle==0){
						con=handleCon(item.NContent);
						console.log(con);
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
					if(item.nTop==1){//站长置顶
						title=title+"<font color='red'>(置顶)</font>"
					}
					var userName=item.userName;
					if(user==item.NWritter){//当前登录人的日记特殊显示作者
						userName="<font color='red'>"+item.userName+"(朕)</font>";
					}
					//分类
					var cate=getCateById(item.NType);
					//是否有音频
					var music=0;//默认无音频
					if(item.nSongId!=null&&item.nSongId!=''){
						music=1;//有音频
					}
					var com="";
					if(item.NAllowComment==0){//允许评论的才显示评论图标
						com="&nbsp;<i class=\"Hui-iconfont\">&#xe622;</i><span id='commentNum'>"+item.commentNum+"</span>";
					}
					//未登录所有日记不显示不看他按钮,已登录自己的日记不显示不看他按钮
					var nsh="";
					if((item.NWritter+"")!=(user+"")&&user!=""){
						nsh="&nbsp;<i class=\"Hui-iconfont\" title='不看他' onclick='addToUnlike(\"1\",\""+item.NWritter+"\",\""+item.userName+"\")'>&#xe624;</i>";
						nsh=nsh+"&nbsp;<i class=\"Hui-iconfont\" title='不给ta看' onclick='addToUnlike(\"0\",\""+item.NWritter+"\",\""+item.userName+"\")'>&#xe691;</i>";
					}
					var top="";
					if(item.nUserTop==1){//用户置顶
						top=top+"<font color='#c88326'>(顶)</font>"
					}
					var loc=item.nlocation+"";
					if(loc.length>6){
						loc=loc.substring(0,6)+"..."
					}
					var wordSize="",ti="";
					if(show==1){
						wordSize="("+item.wordSize+"字)";
						if(item.audioInfo){//含有音频
							ti=ti+"title='该篇日记共计"+item.wordSize+"字(包含格式所占字符),\r含有音频歌曲："+item.audioInfo+"'";
						}else{
							ti="title='该篇日记共计"+item.wordSize+"字(包含格式所占字符)'";
						}
					}else{
						if(item.audioInfo){//含有音频
							ti=ti+"title='该篇日记含有音频歌曲："+item.audioInfo+"'";
						}
					}
					
					var tx="";
					var au="";
						tx="<img src='http://v.duola.vip/image/tx/"+item.headImage+".jpg' class='touxiang' onclick='openOther(1,\""+item.NWritter+"\")'>";
						var sex=item.authorSex;
						if(sex==0){//女性
//							au="<i class=\"Hui-iconfont\" style='color:red'>&#xe60d;</i><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
							au="<img src='http://v.duola.vip/image/female.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+item.NWritter+"\")'>"+userName+"</span>&emsp;";
						}else{
//							au="<i class=\"Hui-iconfont\">&#xe60d;</i><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
							au="<img src='http://v.duola.vip/image/male.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+item.NWritter+"\")'>"+userName+"</span>&emsp;";
						}
					var ifPraise=item.ifPraise;
					if(ifPraise==0){
						color="gray";
					}else{
						color="red";
					}
					$("#diarys").append("<div class=\"diary\">"+tx+"<a  onclick='openOther(0,"+item.NId+","+item.nauthority+")' "+ti+">"+con+"</a><br>"
							+"<div class='info'>"+au+"<i class=\"Hui-iconfont\">&#xe690;</i>"+item.ntime
							+"&emsp;<i class=\"Hui-iconfont\">&#xe681;</i>"+cate+"&nbsp;:<span title='"+item.ntitle+"'>"+title+"</span>&nbsp;<span>"+(music=='1'?'<font color=\'red\' title=\'有音频喔\'>'+wordSize+'音</font>':'<font color=\'red\'>'+wordSize+'</font>')+"</span>&emsp;<i class=\"Hui-iconfont\">&#xe6c9;</i><span title='"+item.nlocation+"'>"+loc
							+"</span><div class='zan'><i class=\"Hui-iconfont\">&#xe725;</i>"+item.visitNum+com
							
							+"&nbsp;<i class=\"Hui-iconfont\" style=\"color:"+color+"\"  onclick='praiseDiary("+item.nid+","+item.nwritter+","+index+")'  id=\"diary"+index+"\">&#xe66d;</i><span id=\"praiseNum"+index+"\" >"+item.praiseNum
							
							+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe630;</i><span>"+item.storeNum
							+"</span>"+nsh+top+"</div></div>"
							+"</div><hr width='100%'>");
				});
			}
			
			//switchTab(2);//使用此处替换了上方的调用loadDiary
			monitor();//手机访问时隐藏左边栏目
			loadAllUser();//首页加载推荐用户
		});
	</script>
  </body>
</html>
