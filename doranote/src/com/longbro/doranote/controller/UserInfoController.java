package com.longbro.doranote.controller;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.Gson;
import com.longbro.doranote.BaseResult;
import com.longbro.doranote.bean.Attention;
import com.longbro.doranote.bean.Author;
import com.longbro.doranote.bean.UserInfo;
import com.longbro.doranote.service.AttentionService;
import com.longbro.doranote.service.CommentDiaryService;
import com.longbro.doranote.service.PraiseDiaryService;
import com.longbro.doranote.service.StoreDiaryService;
import com.longbro.doranote.service.UserInfoService;
import com.longbro.doranote.util.FileProduce;
import com.longbro.doranote.util.Strings;
import com.longbro.doranote.util.TimeUtil;

/**
 * d_user_info控制器
 * @author longbro
 * @date 2019-10-26 13:07:00
 * @copyright 多啦学娱网络科技有限公司
 */
@Controller
@RequestMapping("note/userinfo/")
public class UserInfoController{
    @Autowired
    UserInfoService userInfoService;
    @Autowired
    CommentDiaryService commentDiaryService;
    @Autowired
    PraiseDiaryService praiseDiaryService;
    @Autowired
    StoreDiaryService storeDiaryService;
    @Autowired
    AttentionService attentionService;
    private Logger logger=Logger.getLogger(UserInfoController.class);
    /**
     * @desc 1.根据userId获取用户信息
     * @author zcl
     * @date 2019年10月26日
     * @param UUserId
     * @return
     */
    @RequestMapping("getAuthorInfoByUserId")
    @ResponseBody
    public BaseResult<String> getAuthorInfoByUserId(int UUserId){
    	BaseResult<String> result=new BaseResult<String>();
    	if(UUserId<10000){
    		result.setCode(100);
    		result.setMessage("哆啦id不正确!!!");
    		return result;
    	}
    	Author au=userInfoService.get(UUserId);
    	if(au!=null){
    		result.setCode(200);
        	result.setMessage("根据哆啦id查询用户成功");
        	result.setResult(au);
    	}else{
    		result.setCode(100);
    		result.setMessage("未匹配到输入的哆啦id");
    	}
    	return result;
    }
    /**
     * 2.注册用户
     * 先判断数据库是否已有该userId，再插入不同的userId
     * @desc 
     * @author zcl
     * @date 2019年10月1日
     * @return
     */
    @RequestMapping(value="genNoteUserId",method=RequestMethod.GET)
    @ResponseBody
    public String genUserId(String source){
    	String userId=Strings.allotNum(8)+"";//随机生成userId
    	UserInfo ui=userInfoService.get(Integer.parseInt(userId));
    	if(ui!=null){//该用户id已存在，需重新生成
    		genUserId(source);
    	}
//    	ui=new UserInfo();
//    	ui.setUUserId(Integer.parseInt(userId));
//    	ui.setUJoinTime(TimeUtil.time());
//    	au.setSource(source);
//    	userInfoService.create(ui);
    	return userId;
    }
    /**
     * @desc 3.登录哆啦日记网的校验
     * @author zcl
     * @date 2019年10月27日
     * @param acc
     * @param pass
     * @return
     * @throws UnsupportedEncodingException 
     */
    @RequestMapping(value="loginNote",method=RequestMethod.POST)
    @ResponseBody
    public BaseResult<String> loginNote(String acc,String pass,HttpServletResponse response) throws UnsupportedEncodingException{
    	BaseResult<String> result=new BaseResult<String>();
    	UserInfo ui=userInfoService.loginNote(acc, pass);
    	if(ui!=null){//1.设置最近登录时间2.存cookie
        	System.out.println("查询到的登录数据"+new Gson().toJson(ui));
        	//设置最近登录时间，直接使用ui会报数据库中编码乱码错误？
//        	UserInfo ui1=new UserInfo();
    		ui.setLastLogin(TimeUtil.time());
    		ui.setUStatus(1);//2020-01-01设置为在线状态
//    		ui1.setUId(ui.getUId());
//    		ui1.setUUserId(ui.getUUserId());;
    		userInfoService.updateUserInfo(ui);
    		//存cookie
    		Cookie cookie=new Cookie("userId", acc);
    		cookie.setMaxAge(30*24*60*60);
    		cookie.setPath("/");
    		response.addCookie(cookie);
    		
    		String uName=ui.getUUserName();
    		uName=URLEncoder.encode(uName, "utf-8");
    		Cookie cookie1=new Cookie("userNick", uName);
    		cookie1.setMaxAge(30*24*60*60);
    		cookie1.setPath("/");
    		response.addCookie(cookie1);
    		
    		String uLocation=ui.getLocation();
    		if(StringUtils.isEmpty(uLocation)){
    			uLocation="诗和远方";
    		}
    		uLocation=URLEncoder.encode(uLocation, "utf-8");
    		Cookie cookie2=new Cookie("userAddr", uLocation);
    		cookie2.setMaxAge(30*24*60*60);
    		cookie2.setPath("/");
    		response.addCookie(cookie2);
    		System.out.println(cookie.getValue());
   		 	logger.debug("==========>"+cookie.getValue());
    		result.setCode(200);
    		result.setMessage("登录成功");
    		result.setResult(1);
    		return result;
    	}
    	result.setCode(110);
    	result.setMessage("请检查你输入的账号");
    	result.setResult(null);
    	return result;
    }
    /**
     * @desc 4.查询某用户或所有用户的未读数量
     * @author zcl
     * @date 2019年11月16日
     * @param userId
     */
    @RequestMapping("queryUnReadNum")
    @ResponseBody
    public BaseResult<String> queryUnReadNum(String userId){
    	BaseResult<String> result=new BaseResult<String>();
//    	List<HashMap<String, Object>> map=new ArrayList<HashMap<String, Object>>();
    	result.setCode(200);
    	result.setResult(userInfoService.queryUnReadNum(userId));
    	result.setMessage("查询成功");
    	return result;
    }
    /**
     * @desc 5.设置所有未读消息为已读
     * @author zcl
     * @date 2019年11月16日
     * @param userId
     * @return
     */
    @RequestMapping("setAsReaded")
    @ResponseBody
    public BaseResult<String> setAsReaded(String userId){
    	BaseResult<String> result=new BaseResult<String>();
    	commentDiaryService.setAsReaded(userId);
    	praiseDiaryService.setAsReaded(userId);
    	storeDiaryService.setAsReaded(userId);
    	attentionService.setAsReaded(userId);
    	result.setCode(200);
    	result.setMessage("已设置所有未读消息为已读");
    	result.setResult(null);
    	return result;
    }
    /**
     * @desc 6.加载某用户或所有用户的互动信息：
     * 赞、评论、收藏、关注,被赞、被评论、被收藏、被关注
     * @author zcl
     * @date 2019年11月16日
     * @param userId
     * @return
     */
    @RequestMapping("queryInteractNum")
    @ResponseBody
	public BaseResult<List<HashMap<String, Object>>> queryInteractNum(String userId){
		BaseResult<List<HashMap<String, Object>>> result=new BaseResult<List<HashMap<String, Object>>>();
		result.setCode(200);
    	result.setMessage("已加载完毕");
    	result.setResult(userInfoService.queryInteractNum(userId));
    	
    	return result;
	}
    /**
     * @desc 7.修改用户的昵称、签名、位置等信息
     * @author zcl
     * @date 2019年12月1日
     * @param info
     * @return
     * @throws UnsupportedEncodingException 
     */
    @RequestMapping("updateUserInfo")
    @ResponseBody
    public BaseResult<List<HashMap<String, Object>>> updateUserInfo(HttpServletResponse response,UserInfo info) throws UnsupportedEncodingException{
		BaseResult<List<HashMap<String, Object>>> result=new BaseResult<List<HashMap<String, Object>>>();
		if(StringUtils.isNotEmpty(info.getLocation())){//12-15修改地址后同时修改cookie
			Cookie cookie=new Cookie("userAddr",URLEncoder.encode(info.getLocation(), "utf-8"));
			cookie.setMaxAge(30*24*60*60);
			cookie.setPath("/");
			response.addCookie(cookie);
		}
		if(StringUtils.isNotEmpty(info.getUUserName())){
			Cookie cookie=new Cookie("userNick", URLEncoder.encode(info.getUUserName()));
			cookie.setMaxAge(30*24*60*60);
			cookie.setPath("/");
			response.addCookie(cookie);
		}
		logger.debug(new Gson().toJson(info));
		userInfoService.updateUserInfo(info);
		result.setCode(200);
    	result.setMessage("信息保存成功");
    	result.setResult("");
    	
    	return result;
	}
    /**
     * @desc 8.上传头像
     * @author zcl
     * @date 2019年12月2日
     * @param request
     * @throws Exception
     */
    @RequestMapping(value={"uploadHeadImage"}, method={RequestMethod.POST})
    @ResponseBody
    public BaseResult uploadHeadImage(HttpServletRequest request, HttpServletResponse response, @RequestParam(value="pic", required=false) MultipartFile attach)
      throws Exception
    {
      BaseResult result = new BaseResult();
      response.setCharacterEncoding("utf-8");
      String userId = "";
      userId = request.getParameter("userId");
      this.logger.debug("==========>" + new Gson().toJson(request.getParameterMap()));
      if (attach.isEmpty())
      {
        result.setCode(100);
        result.setMessage("你还未选择头像图片");
        response.getWriter().write("你还未选择头像图片");
        return result;
      }
//      String path = request.getSession().getServletContext()
//        .getRealPath("image" + File.separator + "tx" + File.separator);
      String path = Strings.imgPath+"image/tx/";
      this.logger.debug("==========>" + path);
      long fname = System.currentTimeMillis();
      String prefix = FilenameUtils.getExtension(attach.getOriginalFilename());
      int fileSize = 2097152;
      if (attach.getSize() > fileSize)
      {
        result.setCode(100);
        result.setMessage("请选择两兆以内的图片作为头像");
        
        request.setAttribute("uploadFileError", "请选择两兆以内的图片作为头像");
        
        return result;
      }
      this.logger.debug("==========>执行到了这里,原图片名为" + attach.getOriginalFilename());
      if ((prefix.equalsIgnoreCase("jpg")) || (prefix.equalsIgnoreCase("png")) || 
        (prefix.equalsIgnoreCase("jpeg")) || (prefix.equalsIgnoreCase("gif")))
      {
        File file = new File(path, userId + "_" + fname + ".jpg");
        
        this.logger.debug("==========>开始上传");
        attach.transferTo(file);
        UserInfo user = new UserInfo();
        user.setHeadImage(userId + "_" + fname);
        user.setUUserId(Integer.valueOf(Integer.parseInt(userId)));
        updateUserInfo(response, user);
      }
      else
      {
        request.setAttribute("uploadFileError", "上传图片格式不正确");
      }
      result.setCode(200);
      result.setMessage("头像图片上传成功");
      result.setResult(userId + "_" + fname);
      return result;
    }
    /**
     * @desc 9.查询用户数、日记数量的统计信息
     * @author zcl
     * @date 2019年12月6日
     * @return
     */
    @RequestMapping("getStatisticInfo")
    @ResponseBody
    public BaseResult<HashMap<String, String>> getStatisticInfo(){
		BaseResult<HashMap<String, String>> result=new BaseResult<HashMap<String, String>>();
		result.setResult(userInfoService.getStatisticInfo());
		result.setCode(200);
		result.setMessage("查询统计信息成功");
		return result;
		
    }
    /**
     * 10.添加某人至不(被)看名单，或从不(被)看名单移出某人
     * @author LongBro
     * 2019年12月10日
     * 下午7:19:58
     * @param type	type=0添加至黑名单，1移出黑名单
     * @param user
     * @param userId
     * @param which	1:不看列表，0：不被看列表
     * @return
     */
    @RequestMapping("addToOrRemoveFromList")
    @ResponseBody
    public BaseResult<HashMap<String, String>> addToOrRemoveFromList(int type,int user,String userId,int which){
    	//user:当前登录用户,userId:待移除用户
    	BaseResult<HashMap<String, String>> result=new BaseResult<HashMap<String, String>>();
    	if(StringUtils.isEmpty(user+"")||StringUtils.isEmpty(userId)){
    		result.setCode(110);
    		result.setMessage("缺少必传参数");
    		return result;
    	}
    	UserInfo userinfo=userInfoService.get(user);
    	if(which==0){
    		String blackIds=userinfo.getBlackList();//获取用户的不给看名单
    		
    		if(type==0){//添加至不给看名单
        		if(!StringUtils.isEmpty(blackIds)){//黑名单中有人
        			if(blackIds.contains(userId)){
        				result.setMessage("此用户已在你的不给看名单中");
            		}else{
            			blackIds=blackIds+","+userId;
                    	result.setMessage("已添加至不给看名单");
            		}
        		}else{
                	blackIds=blackIds+","+userId;
                	result.setMessage("已添加至不给看名单");
        		}
        	}else if(type==1){//移出不给看名单
        		if(!StringUtils.isEmpty(blackIds)){//不给看名单中没有人
            		if(blackIds.contains(userId+",")){//该id不在最后一个
                    	blackIds=blackIds.replace(userId+",","");
                	}else{
                		blackIds=blackIds.replace(","+userId,"");
                	}
            		result.setMessage("已移出不给看名单");
            	}else{
            		result.setMessage("该用户不在你的不给看名单中");
            	}

        	}
        	userinfo.setBlackList(blackIds);
    		
    	}else{
    		String blackIds=userinfo.getBlackNameList();//获取用户黑名单
        	if(type==0){//添加至黑名单
        		if(!StringUtils.isEmpty(blackIds)){//黑名单中有人
        			if(blackIds.contains(userId)){
        				result.setMessage("此作者已在你的不看名单中");
            		}else{
            			blackIds=blackIds+","+userId;
                    	result.setMessage("已添加至不看名单");
            		}
        		}else{
                	blackIds=blackIds+","+userId;
                	result.setMessage("已添加至不看名单");
        		}
        	}else if(type==1){//移出黑名单
        		if(!StringUtils.isEmpty(blackIds)){//黑名单中没有人
            		if(blackIds.contains(userId+",")){//该id不在最后一个
                    	blackIds=blackIds.replace(userId+",","");
                	}else{
                		blackIds=blackIds.replace(","+userId,"");
                	}
            		result.setMessage("已移出不看名单");
            	}else{
            		result.setMessage("该用户不在你的不看名单中");
            	}

        	}
        	userinfo.setBlackNameList(blackIds);
    	}
    	userInfoService.updateUserInfo(userinfo);
    	result.setCode(200);
		return result;
    }
    /**
     * @desc 11.注册
     * @author zcl
     * @throws UnsupportedEncodingException 
     * @date 2019年12月14日
     */
    @RequestMapping("register")
    @ResponseBody
    public BaseResult<String> register(HttpServletRequest request,HttpServletResponse response) throws UnsupportedEncodingException{
    	BaseResult<String> result=new BaseResult<String>();
    	String doraId=request.getParameter("doraId");//哆啦id
    	String userName=request.getParameter("userName");//用户名
    	String password=request.getParameter("password");//密码
    	String inviter=request.getParameter("inviter");//密码
    	if(StringUtils.isEmpty(doraId)){//为空则随机生成
    		doraId=genUserId("");
    	}else{//校验用户输入哆啦id是否已存在
        	UserInfo ui=userInfoService.get(Integer.parseInt(doraId));
        	if(ui!=null){//该用户id已存在，需重新生成
        		result.setCode(100);
        		result.setMessage("你输入的哆啦id已存在，请重新输入或不填由系统为你随机生成");
        		return result;
        	}
    	}
    	UserInfo ui=new UserInfo();
    	ui.setUUserId(Integer.parseInt(doraId));
    	ui.setUUserName(userName);
    	ui.setPassword(password);
    	ui.setInviter(inviter.equals("")?null:Integer.parseInt(inviter));
    	ui.setLocation("");
    	ui.setSignature("");
    	//随机生成家歌和背景
    	int hs=new Random().nextInt(Strings.id.length);
    	int hi=new Random().nextInt(Strings.backs.length);
    	int him=new Random().nextInt(Strings.mbacks.length);
    	ui.setHeadImage("dlam1");
    	ui.setUHomeSong(Strings.id[hs]);
    	ui.setAutoPlay(0);
    	ui.setBack(Strings.backs[hi]);
    	ui.setMback(Strings.mbacks[him]);//2020-03-15
    	//						古诗网      FatLuo   Yigongzi JinYong  MoYan		LuXun	 一只小兔几
    	ui.setBlackNameList("66666666,12345678,15577347,96664270,54343391,88007770,65313340");
    	ui.setUUserSex(0);
    	ui.setUJoinTime(TimeUtil.time());
    	ui.setLastLogin(TimeUtil.time());
    	userInfoService.create(ui);
    	//注册账号默认关注官方账号，官方账号和我的账号默认关注注册的账号
    	Attention att=new Attention();
    	att.setNNoticed("1314521");
    	att.setNNoticer(doraId);
    	att.setNNoticeTime(TimeUtil.time());
    	att.setNReadStatus(0);
    	attentionService.create(att);
    	attentionService.create(new Attention("1314521",doraId,TimeUtil.time(),0));
    	attentionService.create(new Attention("5211314",doraId,TimeUtil.time(),0));
    	
    	//存cookie
		Cookie cookie=new Cookie("userId", doraId);
		cookie.setMaxAge(30*24*60*60);
		cookie.setPath("/");
		response.addCookie(cookie);
		
		userName=URLEncoder.encode(userName, "utf-8");
		Cookie cookie1=new Cookie("userNick", userName);
		cookie1.setMaxAge(30*24*60*60);
		cookie1.setPath("/");
		response.addCookie(cookie1);
		
		Cookie cookie2=new Cookie("userAddr", URLEncoder.encode("诗和远方", "utf-8"));
		cookie2.setMaxAge(30*24*60*60);
		cookie2.setPath("/");
		response.addCookie(cookie2);
    	
    	result.setCode(200);
    	result.setMessage("注册成功，系统已为你自动登录,请牢记你的账户，哆啦id为"+doraId);
    	result.setResult(doraId);
    	return result;
    }
	/**
	 * 12.列出用户的历史头像
	 * @date 2020-04-17
	 * @param userId
	 * @param page 页码，每页6张，page为0时加载所有图片
	 * @return
	 */
	@RequestMapping({"listAllHeadImg"})
	  @ResponseBody
	  public BaseResult<ArrayList<String>> listAllPic(String userId, int page)
	  {
		logger.info(">>>>userId="+userId+",page="+page+",directory->"+Strings.imgPath+"image/tx/");
	    BaseResult<ArrayList<String>> result = new BaseResult();
	    if (StringUtils.isEmpty(page+"")) {
	      page = 1;
	    }
	    ArrayList<String> files = FileProduce.getAllFiles(userId, Strings.imgPath+"image/tx/");
	    if(files.size()<1){
	    	result.setCode(200);
		    result.setMessage("" + userId + "无历史头像");
		    result.setNum(0);
		    return result;
	    }
	    if(page==0){
		    result.setResult(files);
	    }else{
		    result.setResult(files.subList(6 * (page - 1), 6 * page));
	    }
	    result.setCode(200);
	    result.setMessage("" + userId + "" + page + "");
	    result.setNum(files.size());
	    return result;
	  }
	/**
	 * 13.获取某天生日的用户
	 * @desc 
	 * @Author dora
	 * @time 2020年9月7日 上午12:32:54
	 */
	@RequestMapping(value="getBirthDayUser/{day}")
	@ResponseBody
	public BaseResult<List<UserInfo>> getBirthDayUser(@PathVariable String day){
		BaseResult<List<UserInfo>> result=new BaseResult<List<UserInfo>>();
		List<UserInfo> uis=userInfoService.getBirthDayUser(day);
		result.setResult(uis);
		result.setCode(200);
		result.setNum(uis.size());
		return result;
	}
}
