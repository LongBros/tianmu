package com.longbro.doranote.dao;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.longbro.doranote.bean.Reply;
/**
 * 描述：评论回复表(支持多级回复) 
 * 作者:longbro
 * 日期:2020-01-26 16:42:32
 * 版权：多啦学娱网络科技有限公司
 */
@Repository
public class ReplyDao extends BaseDao{

	public String getNamespace() {
		return Reply.class.getName();
	}
	public void create(Reply bean) {
		// TODO Auto-generated method stub
		this.insert(getNamespace()+".create", bean);
	}
	public List<HashMap<String,String>> getReplyById(int cid){
		return this.selectList(getNamespace()+".getReplyById", cid);
	}
}

