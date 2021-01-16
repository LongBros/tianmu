package com.longbro.doranote.service;

import java.util.HashMap;
import java.util.List;

import com.longbro.doranote.bean.BookSong;
import com.longbro.doranote.dao.BookSongDao;

import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
/**
 * 
 * <pre> 
 * 描述：点歌台预约点歌表 DAO接口
 * 作者:longbro
 * 日期:2021-01-16 13:10:37
 * 版权：哆啦学娱网络科技有限公司
 * </pre>
 */
@Service
public class BookSongService{
	@Autowired BookSongDao dao;
	public void create(BookSong bean) {
		dao.create(bean);
	}
	
	public List<HashMap<String, Object>> getBookSongBy(String userId,String date){
		return dao.getBookSongBy(userId, date);
	}
}

