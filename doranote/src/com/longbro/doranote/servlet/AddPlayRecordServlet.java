package com.longbro.doranote.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.longbro.doranote.util.AddressUtils;
import com.longbro.doranote.util.ContextUtil;
import com.longbro.doranote.util.JdbcUtil;
import com.longbro.doranote.util.TimeUtil;

public class AddPlayRecordServlet extends HttpServlet {
	private static Logger logger= Logger.getLogger(AddPlayRecordServlet.class);
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
		String songId=req.getParameter("song_id");
		String songType=req.getParameter("song_type");
		String duration=req.getParameter("duration");
		
		logger.info(songId+"........"+songType);
		if(StringUtils.isEmpty(songId)||StringUtils.isEmpty(songType)){
			return;
		}
		String player=ContextUtil.getCurrentUserId(req);
		String time=TimeUtil.time();
		String ip=AddressUtils.getIp(req);
		String insertSql="INSERT INTO `dora_web_longbro`.`d_play_record` (`P_SONG_TYPE`, `P_SONGID`, `P_PLAY_TIME`, `P_PLAY_DURATION`, `P_PLAYER`, `P_PLAYER_IP`, `P_PLAYER_ADDR`) VALUES ("+
				songType+", '"+songId+"', '"+time+"', '"+duration+"', '"+player+"', '"+ip+"', '哆啦网');";
		JdbcUtil.insertOrUpdate(insertSql);
//		super.doPost(req, resp);
	}
}
