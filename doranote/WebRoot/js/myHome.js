var data=new Array();
/**
 * 1.设置分页
 * @param which
 * @param perPage
 */
function setPage1(which,perPage,bookId){
	$(".pages").text('');
	var num=0;//数量
	var fun="";//函数名
	if(which==0){//个人日记数量
		$.ajax({
			url:"note/diary/getDiaryNumBy.do",
			type:"get",
			async:false,
			data:{
				NWritter:author,
				nWriteDevice:bookId,//2020-09-26 做bookId使用
				NLocation:"0,1,2"//做权限使用
			},
			dataType:"text",
			success:function(data){
				num=data;
			}
		});
		fun="loadMyDiary";
	}else if(which==1){//喜欢的日记的数量
		$.ajax({
			url:"note/praise/getPraiseNum.do",
			type:"get",
			async:false,
			data:{
				PPraiser:user,
				type:0//点赞类型为日记
			},
			dataType:"text",
			success:function(data){
				num=data;
			}
		});
		fun="loadMyLove";
	}else if(which==2){//喜欢的日记的数量
		$.ajax({
			url:"note/store/getStoreNum.do",
			type:"get",
			async:false,
			data:{
				SStorer:user
			},
			dataType:"text",
			success:function(data){
				num=data;
			}
		});
		fun="loadMyStore";
	}else if(which==3){//关注的人的数量
		$.ajax({
			url:"note/notice/getAttenNum.do",
			type:"get",
			async:false,
			data:{
				NNoticer:author
			},
			dataType:"text",
			success:function(data){
				num=data;
			}
		});
		fun="loadMyAtten";
	}else if(which==4){//粉丝的数量
		$.ajax({
			url:"note/notice/getAttenNum.do",
			type:"get",
			async:false,
			data:{
				NNoticed:author
			},
			dataType:"text",
			success:function(data){
				num=data;
			}
		});
		fun="loadMyFans";
	}
	
	var page=0;
	if(num%perPage==0){//可整除的话，页码数为总日记数除以10
		page=num/perPage;
	}else{//不可整除的话，页码数为总日记数除以10加1
		page=parseInt(num/perPage)+1;
	}
	var value=new Array("10","20","30","40");
	var sel="";
	if(which!=3&&which!=4){
		sel="<select onchange='setPer1("+which+",options[selectedIndex].value)'>";
		for(var i=0;i<value.length;i++){
			if(value[i]==perPage){
				sel=sel+"<option value='"+value[i]+"' selected>每页"+value[i]+"篇</option>";
			}else{
				sel=sel+"<option value='"+value[i]+"'>每页"+value[i]+"篇</option>";
			}
		}
		sel=sel+"</select>";
	}
	if(num>10){
		if(which!=3&&which!=4){
			$(".pages").append(sel+"&nbsp;共"+num+"篇日记&nbsp;"+curPage+"/"+page+"&emsp;");
		}else{
			$(".pages").append(num+"条数据&nbsp;"+curPage+"/"+page+"&emsp;");
		}
	}else{//只有10篇无需显示选择每页多少篇
		if(which!=3&&which!=4){
			$(".pages").append("&nbsp;共"+num+"篇日记&nbsp;");
		}else{
			$(".pages").append(num+"条数据"+"");
		}
	}
	if(curPage!=1){
		$(".pages").append("<span onclick=\""+fun+"('"+which+"','1','"+perPage+"')\">首</span>&emsp;")
		$(".pages").append("<span onclick=\""+fun+"('"+which+"','"+(curPage-1)+"','"+perPage+"')\">《</span>&emsp;");
	}
	if(page>5){//多于5页，只显示5页
		if(curPage>page-5){//当前页码大于总页码-5，输出后六页
			for(var i=page-4;i<=page;i++){
	              if(i==curPage){
	  				   $(".pages").append("<span onclick=\""+fun+"('"+which+"','"+i+"','"+perPage+"')\" style=\"color:white;background:black;\">"+i+"</span>&emsp;")
		          }else{
					   $(".pages").append("<span onclick=\""+fun+"('"+which+"','"+i+"','"+perPage+"')\">"+i+"</span>&emsp;")
	         	  }
	        }
		}else{//当前页码小于总页码-6，输出当前页码后的六页
            for(var i=curPage;i<curPage+5;i++){
                if(i==curPage){
	  				   $(".pages").append("<span onclick=\""+fun+"('"+which+"','"+i+"','"+perPage+"')\" style=\"color:white;background:black;\">"+i+"</span>&emsp;")
                }else{
					   $(".pages").append("<span onclick=\""+fun+"('"+which+"','"+i+"','"+perPage+"')\">"+i+"</span>&emsp;")
                }
            }
         }
		
	}else{//少于5页，显示所有页码
		if(page!=1){//只有一页无需显示页码
			for(var i=1;i<=page;i++){
				if(curPage==i){
					$(".pages").append("<span onclick=\""+fun+"('"+which+"','"+i+"','"+perPage+"')\" style=\"color:white;background:black;\">"+i+"</span>&emsp;")
				}else{
					$(".pages").append("<span onclick=\""+fun+"('"+which+"','"+i+"','"+perPage+"')\">"+i+"</span>&emsp;")
				}
			}
		}
	}
	if(curPage+1<=page){//＜＞
		$(".pages").append("<span onclick=\""+fun+"('"+which+"','"+(curPage+1)+"','"+perPage+"')\">》</span>&emsp;")
		$(".pages").append("<span onclick=\""+fun+"('"+which+"','"+page+"','"+perPage+"')\">尾</span>&emsp;")
	}
	
}
/**
 * 2.设置每页多少篇
 * @param pernum
 */
function setPer1(which,pernum){
	perPage=pernum;
	setPage1(which,perPage);
	if(which=="0"){//自己的
		loadMyDiary(which,curPage,perPage);
	}else if(which=="1"){//喜欢的
		loadMyLove(which,curPage,perPage);
	}
}
/**
 * 3.加载我的日记
 * @param which
 * @param page
 * @param perPage
 */
function loadMyDiary(which,page,perPage,bookId){
	$("#myDiary").text('');
	if(user==""){
		alert("请登录");
		return;
	}
//	document.getElementById("my").style.color="black";
//	document.getElementById("love").style.color="white";
//	document.getElementById("store").style.color="white";
//	document.getElementById("setting").style.color="white";
//	document.getElementById("attention").style.color="white";
//	document.getElementById("fans").style.color="white";
//	document.getElementById("comment").style.color="white";
	var au="0,1,2";//0完全公开,1自己可见,2登录可见
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
			bookId:bookId||''
		},
		success:function(data){
			if(data.length<1){
				if(bookId)
					$("#myDiary").append("<br><br><center>这是一个空空的日记本！</center><br><br>");
				else
					$("#myDiary").append("<br><br><center>你还没有写过日记呢，快去写一篇吧！</center><br><br>");
				return;
			}
			for(var i=0;i<data.length;i++){
				//处理内容和标题
				var title=data[i].ntitle+"";
				var con=handleCon(data[i].ncontent);
				if(con.length>250){
					con=con.substring(0,250)+"......";
				}
				if(title.length>10){
					//title=title.substring(0,8)+"...";
				}
				var lock="";
				var auth="";
				if(data[i].nauthority==1){//仅自己可见
					lock="<i class='Hui-iconfont' style='font-size: 15px;color:red' title='自己可见'>&#xe60e;</i>";
					auth="&nbsp;<span style='color:blue' onclick='setAuthority("+data[i].nid+",0)'>公开</span>";
				}else{
					auth="&nbsp;<span style='color:#c88326' onclick='setAuthority("+data[i].nid+",1)'>私密</span>";
				}
				var mood=getMoodById(data[i].nmood);
				var wea=getWeaById(data[i].nweather);
				//分类
				var cate=getCateById(data[i].ntype);
				var top=data[i].nUserTop;
				if(top>0){
					top="<span style='color:#c88326' onclick='diaryToTop("+data[i].nid+",\"0\")'>取消置顶</span>";
				}else{
					top="<span style='color:blue' onclick='diaryToTop("+data[i].nid+",\"1\")'>置顶</span>";
				}
				var bookId=data[i].nbookid;
				if(bookId){
					var bookName=data[i].bookName+"";
					if(bookName.length>3){
						bookName=(data[i].bookName+"").substring(0,3)+"..";
					}
					book="<span style='color:gray' title='所属专辑：《"+data[i].bookName+"》'>"+bookName+"</span>";
				}else
					book="<span style='color:#c88326' title='将这篇日记写进日记本里' onclick='addToBook("+data[i].nid+")'>加入</span>";
				$("#myDiary").append(
						"<div class=\"diary\">&nbsp;<span class='diaryTitle' title='"+data[i].ntitle
						+"' style='color:black;font-size:18px;' onclick='openOther(0,"+data[i].nid+")'>"+title+"</span><br><span onclick='openOther(0,"+data[i].nid+")' style='color:gray'>"+con+"</span><br>"
						+"<div class='info'>"
						+"</span>&emsp;<i class=\"Hui-iconfont\">&#xe690;</i>"+data[i].ntime+"&emsp;"+lock+"&emsp;心情："+mood+"&emsp;&emsp;天气："+wea
						+"&emsp;分类："+cate+"&emsp;"
						+"<div class='zan'><i class=\"Hui-iconfont\">&#xe725;</i>"+data[i].visitNum
						+"&nbsp;<i class=\"Hui-iconfont\">&#xe622;</i><span id='commentNum'>"+data[i].commentNum+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe66d;</i><span>"+data[i].praiseNum
						+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe630;</i><span>"+data[i].storeNum
						+"</span>&nbsp;<span style='color:#c88326' onclick='editDiary("+data[i].nid
						+")'>编辑</span>"+auth+"&nbsp;<span style='color:#c88326' onclick='delDiary("+data[i].nid
						+")'>删除</span>&nbsp;"+book+"&nbsp;"+top+"</div></div>"
						+"</div><hr width='100%'>");
			}

		}
	});
	curPage=parseInt(page);
	perPage=parseInt(perPage);
	setPage1(which,perPage,bookId);
}
/**
 * 4.加载我喜欢的
 * @param which：加载什么数据 0作者日记，1喜欢的日记
 * @param page:页码
 * @param perPage:每页数量
 */
function loadMyLove(which,page,perPage){
	$("#myDiary").text('');
	$(".pages").text('');
	if(user==""){
		alert("请登录");
		return;
	}
	$.ajax({
		url:"note/praise/getMyLikeDiary.do",
		type:"get",
		async:false,
		data:{
			userId:user,
			author:user,
			page:page,
			perPage:perPage
		},
		dataType:"Json",
		success:function(data){
			var res=data.result;
			if(res.length<1){
				$("#myDiary").append("<br><br><center>你还没有喜欢的日记喔！</center><br><br>");
				return;
			}
			for(var i=0;i<res.length;i++){
				var con=handleCon(res[i].content);
				var title=res[i].title+"";
				if(con.length>250){
					con=con.substring(0,250)+"......";
				}
				if(title.length>10){
					title=title.substring(0,8)+"...";
				}
				//分类
				var cate=getCateById(res[i].cate);
				$("#myDiary").append("<div class=\"diary\" title='"+res[i].likeTime+"喜欢'><img src='http://img.duola.vip/image/tx/"+res[i].headImg+".jpg' class='touxiang'><span onclick='openOther(0,"+res[i].id+")'>"+con+"</span><br>"
						+"<div class='info'><i class=\"Hui-iconfont\">&#xe60d;</i><span style='cursor:pointer' onclick='openOther(1,\""+res[i].writter+"\")'>"+res[i].u_User_Name
						+"</span>&emsp;<i class=\"Hui-iconfont\">&#xe690;</i>"+res[i].time
						+"&emsp;<i class=\"Hui-iconfont\">&#xe681;</i>"+cate+"&nbsp;:<span title='"+res[i].title+"'>《"+title+"》</span>&emsp;<i class=\"Hui-iconfont\">&#xe6c9;</i>"+res[i].loc
						+"<div class='zan'><i class=\"Hui-iconfont\">&#xe725;</i>"+res[i].visitNum+"&nbsp;<i class=\"Hui-iconfont\">&#xe622;</i><span id='commentNum'>"+res[i].commentNum+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe66d;</i><span>"+res[i].praiseNum
						+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe630;</i><span>"+res[i].storeNum+"</span></div></div>"
						+"</div><hr width='880px'>");
			}
//			$("#myDiary").append("<br><br><center>朕共喜欢<font color='red'>"+res.length+"</font>篇日记</center><br>");

		}
	});
	curPage=parseInt(page);
	perPage=parseInt(perPage);
	setPage1(which,perPage);
}
/**
 * 5.加载我收藏的
 * @param which：加载什么数据 0作者日记，1喜欢的日记
 * @param page:页码
 * @param perPage:每页数量
 */
function loadMyStore(which,page,perPage){
	$("#myDiary").text('');
	$(".pages").text('');
	if(user==""){
		alert("请登录");
		return;
	}
	$.ajax({
		url:"note/store/getMyStoreDiary.do",
		type:"get",
		async:false,
		data:{
			userId:user,
			author:user,
			page:page,
			perPage:perPage
		},
		dataType:"Json",
		success:function(data){
			var res=data.result;
			if(res.length<1){
				$("#myDiary").append("<br><br><center>你还没有收藏过日记喔！</center><br><br>");
				return;
			}
			for(var i=0;i<res.length;i++){
				var con=handleCon(res[i].content);
				var title=res[i].title+"";
				if(con.length>250){
					con=con.substring(0,250)+"......";
				}
				if(title.length>10){
					title=title.substring(0,8)+"...";
				}
				//分类
				var cate=getCateById(res[i].cate);
				$("#myDiary").append("<div class=\"diary\" title='"+res[i].storeTime+"收藏'><img src='http://img.duola.vip/image/tx/"+res[i].headImg+".jpg' class='touxiang'><span onclick='openOther(0,"+res[i].id+")'>"+con+"</span><br>"
						+"<div class='info'><i class=\"Hui-iconfont\">&#xe60d;</i><span style='cursor:pointer' onclick='openOther(1,\""+res[i].writter+"\")'>"+res[i].u_User_Name
						+"</span>&emsp;<i class=\"Hui-iconfont\">&#xe690;</i>"+res[i].time
						+"&emsp;<i class=\"Hui-iconfont\">&#xe681;</i>"+cate+"&nbsp;:<span title='"+res[i].title+"'>《"+title+"》</span>&emsp;<i class=\"Hui-iconfont\">&#xe6c9;</i>"+res[i].loc
						+"<div class='zan'><i class=\"Hui-iconfont\">&#xe725;</i>"+res[i].visitNum+"&nbsp;<i class=\"Hui-iconfont\">&#xe622;</i><span id='commentNum'>"+res[i].commentNum+"</span>&nbsp;<i class=\"Hui-iconfont\">&#xe66d;</i><span>"+res[i].praiseNum
						+"</span>&nbsp;&nbsp;<i class=\"Hui-iconfont\">&#xe630;</i><span>"+res[i].storeNum+"</span></div></div>"
						+"</div><hr width='880px'>");
			}
//			$("#myDiary").append("<br><br><center>朕共收藏了<font color='red'>"+res.length+"</font>篇日记</center><br>");

		}
	});
	curPage=parseInt(page);
	perPage=parseInt(perPage);
	setPage1(which,perPage);
}
/**
 * 6.加载我看过的
 */
function loadMyFeet(){
	if(user==""){
		alert("请登录");
		return;
	}
}
/**
 * 7.编辑日记
 * @param id
 */
function editDiary(id){
	if(isPhone()){
		window.open("newDiary.html?id="+id,"_blank");
	}else{
		//window.location="new.html?id="+id;
		window.open("new.html?id="+id,"_blank");
	}
}
/**
 * 8.删除日记
 * @param id
 */
function delDiary(id){
	var r=confirm("确认删除？");
	if(r==false){
		return;
	}
	$.ajax({
		url:"note/diary/addOrEditNote.do",
		type:"POST",
		async:false,
		dataType:"Json",
		data:{
			NId:id,
			nAuthority:3
		},
		success:function(res){
			alert("日记已删除");
			loadMyDiary(0,curPage,perPage);
		}
	});
}
/**
 * 9.日记置顶
 */
function diaryToTop(id,which){
	//alert("不好意思喔，开发中…敬请期待。^_^");
	$.ajax({
		url:"note/diary/addOrEditNote.do",
		type:"post",
		async:false,
		dataType:"Json",
		data:{
			NId:id,
			nUserTop:which
		},
		success:function(res){
			if(res.code==200){
				if(which==1){
					alert("置顶成功");
				}else if(which==0){
					alert("已取消置顶");
				}
			}
		}
	});
	loadMyDiary(0,1,10);
}
/**
 * 10.
 * 12-01打开设置tab
 */
function openSetting(){
	$("#myDiary").text('');
	$(".pages").text('');
	//法一：设置选项分tab~写于2020-02-04
	loadUserInfo();//查询用户信息并赋值data
	$("#settingAll").css('min-height',"450px");
	$(".settingTab").css("background","#5fb878");
	$(".settingTab").css("width","120px");
	$(".settingTab").css("height","400px");
	$(".settingTab").css("float","left");
	$(".settingTab").html('<br><br><span onclick="switchTab(0)" id="basicS" style="color:red">基本信息</span><br><br>');
	$(".settingTab").append('<span onclick="switchTab(1)" id="showS">显示设置</span><br><br>');
	$(".settingTab").append('<span onclick="switchTab(2)" id="writeS">写日记设置</span><br><br>');
	$(".settingTab").append('<span onclick="switchTab(3)" id="audioS">音频设置</span><br><br>');
	$(".settingTab").append('<span onclick="switchTab(4)" id="backgroundS">PC端背景</span><br><br>');
	$(".settingTab").append('<span onclick="switchTab(5)" id="backgroundM">移动端背景</span><br><br>');
	switchTab(0);
	
	//法二：设置选项不分tab
	/*loadInfo();//加载出作者信息以供编辑
	$("#myDiary").append("<span>背景选择：</span>");
	//$("#myDiary").append("<a onclick='setBack()'>设置当前背景为默认朕的背景</a>"); 
	loadAllBack();*/
}
/**
 * 11.加载所有的背景图
 * 12-01 
 */
function loadAllBack(which){
	var array=new Array();
	var PC=new Array("back0.jpg","back1.jpg","back2.jpg","back3.jpg","back4.jpg","back5.jpg","back6.jpg","back7.jpg"
			,"back0.png","back1.png","back2.png","back3.png","back4.png","back5.png","back6.png","back7.png",
			"back8.png","back9.png","back10.png","back11.png","back12.png","back13.png","back14.png","back15.png"
			,"back0.gif","back1.gif","back2.gif","back3.gif","back4.gif","back5.gif","back6.gif");
	var MB=new Array("back1.jpg","back2.jpg","back3.jpg","back4.jpg","back7.jpg"
			,"back3.png","back4.png","back5.png","back6.png","back7.png","back8.png","back9.png","back10.png","back11.png"
			,"back2.gif","back4.gif","back5.gif","back6.gif");
	if(which==0){
		array=PC;
	}else{
		array=MB;
	}
	//	$("#myDiary").append("<div style='height:100px;'>");
	for(var i=0;i<array.length;i++){
		if(i%6==0&&i!=0){
			$(".settingInfo").append("<br>");
		}
		$(".settingInfo").append("<img src='http://img.duola.vip/image/back/"+array[i]+"' title='点击即可设置当前\r背景为朕的背景^_^' class='backDemo' onclick='setBackground(\""+array[i]+"\","+which+")'>");
//	$("#myDiary").append("</div>");
	}
}

/**
 * 12. 设置背景
 * @param which 背景的名称
 * @param pom 移动端还是pc端
 */
function setBackground(which,pom){
	var body=document.getElementById("bodys");
	body.style.background="url(http://img.duola.vip/image/back/"+which+")";
	if(pom==0){//PC端
		saveInfo(4,which);//保存背景设置至数据库
	}else{
		saveInfo(13,which);//保存背景设置至数据库
	}
	
}
/**
 * 13.加载作者信息并赋值到设置项
 * 2020-02-04废除此种方法，改用第20、21
 */
function loadInfo(){
	//加载出作者信息以供编辑
	$.ajax({
		url:"note/userinfo/getAuthorInfoByUserId.do?UUserId="+author,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(res){
			var data=res.result;
			var sex=data.uuserSex+"";//性别：1男，2女
			var showNum=data.uShowWordnum+"";//是否显示日记字数
			var perpageNum=data.perpageNum+"";//每页展示日记数量
			var homesongName=data.homeSongName+"";
			var homesong=data.uhomeSong+"";
			//不看
			var blackNameIds=data.blackNameList+"";//用户id
			var blackIds=blackNameIds.split(",");
			var blackNames=data.blackNames+"";//用户名
			var blacks=blackNames.split(",");
			//不给看
			var bIds=data.blackList+"";//用户id
			var bIdss=bIds.split(",");
			var bNames=data.blacks+"";//用户名
			var bNamess=bNames.split(",");
			
			var bornTime=data.ubornTime+"";//2020-01-27新增
			var year="",month="",day="";
			if(bornTime.length>5){//有出生日期
				year=bornTime.substring(0,4);
				month=bornTime.substring(5,7);
				day=bornTime.substring(8,10);
			}
			var listStyle=data.listStyle;
			var loopPlay=data.loopPlay;
			
			var string="<form name='info'><span>昵称：</span><input name='nickName' value='"+data.uuserName+"'><i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(1)' title='点击保存'>&#xe676;</i><br>";
			string=string+"<span>个性签名：</span><input name='signature' value='"+data.signature+"'><i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(2)' title='点击保存'>&#xe676;</i><br>";
			string=string+"<span>默认日记地址：</span><input name='location' value='"+data.location+"'><i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(3)' title='点击保存'>&#xe676;</i><br>";
			if(day!=""){//有出生日期的不可再设置
				string=string+"<span>出生日期：</span><span>"+bornTime+"</span>&nbsp;<span style='color:gray'>(出生日期设置后不可更改)</span><br>";
			}else{
				string=string+"<span>出生日期：</span><input name='year' value='"+year+"' style='width:45px;'>-<input name='month' value='"+month+"' style='width:35px;'>-<input name='day' value='"+day+"' style='width:35px;'>&nbsp;<i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(10)' title='点击保存'>&#xe676;</i>&nbsp;<span style='color:gray'>(请于三个框中分别输入年、月、日并点击保存，谨慎输入！设置后不可更改)</span><br>";
			}
			
			if(sex=="1"){
				string=string+"<span>性别:<input type='radio' onchange='saveInfo(7,1)' name='sex' checked='true'>男</input>";
				string=string+"<input type='radio' onchange='saveInfo(7,0)' name='sex'>女</input></span><br>";
			}else if(sex=="0"){
				string=string+"<span>性别:<input type='radio' onchange='saveInfo(7,1)' name='sex'>男</input>";
				string=string+"<input type='radio' onchange='saveInfo(7,0)' name='sex' checked='true'>女</input></span><br>";
			}else{
				string=string+"<span>性别:<input type='radio' onchange='saveInfo(7,1)' name='sex'>男</input>";
				string=string+"<input type='radio' onchange='saveInfo(7,0)' name='sex'>女</input></span><br>";
			}
			
			if(listStyle=="1"){
				string=string+"<span>列表显示格式:<input type='radio' onchange='saveInfo(11,1)' checked='true' name='listStyle'>仅标题</input>";
				string=string+"<input type='radio' onchange='saveInfo(11,0)' name='listStyle'>标题和内容</input></span><br>";
			}else{
				string=string+"<span>列表显示格式:<input type='radio' onchange='saveInfo(11,1)' name='listStyle'>仅标题</input>";
				string=string+"<input type='radio' onchange='saveInfo(11,0)' checked='true' name='listStyle'>标题和内容</input></span><br>";
			}
			
			if(showNum=="1"){
				string=string+"<span>首页显示日记字数:<input type='radio' onchange='saveInfo(6,1)' name='wordsize' value='' checked='true'>显示</input>";
				string=string+"<input type='radio' onchange='saveInfo(6,0)' name='wordsize' value=''>隐藏</input></span>";
			}else if(showNum=="0"){
				string=string+"<span>首页显示日记字数:<input type='radio' onchange='saveInfo(6,1)' name='wordsize' value=''>显示</input>";
				string=string+"<input type='radio' onchange='saveInfo(6,0)' name='wordsize' value='' checked='true'>隐藏</input></span>";
			}else{
				string=string+"<span>首页显示日记字数:<input type='radio' onchange='saveInfo(6,1)' name='wordsize' value=''>显示</input>";
				string=string+"<input type='radio' onchange='saveInfo(6,0)' name='wordsize' value=''>隐藏</input></span>";
			}
			
//			每页加载日记篇数设置
			var per=new Array("0","10","20","30","40","50");
			string=string+"<br><span>每页加载日记篇数：<select onchange='saveInfo(8,options[selectedIndex].value)'>";
			for(var i in per){
				if(per[i]==perpageNum){
					string=string+"<option value='"+per[i]+"' selected>&emsp;"+per[i]+"&emsp;</option>";
				}else{
					string=string+"<option value='"+per[i]+"'>&emsp;"+per[i]+"&emsp;</option>";
				}
			}
			string=string+"</select>&emsp;(0表示显示下拉列表,可切换每页篇数)</span>&nbsp;<span style='color:gray'>(每页加载篇数越多耗时越长，请谨慎选择)</span>";
			
			string=string+"<br><span>不看名单(你看不到列表中的用户在首页的日记，点击可移出):";
//			for(var i=0;i<blackIds.length;i++){
//				string=string+"<a onclick='removeFromList(\""+blackIds[i]+"\",\""+blacks[i]+"\")' style='color:red'>"+blacks[i]+"</a>&emsp;&emsp;";
//			}
			//另一种for循环
			for(var key in blackIds){
				string=string+"<a onclick='removeFromList(\"1\",\""+blackIds[key]+"\",\""+blacks[key]+"\")' style='color:red'>"+blacks[key]+"</a>&emsp;&emsp;";
			}
			string=string+"</span><br>";
			
			string=string+"<span>不给看名单(列表中的用户在首页看不到你的日记，点击可移出):";
			for(var key in bIdss){
				string=string+"<a onclick='removeFromList(\"0\",\""+bIdss[key]+"\",\""+bNamess[key]+"\")' style='color:red'>"+bNamess[key]+"</a>&emsp;&emsp;";
			}
			string=string+"</span><br>";
			
			string=string+"<span>家歌选择(其他用户访问你的家园时会播放家歌)：";
			string=string+"<input name='homesongName' id='songName' readonly value='"+homesongName+"'>";
			string=string+"<input name='homesong' style='display: none' id='sourceId' readonly value='"+homesong+"'>";
			string=string+"<a onclick='openMusic()' title='点击搜索歌曲'><font color='red'>切换</font></a>&emsp;";
			string=string+"<a id='clearBtn' style='display:none' onClick='clearSong()'>清空所选歌曲</a>&emsp;";
			string=string+"<i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(9)' title='点击保存'>&#xe676;</i>";
			string=string+"</span><br>";
			string=string+"<span>音频自动播放(日记音频及用户家歌)：</span>";
			var play=data.autoPlay;
			var tips=new Array("弹出提示是否播放","自动播放","不自动播放");
			for(var i=0;i<tips.length;i++){
				if(i==play){
					string=string+"<input type='radio' name='autoplay' onchange='saveInfo(5,"+i+")' value='"+i+"' checked='true'>"+tips[i]+"</input>&emsp;";
				}else{
					string=string+"<input type='radio' name='autoplay' onchange='saveInfo(5,"+i+")' value='"+i+"'>"+tips[i]+"</input>&emsp;";
				}
			}
			string=string+"<br><span>音频循环播放(日记音频及用户家歌)：";
			if(loopPlay=="1"){
				string=string+"<input type='radio' onchange='saveInfo(12,1)' checked='true' name='loopPlay'>循环</input>";
				string=string+"<input type='radio' onchange='saveInfo(12,0)' name='loopPlay'>不循环</input></span>";
			}else{
				string=string+"<input type='radio' onchange='saveInfo(12,1)' name='loopPlay'>循环</input>";
				string=string+"<input type='radio' onchange='saveInfo(12,0)' checked='true' name='loopPlay'>不循环</input></span>";
			}
			
			string=string+"<br></form>";
			$("#myDiary").append(string);
		}
	});
}
/* $("input[name=autoplay]").click(function(){
    var value = $(this).val();
    saveInfo(5,value);
}); */
/**
 * 14.保存信息
 * 1-昵称，2-个性签名，3-默认地址，4-背景图(结合value参数)
 */
function saveInfo1(which,value){
	var t=which+"";
	var url="note/userinfo/updateUserInfo.do?UUserId="+author;
	if(t=="1"){//昵称
		url=url+"&UUserName="+document.info.nickName.value;
	}else if(t=="2"){//个性签名
		url=url+"&signature="+document.info.signature.value;
	}else if(t=="3"){//默认地址
		url=url+"&location="+document.info.location.value;
	}else if(t=="4"){//背景图
		url=url+"&back="+value;
	}else if(t=="5"){//是否自动播放
		url=url+"&autoPlay="+value;
	}else if(t=="6"){//日记列表是否显示日记字数~0：隐藏，1：显示
		url=url+"&uShowWordnum="+value;
	}else if(t=="7"){//用户性别~0：女，1：男
		url=url+"&UUserSex="+value;
	}else if(t=="8"){//每页加载日记篇数
		url=url+"&perpageNum="+value;
	}else if(t=="9"){//家歌
		url=url+"&UHomeSong="+document.info.homesong.value;
	}else if(t=="10"){//出生日期
		var year=document.info.year.value+"";
		var month=document.info.month.value+"";
		var day=document.info.day.value+"";
		if(isNaN(year)||isNaN(month)||isNaN(day)){
			alert("输入错误");
			return;
		}
		if(year.length!=4){
			alert("年输入错误");
			return;
		}
		if(month.length>2||month.length==0||day.length>2||day.length==0){
			alert("月或日输入错误");
			return;
		}
		var c=confirm("确认保存你的生日嘛？保存后不可修改呢。");
		if(c==false){
			return;
		}
		var birth=document.info.year.value+"-"+document.info.month.value+"-"+document.info.day.value;
		url=url+"&UBornTime="+birth;
	}else if(t=="11"){
		url=url+"&listStyle="+value;
	}else if(t=="12"){//
		url=url+"&loopPlay="+value;
	}else if(t=="13"){//2020-03-15 移动端背景
		url=url+"&mback="+value;
	}else if(t=="14"){//2020-09-20
		url=url+"&showWhichTab="+value;
	}else if(t=="15"){//2020-09-20 
		url=url+"&secretInteract="+value;
	}else if(t=="16"){//2020-09-20 
		url=url+"&secretWall="+value;
	}else{
		alert("开发中，暂不支持此项编辑^_^")
	}
	$.ajax({
		url:url,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(res){
			if(res.code==200){
				alert(res.message);
			}else{
				alert("修改失败");
			}
		}
	});
	openSetting();
}
function saveInfo(which,value){
	var t=which+"";
	var data;
	var url="note/userinfo/updateUserInfo.do";
	if(t=="1"){//昵称
		data={"UUserId":author,"UUserName":document.info.nickName.value};
	}else if(t=="2"){//个性签名
		data={"UUserId":author,"signature":document.info.signature.value};
	}else if(t=="3"){//默认地址
		data={"UUserId":author,"location":document.info.location.value};
	}else if(t=="4"){//背景图
		data={"UUserId":author,back:value};
	}else if(t=="5"){//是否自动播放
		data={"UUserId":author,autoPlay:value};
	}else if(t=="6"){//日记列表是否显示日记字数~0：隐藏，1：显示
		data={"UUserId":author,uShowWordnum:value};
	}else if(t=="7"){//用户性别~0：女，1：男
		data={"UUserId":author,UUserSex:value};
	}else if(t=="8"){//每页加载日记篇数
		data={"UUserId":author,perpageNum:value};
	}else if(t=="9"){//家歌
		data={"UUserId":author,UHomeSong:document.info.homesong.value};
	}else if(t=="10"){//出生日期
		var year=document.info.year.value+"";
		var month=document.info.month.value+"";
		var day=document.info.day.value+"";
		if(isNaN(year)||isNaN(month)||isNaN(day)){
			alert("输入错误");
			return;
		}
		if(year.length!=4){
			alert("年输入错误");
			return;
		}
		if(month.length>2||month.length==0||day.length>2||day.length==0){
			alert("月或日输入错误");
			return;
		}
		var c=confirm("确认保存你的生日嘛？保存后不可修改呢。");
		if(c==false){
			return;
		}
		var birth=document.info.year.value+"-"+document.info.month.value+"-"+document.info.day.value;
		data={"UUserId":author,UBornTime:birth};
	}else if(t=="11"){
		data={"UUserId":author,listStyle:value};
	}else if(t=="12"){//
		data={"UUserId":author,loopPlay:value};
	}else if(t=="13"){//2020-03-15 移动端背景
		data={"UUserId":author,mback:value};
	}else if(t=="14"){//2020-09-20
		data={"UUserId":author,showWhichTab:value};
	}else if(t=="15"){//2020-09-20 
		data={"UUserId":author,secretInteract:value};
	}else if(t=="16"){//2020-09-20 
		data={"UUserId":author,secretWall:value};
	}else if(t=="17"){//2020-09-22 
		data={"UUserId":author,secretAccount:value};
	}else if(t=="18"){//2020-09-25
		data={"UUserId":author,defaultWea:value};
	}else if(t=="19"){//2020-09-25 
		data={"UUserId":author,defaultMood:value};
	}else if(t=="20"){//2020-09-25 
		data={"UUserId":author,defaultCate:value};
	}else if(t=="21"){//2020-09-25 
		data={"UUserId":author,defaultAuth:value};
	}else if(t=="22"){//2020-09-25 
		data={"UUserId":author,showExpression:value};
	}else{
		alert("开发中，暂不支持此项编辑^_^")
	}
	$.ajax({
		url:url,
		type:"post",
		async:false,
		dataType:"Json",
		data:data,
		success:function(res){
			if(res.code==200){
				alert(res.message);
			}else{
				alert("修改失败");
			}
		}
	});
	openSetting();
}
/**
 * 15.加载我关注的人
 * @param which
 * @param page
 * @param perPage
 */
function loadMyAtten(which,page,perPage){
	$("#myDiary").text('');
	$(".pages").text('');
	if(user==""){
		alert("请登录");
		return;
	}
	$.ajax({
		url:"note/notice/getMyAtten.do",
		type:"get",
		async:false,
		data:{
			userId:user,
			author:user,
			page:page,
			perPage:perPage
		},
		dataType:"Json",
		success:function(res){
			if(res.code==200){
				var data=res.result;
				if(data.length<1){
					$("#myDiary").append("<center>你还没有关注别人呢，快去关注你喜欢的人吧！</center>");
				}else{
//					$("#myDiary").append("<center>你共关注了<font color='red' size='2px'>"+data.length+"</font>个小伙伴</center>");
				}
				for(var i=0;i<data.length;i++){
					$("#myDiary").append("<div class='notice'><img src='http://img.duola.vip/image/tx/"+data[i].headImg+".jpg'><a href='author.html?author="+data[i].noticedId+"' target='_blank'>"+data[i].noticedName+"</a>&emsp;<font color='gray' size='1px'>"+data[i].fanNums+"粉丝</font>&emsp;<font  color='gray' size='1px'>"+data[i].joinDay+"天共"+data[i].diaryNum+"篇日记</font><font color='gray' size='2px'><span>"+data[i].noticeTime+"</span></font></div><hr>");
					
				}
			}else{
				alert("查询失败");
			}
		}
	});
	curPage=parseInt(page);
	perPage=parseInt(perPage);
	setPage1(which,perPage);
}
/**
 * 16.检测访问设备，手机返回true，其他返回false
 * 平台、设备和操作系统
 * @returns {Boolean}
 */
function isPhone(){
	//平台、设备和操作系统
	var system ={win : false,mac : false,xll : false};
	//检测平台
	var p = navigator.platform;
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	//跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
	if(!system.win && !system.mac && !system.xll){//手机访问
	    return true;
	}
	return false;
}
/**
 * 17.将userId移出不看他列表
 * @param which 1:不看列表，0：不被看列表
 * @param userId
 * @param userName
 */
function removeFromList(which,userId,userName)
{
	var w="不看";
	if(which==0){
		w="不给看";
	}
	var r=window.confirm("确定从"+w+"列表移出‘"+userName+"’？");
	if(r==false){
		return;
	}
	//user:当前登录用户,userId:待移除用户
	$.ajax({
		url:"note/userinfo/addToOrRemoveFromList.do?type=1&user="+user+"&userId="+userId+"&which="+which,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(res){
			if(res.code==200){
				alert(res.message);
			    openSetting();
			}
		}
	});
}
/**
 * 18.加载当前登录人的评论
 */
function loadMyCom(){
	$("#myDiary").text('');
	$(".pages").text('');
	if(user==""){
		alert("请登录");
		return;
	}
	$.ajax({
		url:"note/comment/getMyComment.do?userId="+user,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(data){
			var res=data.result;
			if(res.length>0){
				$("#myDiary").append("<div class='notice'><center>共有<font color='red'>"+res.length+"</font>条评论消息</center></div>");
			}
			if(res.length<1){
				$("#myDiary").append("<div class='notice'><center>你还没有评论过别人的日记喔，快去评论别人的日记吧！</center></div>");
			}
			for(var i=0;i<res.length;i++){
				var con=res[i].reviewCon+"";
				if(con.length>15){
					con=con.substring(0,15)+"...";
				}
				$("#myDiary").append("<div class='notice'>你评论了<a href='author.html?author="+res[i].reviewed+"' target='_blank'>"+res[i].viewedName+"</a>&emsp;的日记&emsp;<a href='diary.html?id="+res[i].diaryId+"' target='_blank'>"+res[i].diaryTitle+"</a>&emsp;<font style='color:gray;font-size:5px;'>"+con+"</font><font color='gray' size='2px'><span>"+res[i].reviewTime+"</span></font></div><hr>");
			}
		}
	});
}
/**
 * 19.加载当前登录人的粉丝
 * @param which
 * @param page
 * @param perPage
 */
function loadMyFans(which,page,perPage){
	$("#myDiary").text('');
	$(".pages").text('');
	if(user==""){
		alert("请登录");
		return;
	}
	$.ajax({
		url:"note/notice/getMyMessage.do",
		type:"get",
		async:false,
		data:{
			userId:user,
			author:user,
			page:page,
			perPage:perPage
		},
		dataType:"Json",
		success:function(res){
			if(res.code==200){
				var data=res.result;
				if(data.length<1){
					$("#myDiary").append("<center>还没有人关注你呢，快去找喜欢你的人关注你吧！</center>");
				}else{
//					$("#myDiary").append("<center>共<font color='red' size='2px'>"+data.length+"</font>个小伙伴关注了你</center>");
				}
				for(var i=0;i<data.length;i++){
					$("#myDiary").append("<div class='notice'><img src='http://img.duola.vip/image/tx/"+data[i].headImg+".jpg'><a href='author.html?author="+data[i].noticerId+"' target='_blank'>"+data[i].noticerName+"</a>&emsp;<font color='gray' size='1px'>"+data[i].fanNums+"粉丝</font>&emsp;<font  color='gray' size='1px'>"+data[i].joinDay+"天共"+data[i].diaryNum+"篇日记</font><font color='gray' size='2px'><span>"+data[i].noticeTime+"</span></font></div><hr>");
					
				}
			}else{
				alert("查询失败");
			}
		}
	});
	curPage=parseInt(page);
	perPage=parseInt(perPage);
	setPage1(which,perPage);
}
/**
 * 20.tab切换
 * @param which
 */
function openTab(which){
	$(".settingInfo").text('');
	$(".settingTab").text('');
	$("#settingAll").css('min-height',"0");
	$(".settingTab").css('height',"0");
	//01-27 用以下代码避免在各个方法中写代码来控制tab颜色
	var tabs=new Array("my","love","store","comment","attention","fans","setting","wall");
	for(var i=0;i<8;i++){
		if(i==which){
//			$("#"+tabs[i]).css("background","black");
			$("#"+tabs[i]).css("color","black");
		}else{
//			$("#"+tabs[i]).css("background","white");
			$("#"+tabs[i]).css("color","white");
		}
	}
	if(which==0){
		loadMyDiary('0','1','10');
//		getMyBooks();
	}else if(which==1){
		loadMyLove('1','1','10')
	}else if(which==2){
		loadMyStore('2','1','10')
	}else if(which==3){
		loadMyCom()
	}else if(which==4){
		loadMyAtten('3','1','10')
	}else if(which==5){
		loadMyFans('4','1','10')
	}else if(which==6){
		openSetting()
	}else if(which==7){
		loadConfide();
	}else if(which==8){
		getMyBooks();
	}
}
/**
 * 21.设置tab中子tab的切换
 */
function switchTab(which){
	var tabs=new Array("basicS","showS","writeS","audioS","backgroundS","backgroundM");
	for(var i=0;i<6;i++){
		if(i==which){
			$("#"+tabs[i]).css("color","black");
		}else{
			$("#"+tabs[i]).css("color","white");
		}
	}
	$(".settingInfo").text('');
//	alert("3"+data);
	var sex=data.uuserSex+"";//性别：1男，2女
	var showNum=data.uShowWordnum+"";//是否显示日记字数
	var perpageNum=data.perpageNum+"";//每页展示日记数量
	var showWhichTab=data.showWhichTab+"";
	var secretInteract=data.secretInteract+"";
	var secretWall=data.secretWall+"";
	var secretAccount=data.secretAccount+"";
	var defaultMood=data.defaultMood+"";
	var defaultWea=data.defaultWea+"";
	var defaultCate=data.defaultCate+"";
	var defaultAuth=data.defaultAuth+"";
	var showExpression=data.showExpression+"";
	var homesongName=data.homeSongName+"";
	var homesong=data.uhomeSong+"";
	//不看
	var blackNameIds=data.blackNameList+"";//用户id
	var blackIds=blackNameIds.split(",");
	var blackNames=data.blackNames+"";//用户名
	var blacks=blackNames.split(",");
	//不给看
	var bIds=data.blackList+"";//用户id
	var bIdss=bIds.split(",");
	var bNames=data.blacks+"";//用户名
	var bNamess=bNames.split(",");
	
	var bornTime=data.ubornTime+"";//2020-01-27新增
	var year="",month="",day="";
	if(bornTime.length>5){//有出生日期
		year=bornTime.substring(0,4);
		month=bornTime.substring(5,7);
		day=bornTime.substring(8,10);
	}
	var listStyle=data.listStyle;
	var loopPlay=data.loopPlay;
//	alert(loopPlay);
	var string="<form class='layui-form'  name='info'>";
	switch(which){
		case 0://基本信息
			string=string+"<span>昵称：</span><input name='nickName' value='"+data.uuserName+"'><i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(1)' title='点击保存'>&#xe676;</i><br>";
			string=string+"<span>个性签名：</span><input name='signature' value='"+data.signature+"'><i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(2)' title='点击保存'>&#xe676;</i><br>";
			if(day!=""){//有出生日期的不可再设置
				string=string+"<span>出生日期：</span><span>"+bornTime+"</span>&nbsp;<span style='color:gray'>(出生日期设置后不可更改)</span><br>";
			}else{
				string=string+"<span>出生日期：</span><input name='year' value='"+year+"' style='width:45px;'>-<input name='month' value='"+month+"' style='width:35px;'>-<input name='day' value='"+day+"' style='width:35px;'>&nbsp;<i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(10)' title='点击保存'>&#xe676;</i>&nbsp;<span style='color:gray'>(请分别输入年月日并点击保存！设置后不可更改，系统会在当天为你送上祝福)</span><br>";
			}
			
			if(sex=="1"){
				string=string+"<span>性别:<input type='radio' onchange='saveInfo(7,1)' name='sex' checked='true'>男</input>";
				string=string+"<input type='radio' onchange='saveInfo(7,0)' name='sex'>女</input></span><br>";
			}else if(sex=="0"){
				string=string+"<span>性别:<input type='radio' onchange='saveInfo(7,1)' name='sex'>男</input>";
				string=string+"<input type='radio' onchange='saveInfo(7,0)' name='sex' checked='true'>女</input></span><br>";
			}else{
				string=string+"<span>性别:<input type='radio' onchange='saveInfo(7,1)' name='sex'>男</input>";
				string=string+"<input type='radio' onchange='saveInfo(7,0)' name='sex'>女</input></span><br>";
			}
			break;
		case 1://显示设置
			if(listStyle=="1"){
				string=string+"<span>列表显示格式:<input type='radio' onchange='saveInfo(11,1)' checked='true' name='listStyle'>仅标题</input>";
				string=string+"<input type='radio' onchange='saveInfo(11,0)' name='listStyle'>标题和内容</input></span><br>";
			}else{
				string=string+"<span>列表显示格式:<input type='radio' onchange='saveInfo(11,1)' name='listStyle'>仅标题</input>";
				string=string+"<input type='radio' onchange='saveInfo(11,0)' checked='true' name='listStyle'>标题和内容</input></span><br>";
			}
			//首页默认加载tab
			var tabIndex=new Array("0","1","2","3","4","5");
			var tabName=new Array("推荐","关注","时间轴","昨天","聆听","都行");
			string=string+"<span>首页默认加载tab：<select onchange='saveInfo(14,options[selectedIndex].value)'>";
			for(var i in tabIndex){
				if(tabIndex[i]==showWhichTab){
					string=string+"<option value='"+tabIndex[i]+"' selected>&emsp;"+tabName[i]+"&emsp;</option>";
				}else{
					string=string+"<option value='"+tabIndex[i]+"'>&emsp;"+tabName[i]+"&emsp;</option>";
				}
			}
			string=string+"</select>&emsp;(选择“都行”每次将随机为你加载某个tab)</span><br>";

			if(showNum=="1"){
				string=string+"<span>首页显示日记字数:<input type='radio' onchange='saveInfo(6,1)' name='wordsize' value='' checked='true'>显示</input>";
				string=string+"<input type='radio' onchange='saveInfo(6,0)' name='wordsize' value=''>隐藏</input></span>";
			}else if(showNum=="0"){
				string=string+"<span>首页显示日记字数:<input type='radio' onchange='saveInfo(6,1)' name='wordsize' value=''>显示</input>";
				string=string+"<input type='radio' onchange='saveInfo(6,0)' name='wordsize' value='' checked='true'>隐藏</input></span>";
			}else{
				string=string+"<span>首页显示日记字数:<input type='radio' onchange='saveInfo(6,1)' name='wordsize' value=''>显示</input>";
				string=string+"<input type='radio' onchange='saveInfo(6,0)' name='wordsize' value=''>隐藏</input></span>";
			}
			
//			每页加载日记篇数设置
			var per=new Array("0","10","20","30","40","50");
			string=string+"<br><span>每页加载日记篇数：<select onchange='saveInfo(8,options[selectedIndex].value)'>";
			for(var i in per){
				if(per[i]==perpageNum){
					string=string+"<option value='"+per[i]+"' selected>&emsp;"+per[i]+"&emsp;</option>";
				}else{
					string=string+"<option value='"+per[i]+"'>&emsp;"+per[i]+"&emsp;</option>";
				}
			}
			string=string+"</select>&emsp;(0表示显示下拉列表,可切换每页篇数)</span>&nbsp;<span style='color:gray'>(每页加载篇数越多耗时越长，请谨慎选择)</span>";
			
			string=string+"<br><span>不看名单(你看不到列表中的用户在首页的日记，点击可移出):";
//			for(var i=0;i<blackIds.length;i++){
//				string=string+"<a onclick='removeFromList(\""+blackIds[i]+"\",\""+blacks[i]+"\")' style='color:red'>"+blacks[i]+"</a>&emsp;&emsp;";
//			}
			//另一种for循环
			for(var key in blackIds){
				string=string+"<a onclick='removeFromList(\"1\",\""+blackIds[key]+"\",\""+blacks[key]+"\")' style='color:red'>"+blacks[key]+"</a>&emsp;&emsp;";
			}
			string=string+"</span><br>";
			
			string=string+"<span>不给看名单(列表中的用户在首页看不到你的日记，点击可移出):";
			for(var key in bIdss){
				string=string+"<a onclick='removeFromList(\"0\",\""+bIdss[key]+"\",\""+bNamess[key]+"\")' style='color:red'>"+bNamess[key]+"</a>&emsp;&emsp;";
			}
			string=string+"</span><br>";
			
			if(secretInteract=="1"){
				string=string+"<span>我的喜欢/收藏/关注/粉丝:<input type='radio' onchange='saveInfo(15,1)' name='' value='' checked='true'>私密</input>";
				string=string+"<input type='radio' onchange='saveInfo(15,0)' name='' value=''>公开</input></span>";
			}else if(secretInteract=="0"){
				string=string+"<span>我的喜欢/收藏/关注/粉丝:<input type='radio' onchange='saveInfo(15,1)' name='' value=''>私密</input>";
				string=string+"<input type='radio' onchange='saveInfo(15,0)' name='' value='' checked='true'>公开</input></span>";
			}else{
				string=string+"<span>我的喜欢/收藏/关注/粉丝:<input type='radio' onchange='saveInfo(15,1)' name='' value=''>私密</input>";
				string=string+"<input type='radio' onchange='saveInfo(15,0)' name='' value=''>公开</input></span>";
			}
			string+="<br>";
			if(secretWall=="1"){
				string=string+"<span>我的墙:<input type='radio' onchange='saveInfo(16,1)' name='' value='' checked='true'>私密</input>";
				string=string+"<input type='radio' onchange='saveInfo(16,0)' name='' value=''>公开</input></span>";
			}else if(secretWall=="0"){
				string=string+"<span>我的墙:<input type='radio' onchange='saveInfo(16,1)' name='' value=''>私密</input>";
				string=string+"<input type='radio' onchange='saveInfo(16,0)' name='' value='' checked='true'>公开</input></span>";
			}else{
				string=string+"<span>我的墙:<input type='radio' onchange='saveInfo(16,1)' name='' value=''>私密</input>";
				string=string+"<input type='radio' onchange='saveInfo(16,0)' name='' value=''>公开</input></span>";
			}
			
			string+="<br>";
			if(secretAccount=="1"){
				string=string+"<span>私密账号:<input type='radio' onchange='saveInfo(17,1)' name='' value='' checked='true'>私密</input>";
				string=string+"<input type='radio' onchange='saveInfo(17,0)' name='' value=''>公开</input></span>";
			}else if(secretAccount=="0"){
				string=string+"<span>私密账号:<input type='radio' onchange='saveInfo(17,1)' name='' value=''>私密</input>";
				string=string+"<input type='radio' onchange='saveInfo(17,0)' name='' value='' checked='true'>公开</input></span>";
			}else{
				string=string+"<span>私密账号:<input type='radio' onchange='saveInfo(17,1)' name='' value=''>私密</input>";
				string=string+"<input type='radio' onchange='saveInfo(17,0)' name='' value=''>公开</input></span>";
			}
			
			string+="<div class='layui-form-item'><label class='layui-form-label'>开关</label> <div class='layui-input-block'><input type='checkbox' name='switch' lay-skin='switch'></div></div>"
			
			break;
		case 2://写日记设置
			string=string+"<span>默认地址：</span><input name='location' value='"+data.location+"'><i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(3)' title='点击保存'>&#xe676;</i><br>";
			string=string+"<span>默认天气：</span>"
			var titles=['晴','雾','霾','阴','雨','雪'];var weaCode=['&#xe6b1;','&#xe6ae;','&#xe6ad;','&#xe6b1;','&#xe6b2;','&#xe6b0;'];
			for(var i=0;i<6;i++){
				if(defaultWea==i){
					string+="<i class=\"Hui-iconfont\" style=\"font-size:18px;color:pink\" title="+titles[i]+" onclick=\"saveInfo(18,"+i+")\">"+weaCode[i]+"</i>";
				}else{
					string+="<i class=\"Hui-iconfont\" style=\"font-size:18px;\" title="+titles[i]+" onclick=\"saveInfo(18,"+i+")\">"+weaCode[i]+"</i>";
				}
			}
			var titlesMood=['开心','微笑','哭脸','愤怒'];var moodCode=['&#xe668;','&#xe656;','&#xe688;','&#xe65d;'];
			string=string+"<br><span>默认心情：</span>"
			for(var i=0;i<4;i++){
				if(defaultMood==i){
					string+="<i class=\"Hui-iconfont\" style=\"font-size:18px;color:pink\" title="+titlesMood[i]+" onclick=\"saveInfo(19,"+i+")\">"+moodCode[i]+"</i>";
				}else
					string+="<i class=\"Hui-iconfont\" style=\"font-size:18px;\" title="+titlesMood[i]+" onclick=\"saveInfo(19,"+i+")\">"+moodCode[i]+"</i>";
			}
			string=string+"<br><span>编辑器：</span><i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(15)' title='点击保存'>&#xe676;</i><br>";
			if(showExpression=="0"){
				string=string+"<span>默认显示表情:<input type='radio' onchange='saveInfo(22,1)'>是</input>";
				string=string+"<input type='radio' onchange='saveInfo(22,0)' checked='true'>否</input></span><br>";
			}else if(showExpression=="1"){
				string=string+"<span>默认显示表情:<input type='radio' onchange='saveInfo(22,1)' checked='true'>是</input>";
				string=string+"<input type='radio' onchange='saveInfo(22,0)'>否</input></span><br>";
			}else{
				string=string+"<span>默认显示表情:<input type='radio' onchange='saveInfo(22,1)'>是</input>";
				string=string+"<input type='radio' onchange='saveInfo(22,0)'>否</input></span>";
			}
			
			var cates=new Array("生活日记","工作笔记","idea","诗词（文学）","深度好文");
			string=string+"<span>默认分类：</span><select onchange='saveInfo(20,options[selectedIndex].value)'>";
			for(var i in cates){
				if(i==defaultCate){
					string=string+"<option value='"+i+"' selected>&emsp;"+cates[i]+"&emsp;</option>";
				}else{
					string=string+"<option value='"+i+"'>&emsp;"+cates[i]+"&emsp;</option>";
				}
			}
			string=string+"</select><br>";

			var aus=new Array("完全公开","自己可见","登录可见");
			string=string+"<span>默认权限：</span><select onchange='saveInfo(21,options[selectedIndex].value)'>";
			for(var i in aus){
				if(i==defaultAuth){
					string=string+"<option value='"+i+"' selected>&emsp;"+aus[i]+"&emsp;</option>";
				}else{
					string=string+"<option value='"+i+"'>&emsp;"+aus[i]+"&emsp;</option>";
				}
			}
			string=string+"</select>";
			break;
		case 3://音频设置
			string=string+"<span>家歌选择(其他用户访问你的家园时会播放家歌)：";
			string=string+"<input name='homesongName' id='songName' readonly value='"+homesongName+"'>";
			string=string+"<input name='homesong' style='display: none' id='sourceId' readonly value='"+homesong+"'>";
			string=string+"<a onclick='openMusic()' title='点击搜索歌曲'><font color='red'>切换</font></a>&emsp;";
			string=string+"<a id='clearBtn' style='display:none' onClick='clearSong()'>清空所选歌曲</a>&emsp;";
			string=string+"<i class=\"Hui-iconfont\" style='cursor:pointer' onclick='saveInfo(9)' title='点击保存'>&#xe676;</i>";
			string=string+"</span><br>";
			string=string+"<span>音频自动播放(日记音频及用户家歌)：</span>";
			var play=data.autoPlay;
			var tips=new Array("弹出提示是否播放","自动播放","不自动播放");
			for(var i=0;i<tips.length;i++){
				if(i==play){
					string=string+"<input type='radio' name='autoplay' onchange='saveInfo(5,"+i+")' value='"+i+"' checked='true'>"+tips[i]+"</input>&emsp;";
				}else{
					string=string+"<input type='radio' name='autoplay' onchange='saveInfo(5,"+i+")' value='"+i+"'>"+tips[i]+"</input>&emsp;";
				}
			}
			string=string+"<br><span>音频循环播放(日记音频及用户家歌)：";
			if(loopPlay=="1"){
				string=string+"<input type='radio' onchange='saveInfo(12,1)' checked='true' name='loopPlay'>循环</input>";
				string=string+"<input type='radio' onchange='saveInfo(12,0)' name='loopPlay'>不循环</input></span>";
			}else{
				string=string+"<input type='radio' onchange='saveInfo(12,1)' name='loopPlay'>循环</input>";
				string=string+"<input type='radio' onchange='saveInfo(12,0)' checked='true' name='loopPlay'>不循环</input></span>";
			}
			break;
		case 4://PC端背景
			loadAllBack(0);//PC端
			break;
		case 5://移动端背景
			loadAllBack(1);//移动端
			break;
		default:
			break;
	}
	string=string+"<br></form>";
	$(".settingInfo").append(string);
}
/**
 * 22.查询用户信息，配合函数21做另一种设置tab使用
 */
function loadUserInfo()
{
	//加载出作者信息以供编辑
	$.ajax({
		url:"note/userinfo/getAuthorInfoByUserId.do?UUserId="+author,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(res){
			data=res.result;
//			alert("1"+data);
		}
	});
}

/**
 * 23.查询我的日记本
 * 2020-06-12
 */
function getMyBooks(){
	$("#myDiary").text('');
	$(".pages").text('');
	if(user==""){
		alert("请登录");
		return;
	}
	document.getElementById("my").style.color="black";
	document.getElementById("love").style.color="white";
	document.getElementById("store").style.color="white";
	document.getElementById("setting").style.color="white";
	document.getElementById("attention").style.color="white";
	document.getElementById("fans").style.color="white";
	document.getElementById("comment").style.color="white";
	//加载出作者的日记本
	$.ajax({
		url:"note/books/getBooksByAuthor.do?author="+author,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(res){
			if(res.code==200){
				var res=res.result;
				for(var i=0;i<res.length;i++){
					var cover="";
					if(res[i].bcover)
						cover=res[i].bcover;
					else
						cover="cover2";
					var scale="I";
					switch(res[i].scale){
						case 30:
							scale="II";
							break;
						case 50:
							scale="III";
							break;
						case 80:
							scale="IV";
							break;
						case 100:
							scale="V";
							break;
						case 1000000:
							scale="∞";
							break;
					}
					$("#myDiary").append("<div class='notebook' onclick='loadMyDiary(\"0\",\"1\",\"10\",\""+res[i].bbookid+"\")' title='"+res[i].btime+"创建'>" +
							"<img src='http://img.duola.vip/image/books_cover/"
							+cover+".jpg'>"
							+"<div class='bookinfo'>"
							+"&nbsp;<span>标题："+res[i].bdescription+"</span></div></div>"
							);//<span>规模："+scale+"</span><span>"+res[i].diaryNum+"篇日记</span>
				}
				
			}
		}
	});
	
}
/**
 * 24.设置日记的权限
 * @param diaryId 日记id
 * @param type 0：设为公开，1：设为私密
 */
function setAuthority(diaryId,type){
	$.ajax({
		url:"note/diary/addOrEditNote.do",
		type:"post",
		async:false,
		dataType:"Json",
		data:{
			NId:diaryId,
			nAuthority:type
		},
		success:function(res){
			alert(res.message)
		}
	});
	loadMyDiary(0,1,10);
}
/**
 * 25.加载倾诉墙
 */
function loadConfide(){
	$('#myDiary').text("");
	$('.pages').text("");
	$.ajax({
		url:"note/confide/getConfides.do",
		type:"get",
		data:{
			author:author,
			page:1,
			perPage:100
		},
		async:false,
		dataType:"Json",
		success:function(res){
			var data=res.result;
			if(data.length<1){
				$('#myDiary').append("<center></center>");
			}else{
				$('#myDiary').append("&emsp;共<font color='red'>"+data.length+"</font>条倾诉");
			}
			var l=data.length;
			for(var k=0;k<data.length;k++){
//				var confided=data[k].confided;//倾诉id
				var confider=data[k].confider;//倾诉者
				var con=data[k].confideCon;
				con=con.replace(new RegExp("::::","gm"), ".jpg'>");
				con=con.replace(new RegExp(":::","gm"), ".png'>");
				con=con.replace(new RegExp("::","gm"), ".gif'>");
				con=con.replace(new RegExp("<<<","gm"), "<img alt='' src='http://img.duola.vip/image/expre/newtieba/");
				con=con.replace(new RegExp("<<","gm"), "<img alt='' src='http://img.duola.vip/image/expre/tieba/");
				con=con.replace(new RegExp("&&&&","gm"), "<img alt='' src='http://img.duola.vip/image/expre/weibo/");
				con=con.replace(new RegExp("&&&","gm"), "<img alt='' src='http://img.duola.vip/image/expre/huang/");
				con=con.replace(new RegExp("&&","gm"),"<img alt='' src='http://img.duola.vip/image/expre/aodamiao/");
				
				$('#myDiary').append("<hr>");
				var href="某本站访客";
				var img="dlam";
				if(confider){
					href="<a href='author.html?author="+confider+"' target='_blank'>"+data[k].confiderName+"</a>&emsp;&emsp;<span style='color:gray;font-size:1px'>"+l+"L</span>";
				}
				if(data[k].headImg){
					img=data[k].headImg;
				}
				var confideTime=handleTime(data[k].confideTime);
				$('#myDiary').append("<img src='http://img.duola.vip/image/tx/"+img+".jpg'>");
				$('#myDiary').append(href+"&nbsp;&nbsp;<span style='color:gray;font-size:10px;float:right;margin-right:20px'>"+confideTime+"</span>");
				$('#myDiary').append("<br><div class='content1'>"+con+"</div>");
				
				l--;
			}
			
		}
	});
}
//26.加载出所有日记本，以供选择将日记加入
function addToBook(diaryId){
	$("#books").css("display","inline-block");
	$('#booksList').text('');
	//加载出作者的日记本
	$.ajax({
		url:"note/books/getBooksByAuthor.do?author="+author,
		type:"get",
		async:false,
		dataType:"Json",
		success:function(res){
			if(res.code==200){
				var res=res.result;
				if(res.length<1){
					$("#books").css("display","none");
					alert("你还没有日记本，暂不支持新建日记本，如有需要请联系站长为你添加日记本!");
					return;
				}
				for(var i=0;i<res.length;i++){
					$('#booksList').append("<br>&emsp;<span style='color:white;font-size:10px'>"+res[i].bdescription
							+"</span>&emsp;<a onclick='alterDiary("+diaryId+","+res[i].bbookid+")'>选择</a>");//+"&emsp;"+res[i].diaryNum

				}
				
			}
		}
	});
}
//27.关闭日记本选择窗口
function closeSearchBook(){
	$("#books").css("display","none");
}
//28.修改日记所属日记本
function alterDiary(diaryId,bookId){
	$.ajax({
		url:"note/diary/addOrEditNote.do",
		type:"POST",
		async:false,
		dataType:"Json",
		data:{
			NId:diaryId,
			NBookid:bookId
		},
		success:function(res){
			alert("添加成功");
		}
	});
	$("#books").css("display","none");
	loadMyDiary(0,1,10)
}
/***
 * 1.设置分页2.设置每页多少篇3.加载我的日记4.加载我喜欢的5.加载我收藏的6.加载我看过的7.编辑日记8.删除日记9.日记置顶
 * 10.打开设置tab 11.加载所有的背景图12. 设置背景13.加载作者信息并赋值到设置项14.保存信息15.加载我关注的人
 * 16.检测访问设备，手机返回true，其他返回false17.将userId移出不看他列表18.加载当前登录人的评论19.加载当前登录人的粉丝
 * 20.tab切换21.设置tab中子tab的切换22.查询用户信息，配合函数20做另一种设置tab使用 21.设置tab中子tab的切换
 * 22.查询用户信息，配合函数21做另一种设置tab使用 23.查询我的日记本 24.设置日记的权限 25.加载倾诉墙
 ***/
