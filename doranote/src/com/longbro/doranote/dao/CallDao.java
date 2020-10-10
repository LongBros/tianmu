package com.longbro.doranote.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.longbro.doranote.bean.Call;
/**
 * 描述：用户之间的@记录表 
 * 作者:longbro
 * 日期:2019-12-31 23:03:47
 * 版权：多啦学娱网络科技有限公司
 */
@Repository
public class CallDao extends BaseDao{

	public String getNamespace() {
		return Call.class.getName();
	}
	public void create(Call bean) {
		// TODO Auto-generated method stub
		this.insert(getNamespace()+".create", bean);
	}
}

