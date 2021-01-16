package com.longbro.doranote.dao;

import java.util.List;

import com.longbro.doranote.bean.BookSong;
import com.longbro.doranote.dao.BookSongDao;

import org.springframework.stereotype.Repository;
/**
 * 描述：点歌台预约点歌表 
 * 作者:longbro
 * 日期:2021-01-16 13:10:37
 * 版权：哆啦学娱网络科技有限公司
 */
@Repository
public class BookSongDao extends BaseDao{

	public String getNamespace() {
		return BookSong.class.getName();
	}
	public void create(BookSong bean) {
		this.insert(getNamespace()+".create", bean);
	}
}

