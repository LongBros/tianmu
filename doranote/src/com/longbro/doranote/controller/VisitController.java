
package com.longbro.doranote.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;

import com.longbro.doranote.bean.Visit;
import com.longbro.doranote.service.NoteBookService;
import com.longbro.doranote.service.VisitService;
import com.longbro.doranote.util.TimeUtil;
/**
 * 日记访问记录表控制器
 * @author longbro
 * @date 2019-11-18 21:04:53
 * @copyright 多啦学娱网络科技有限公司
 */
@Controller
@RequestMapping("note/visit/")
public class VisitController{
    @Autowired
    VisitService visitService;
    @Autowired 
    NoteBookService noteBookService;
    /**
     * @desc 添加用户访问日记的记录
     * @author zcl
     * @date 2019年11月18日
     * @param visit
     */
    @RequestMapping(value="addVisitRecord",method=RequestMethod.GET)
    @ResponseBody
    public void addVisitRecord(Visit visit){
    	visit.setVVisitTime(TimeUtil.time());
    	visit.setVReadStatus("0");
    	visitService.create(visit);
    	
    	noteBookService.alterTypeNum(visit.getVDiary(), 0,1);
    }
}
