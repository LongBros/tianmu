
package com.longbro.doranote.controller;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.Gson;
import com.longbro.doranote.BaseResult;
import com.longbro.doranote.bean.BookSong;
import com.longbro.doranote.service.BookSongService;
import com.longbro.doranote.util.TimeUtil;
/**
 * 点歌台预约点歌表控制器
 * @author longbro
 * @date 2021-01-16 13:10:37
 * @copyright 哆啦学娱网络科技有限公司
 */
@Controller
@RequestMapping("note/bookSong/")
public class BookSongController{
    @Autowired
    BookSongService bookSongService;
    
    @RequestMapping("create")
    @ResponseBody
    public BaseResult create(BookSong bean) {
    	BaseResult result=new BaseResult<>();
    	if(bean==null||StringUtils.isEmpty(bean.getBUserId()+"")||StringUtils.isEmpty(bean.getBId()+"")){
    		result.setCode(100);
    		result.setMessage("必传参数为空");
    		return result;
    	}
    	System.out.println(".............................."+new Gson().toJson(bean));
    	bean.setBBookTime(TimeUtil.time());
		bookSongService.create(bean);
		result.setCode(200);
		result.setMessage("预约点歌成功");
		return result;
	}
    @RequestMapping("getBookSongBy")
    @ResponseBody
    public BaseResult getBookSongBy(String userId){
    	BaseResult result=new BaseResult<>();
    	String date=TimeUtil.getToday();
    	List<HashMap<String, Object>> bss=bookSongService.getBookSongBy(userId, date);
    	result.setCode(200);
    	result.setMessage("获取"+userId+"点的歌成功");
    	result.setResult(bss);
    	return result;
    }
}
