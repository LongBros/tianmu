package com.longbro.doranote.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.longbro.doranote.util.JdbcUtil;

public class WechatServlet extends HttpServlet {
	private static Logger logger= Logger.getLogger(WechatServlet.class);
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(req, resp);
	}
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setContentType("text/html");
		req.setCharacterEncoding("utf-8");
		resp.setCharacterEncoding("utf-8");
		// TODO Auto-generated method stub
		String accId=req.getParameter("acc_id");
		String url=req.getParameter("url");
		String time=req.getParameter("time");
		logger.info(accId+"........"+url);
		if(StringUtils.isEmpty(accId)||StringUtils.isEmpty(url)){
			return;
		}
		String acc="";
		switch(accId){
			case "22760641":
				acc="人民日报";
				break;
			case "57453563":
				acc="十点人物志";
				break;
				
		}
			
		String insertSql="INSERT INTO `dora_web_longbro`.`d_wechat_data` (`we_acc_id`, `we_acc`, `we_url`, `we_time`, `we_status`) VALUES ('"+accId+"', '"+acc+"', '"+url+"', '"+time+"', '0');";
		JdbcUtil.insertOrUpdate(insertSql);
//		super.doPost(req, resp);
	}
}
