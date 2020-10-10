
package com.longbro.doranote.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;

import com.longbro.doranote.BaseResult;
import com.longbro.doranote.bean.Reply;
import com.longbro.doranote.service.ReplyService;
import com.longbro.doranote.util.TimeUtil;
/**
 * 评论回复表(支持多级回复)控制器
 * @author longbro
 * @date 2020-01-26 16:42:32
 * @copyright 多啦学娱网络科技有限公司
 */
@Controller
@RequestMapping("note/reply/")
public class ReplyController{
    @Autowired
    ReplyService replyService;
    
    /**
     * @desc 1.回复评论
     * @author zcl
     * @date 2020年1月26日
     * @param reply
     * @return
     */
    @RequestMapping(value="replyCom")
    @ResponseBody
    public BaseResult<String> replyCom(Reply reply){
    	BaseResult<String> result=new BaseResult<>();
    	reply.setRTime(TimeUtil.time());
    	reply.setRReadStatus(0);
    	replyService.create(reply);
    	result.setCode(200);
    	result.setMessage("回复成功");
    	result.setResult(null);
    	
    	return result;
    }
    /**
     * @desc 2.加载某条评论的所有回复
     * @author zcl
     * @date 2020年1月26日
     * @param cid
     * @return
     */
    @RequestMapping(value="getReplyById")
    @ResponseBody
    public BaseResult<List<HashMap<String,String>>> getReplyById(int cid){
    	BaseResult<List<HashMap<String,String>>> result=new BaseResult<>();
    	result.setCode(200);
    	result.setMessage("加载回复成功");
    	result.setResult(replyService.getReplyById(cid));
    	return result;
    }
}
