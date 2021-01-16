
package com.longbro.doranote.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;

import com.longbro.doranote.bean.BookSong;
import com.longbro.doranote.service.BookSongService;
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
    public void create(BookSong bean) {
		bookSongService.create(bean);
	}
}
