package com.longbro.doranote.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.longbro.doranote.bean.Visit;
import com.longbro.doranote.dao.VisitDao;
/**
 * 
 * <pre> 
 * 描述：日记访问记录表 DAO接口
 * 作者:longbro
 * 日期:2019-11-18 21:04:53
 * 版权：多啦学娱网络科技有限公司
 * </pre>
 */
@Service
public class VisitService{
	@Autowired VisitDao dao;
	public void create(Visit bean) {
		// TODO Auto-generated method stub
		dao.create(bean);
	}
}

