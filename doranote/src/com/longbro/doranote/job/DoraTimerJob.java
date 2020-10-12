package com.longbro.doranote.job;

import java.sql.Array;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.longbro.doranote.bean.NoteBook;
import com.longbro.doranote.bean.UserInfo;
import com.longbro.doranote.service.NoteBookService;
import com.longbro.doranote.service.UserInfoService;
import com.longbro.doranote.util.JdbcUtil;
import com.longbro.doranote.util.SpideWechat;
import com.longbro.doranote.util.Strings;
import com.longbro.doranote.util.TimeUtil;

@Component
public class DoraTimerJob {
	Logger log=Logger.getLogger(getClass());
	@Autowired
	static NoteBookService nbs;
	@Autowired
    UserInfoService uis;
	public DoraTimerJob() {
		// TODO Auto-generated constructor stub
		log.info("初始化SpringTask定时器-SpringTask");
	}
	//定时生成日记
	@Scheduled(cron="${dora.job.genDiary}")
	public void genDiary() {
		log.info("开始生成日记-使用SpringTask");
		nbs.genDiary(0, 0);
		log.info("生成日记结束-使用SpringTask");
	}
	//定时取消某篇日记的置顶
	
	//定时每天0点发送所有生日用户的生日祝福
	@Scheduled(cron="${dora.job.birthNotice}")
	public void birthNotice() {
		//将前天生日用户的祝福取消置顶
		nbs.cancelTop();
		
		log.info("开始获取今天生日的用户");
		
		SimpleDateFormat sdf=new SimpleDateFormat("MM-dd");
		String today=sdf.format(new Date());
		List<UserInfo> ui=uis.getBirthDayUser(today);//"1995-10-16"
		String con="<center>&&&&aini:::祝福今日寿星&&&&aini:::<br>";
		if(ui.size()==0){
			log.info("今天没有用户生日");
		}else{
			for(UserInfo u:ui){
				con+="<a style='color:red' target='_blank' href='http://www.duola.vip/author.html?"+u.getUUserId()+"'>"+u.getUUserName()+"</a>（"+u.getUBornTime()+"）<br>";
				log.info("祝‘"+u.getUJoinTime()+"’加入哆啦网的‘"+u.getUUserId()+"-"+u.getUUserName()+"’生日快乐！"+u.getSignature());
			}
			int cake=new Random().nextInt(Strings.cakes.length);
			con+="生日快乐！Best Wishes To you.<<hahaxiao:::&&&&jiyan:::&&&&keai:::</center><center><img style='width:400px;height:400px;' src='http://img.duola.vip/image/cake/"+Strings.cakes[cake]+"'></center>";
			NoteBook nb=new NoteBook();
			nb.setNWritter("1314521");nb.setNBookid(82927524);nb.setNAuthority(0);nb.setNAllowComment(0);
			nb.setNTitle("祝"+today+"生日的小伙伴Happy Birthday！");nb.setNContent(con);nb.setnTop(13);nb.setnUserTop(0);
			nb.setNWeather(0);nb.setNMood(0);nb.setnWriteDevice("generate");
			nb.setNTime(TimeUtil.time());nb.setnSongId("5270588");nb.setNType(0);nb.setNLocation("哆啦世界");
			nbs.addNote(nb);
			log.info("已获取到今天生日的用户");
		}
	}
	/**
	 * @throws ClassNotFoundException 
	 * @desc 定时爬取人民日报的日记
	 * @Author dora
	 * @time 2020年10月1日 下午7:39:39
	 */
	@Scheduled(cron="${dora.job.spidePeopleDaily}")
	public static void spideDaily() throws Exception{
		String selectSql=new String("select we_url from d_wechat_data where we_status=0 and we_acc_id='22760641'");
		ResultSet rs=JdbcUtil.select(selectSql);
		String urls[]=new String[20];
		int i=0;
		while(rs.next()){
			urls[i]=rs.getString("we_url");
			System.out.println(rs.getString("we_url"));
			i++;
		}
//		rs.close();
		
		if(StringUtils.isEmpty(urls[0])){
			System.out.println("没有未爬取的人民日报日记");
			return;
		}
		System.out.println("开始爬取人民日报的日记");
		long start=System.currentTimeMillis();
		List<HashMap<String,String>> list=SpideWechat.getPeopleDailyReport(urls,"22760641");
		System.out.println("爬取"+list.size()+"篇日记共计耗时："+(System.currentTimeMillis()-start));
		System.out.println("开始写入人民日报的日记");
		writeDiary(list,"22760641","北京市"," 22:00:00");
		System.out.println("成功写入人民日报的日记");
		
		String updateSql="update d_wechat_data set we_status=1 where we_acc_id='22760641'";
		JdbcUtil.insertOrUpdate(updateSql);
	}
	@Scheduled(cron="${dora.job.spideTenthDaily}")
	public static void spideTenDaily() throws Exception{
		String selectSql=new String("select we_url from d_wechat_data where we_status=0 and we_acc_id='57453563'");
		ResultSet rs=JdbcUtil.select(selectSql);
		String urls[]=new String[20];
		int i=0;
		while(rs.next()){
			urls[i]=rs.getString("we_url");
			System.out.println(rs.getString("we_url"));
			i++;
		}
//		rs.close();
		
		if(StringUtils.isEmpty(urls[0])){
			System.out.println("没有未爬取的十点人物志日记");
			return;
		}
		System.out.println("开始爬取十点人物志的日记");
		long start=System.currentTimeMillis();
		List<HashMap<String,String>> list=SpideWechat.getPeopleDailyReport(urls,"57453563");
		System.out.println("爬取"+list.size()+"篇日记共计耗时："+(System.currentTimeMillis()-start));
		System.out.println("开始写入十点人物志的日记");
		writeDiary(list,"57453563","甘肃省兰州市"," 22:00:00");
		System.out.println("成功写入十点人物志的日记");
		
		String updateSql="update d_wechat_data set we_status=1 where we_acc_id='22760641'";
		JdbcUtil.insertOrUpdate(updateSql);
	}
	//写入日记
	public static void writeDiary(List<HashMap<String,String>> list,String acc,String loc,String time){
		for(HashMap<String,String> map:list){
			NoteBook nb=new NoteBook();
			nb.setNWritter(acc);nb.setNAuthority(0);nb.setNAllowComment(0);
			nb.setNTitle(map.get("title"));nb.setNContent(map.get("content"));
			nb.setNWeather(0);nb.setNMood(0);nb.setnTop(0);nb.setnUserTop(0);
			nb.setNTime(map.get("time")+time);nb.setnSongId(map.get("voice"));
			nb.setNType(4);nb.setNLocation(loc);nb.setnWriteDevice("spider");
			nbs.addNote(nb);
		}
	}
}
