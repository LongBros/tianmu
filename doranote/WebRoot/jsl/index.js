var user=getCookie("userId")+"";
var userNick=decodeURI(decodeURI(getCookie("userNick")+""));
var homeSongId="";
var show=1;//显示日记字数
var perPageNum=0;//显示日记篇数
var sexInt=0;
var call="他";
var listStyle=1;//01-29
var loopPlay=0;//01-30
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
			$("#diarys").append("<hr width='100%'>");
			for(var i=0;i<data.length;i++){
				//处理内容和标题
				var title=data[i].ntitle+"";
				var con="";
				if(listStyle==0){
					con=handleCon(data[i].ncontent);
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
					if(data[i].audioInfo){//含有音频
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
					tx="<img src='http://v.duola.vip/image/tx/"+data[i].headImage+".jpg' class='touxiang' onclick='openOther(1,\""+data[i].nwritter+"\")'>";
					var sex=data[i].authorSex;
					if(sex==0){//女性
//						au="<i class=\"Hui-iconfont\" style='color:red'>&#xe60d;</i><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
						au="<img src='http://v.duola.vip/image/female.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
					}else{
//						au="<i class=\"Hui-iconfont\">&#xe60d;</i><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
						au="<img src='http://v.duola.vip/image/male.png' style='width:16px;height:17px;'><span style='cursor:pointer' onclick='openOther(1,\""+data[i].nwritter+"\")'>"+userName+"</span>&emsp;";
					}
				}
				var ifPraise=data[i].ifPraise;
				if(ifPraise==0){
					color="gray";
				}else{
					color="red";
				}
				//onclick='openOther(0,"+data[i].nid+")'	href=\"diary.html?"+data[i].nid+"\"
				$("#diarys").append("<div class=\"diary\">"+tx+"<a  onclick='openOther(0,"+data[i].nid+","+data[i].nauthority+")' "+ti+">"+con+"</a><br>"
				+"<div class='info'>"+au+"<i class=\"Hui-iconfont\">&#xe690;</i>"+data[i].ntime
				+"&emsp;<i class=\"Hui-iconfont\">&#xe681;</i>"+cate+"&nbsp;:<span title='"+data[i].ntitle+"'>"+title+"</span>&nbsp;<span>"+(music=='1'?'<font color=\'red\' title=\'有音频喔\'>'+wordSize+'音</font>':'<font color=\'red\'>'+wordSize+'</font>')+"</span>&emsp;<i class=\"Hui-iconfont\">&#xe6c9;</i><span title='"+data[i].nlocation+"'>"+loc
				+"</span><div class='zan'><i class=\"Hui-iconfont\">&#xe725;</i>"+data[i].visitNum+com
				
				+"&nbsp;<i class=\"Hui-iconfont\" style=\"color:"+color+"\"  onclick='praiseDiary("+data[i].nid+","+data[i].nwritter+","+i+")'  id=\"diary"+i+"\">&#xe66d;</i><span id=\"praiseNum"+i+"\" >"+data[i].praiseNum
				
				+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe630;</i><span>"+data[i].storeNum
				+"</span>"+nsh+top+"</div></div>"
				+"</div><hr width='100%'>");//740px
			}
		}
	});
	curPage=parseInt(page);
	perPage=parseInt(perPage);
	setPage(from,author,perPage,userId);
}
/**
 *3.根据分类id得到分类名
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
 * 4.根据分类id得到分类名
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
/**
 * 5.
 * @param id
 * @returns {String}
 */
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
/**
 * 6.处理日记内容
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
function login_popup() {
    $("#loginModal").modal("show");
}
//5.设置添加cookie
function setCookie(name,value)  
{  
    var Days = 30;  
    var exp = new Date();  
    exp.setTime(exp.getTime() + Days*24*60*60*1000);  
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();  
    var strsec = getsec(time);  
    var exp = new Date();  
    exp.setTime(exp.getTime() + strsec*1);  
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();  
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
