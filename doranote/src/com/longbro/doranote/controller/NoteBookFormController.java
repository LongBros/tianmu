package com.longbro.doranote.controller;
import java.awt.Color;
import java.awt.Font;
import java.awt.image.BufferedImage;
import java.awt.image.ImageProducer;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
//import org.apache.log4j.Logger;
import org.apache.poi.util.StringUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.Gson;
import com.longbro.doranote.BaseResult;
import com.longbro.doranote.bean.Diary;
import com.longbro.doranote.bean.NoteBook;
import com.longbro.doranote.bean.UserInfo;
import com.longbro.doranote.bean.Visit;
import com.longbro.doranote.service.CommentDiaryService;
import com.longbro.doranote.service.NoteBookService;
import com.longbro.doranote.service.UserInfoService;
import com.longbro.doranote.service.VisitService;
import com.longbro.doranote.util.ContextUtil;
import com.longbro.doranote.util.FileProduce;
import com.longbro.doranote.util.ImageProduce;
import com.longbro.doranote.util.SpideLapuda;
import com.longbro.doranote.util.Strings;
import com.longbro.doranote.util.TimeUtil;

/**
 * 笔记本控制器
 * @author longbro
 * @date 2019-10-09 21:11:32
 * @copyright 多啦学娱网络科技有限公司
 */
@Controller
public class NoteBookFormController{
    @Autowired
    NoteBookService noteBookService;
    @Autowired
    UserInfoService userInfoService;
    @Autowired
    CommentDiaryService commentDiaryService;
    @Autowired
    VisitService visitService;
    private Logger logger=Logger.getLogger(NoteBookFormController.class);
    private String last=null;
    
    @RequestMapping(value="diary/{id}")
    public ModelAndView getDiaryByItsId(@PathVariable int id,HttpServletRequest req){
    	logger.info("开始加载id为："+id+"的笔记");
    	NoteBook nb=noteBookService.getDiaryById(id);
    	nb.setNContent(nb.getNContent().replaceAll("<<<", "<img alt='' src='http://img.duola.vip/image/expre/newtieba/")
    			.replaceAll("<<", "<img alt='' src='http://img.duola.vip/image/expre/tieba/")
    			.replaceAll("&&&&", "<img alt='' src='http://img.duola.vip/image/expre/weibo/")
    			.replaceAll("&&&", "<img alt='' src='http://img.duola.vip/image/expre/huang/")
    			.replaceAll("&&", "<img alt='' src='http://img.duola.vip/image/expre/aodamiao/")
    			.replaceAll("::::", ".jpg'>").replaceAll(":::", ".png'>").replaceAll("::", ".gif'>")
    			.replaceAll("&lt;", "<").replaceAll("&amp;", "&"));
    	String userId=ContextUtil.getCurrentUserId(req);
    	List<HashMap<String, Object>> maps=userInfoService.queryUnReadNum(userId);
    	Map<String,Object> map=new HashMap<>();
		map.put("author", nb.getNWritter());
		map.put("id", id);
		String authority="0";
		if(StringUtils.isNotEmpty(userId)){//登录用户
			authority="0,2";
			if(nb.getNWritter().equals(userId)){
				authority="0,1,2";
			}
		}
		map.put("authority", authority);
		List<HashMap<String,Object>> ban=noteBookService.getBeforeAndNextId(map);
//		List<HashMap<String, String>> comments=commentDiaryService.getComByDiaryId(id);
    	
    	ModelAndView mv=new ModelAndView();
    	mv.setViewName("/diary");
    	mv.addObject("diary",nb);//日记信息
    	if(maps.size()>0){
    		mv.addObject("message",maps.get(0));//未读消息
    	}
    	if(ban.size()>0){
    		mv.addObject("nearDiary",ban);//当前日记上下篇
    	}
//    	if(comments.size()>0){
//    		mv.addObject("comments",comments);//当前日记下的评论
//    	}
//    	mv.addObject("url",req.getLocalAddr()+req.getContextPath()+"/diary/"+nb.getNId()+".do");
    	mv.addObject("url","http://www.duola.vip/diary/"+nb.getNId()+".do");
    	
    	Visit visit=new Visit();
    	visit.setVDiary(id+"");visit.setVVisited(nb.getNWritter());visit.setVVisitor(userId);
    	visit.setVVisitTime(TimeUtil.time());
    	visit.setVReadStatus("0");
    	visitService.create(visit);
    	noteBookService.alterTypeNum(id+"", 0,1);
    	return mv;
    }
    
    @RequestMapping(value="page/{page}")
    @ResponseBody
    public ModelAndView getDiaryBy(@PathVariable int page,HttpServletRequest request){
    	
    	logger.info("开始加载笔记"+page);
    	int per=10;
    	HashMap<String, String> map=new HashMap<>();
    	if(StringUtils.isNotEmpty(request.getParameter("time"))){
    		int time=Integer.parseInt(request.getParameter("time"));
    		if(time==1){//加载昨日的日记
        		map.put("time", TimeUtil.getYesterday());
    		}
    	}
    	if(StringUtils.isNotEmpty(request.getParameter("perPage")))
    	{
    		map.put("perPage", request.getParameter("perPage"));
    		per=Integer.parseInt(request.getParameter("perPage"));
    	}else{
    		map.put("perPage","10");
    		per=10;
    	}
    	if(StringUtils.isNotEmpty(request.getParameter("authority")))
    		map.put("authority", request.getParameter("authority"));
    	else
    		map.put("authority", "0,2");
    	map.put("page", (page-1)*per+"");
    	//12-05新增，黑名单功能使用
    	map.put("user", ContextUtil.getCurrentUserId(request));
    	logger.info(TimeUtil.time()+"-------->查询日记列表所传参数:"+new Gson().toJson(map));
    	List<Diary> diarys=noteBookService.getDiaryBy(map);
    	logger.info(new Gson().toJson(diarys));
    	ModelAndView mv=new ModelAndView("index");
    	mv.addObject("diarys",new Gson().toJson(diarys));
    	return mv;
    }
}
