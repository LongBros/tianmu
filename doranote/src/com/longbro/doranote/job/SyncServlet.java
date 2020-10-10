package com.longbro.doranote.job;

import java.util.Calendar;
import java.util.Date;
import java.util.Timer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.log4j.Logger;

/*
 servlet 和Timer 结合起来 完成侦听定时执行任务，在初始化时加载调度器；
 在 web.xml文件中配置 servlet 类：
 <servlet>
 <servlet-name>SyncServlet</servlet-name>
 <servlet-class>com.longbro.doranote.util.SyncServlet</servlet-class>
 <load-on-startup>0</load-on-startup>
 </servlet>
 这个servlet是执行后台操作，不需要相应外部请求，因此没有必要为它定义servlet-mapping。
 <load-on-startup>1</load-on-startup> 必须设置，容器自动初始化，加载任务；*/

public class SyncServlet extends HttpServlet {
	public static Logger logger = Logger.getLogger(SyncServlet.class);
	private static final long serialVersionUID = 1L;
	Timer timer = new Timer();

	public void init() throws ServletException {
		logger.info("初始化Timer定时器");
		String sendmailhour = "0"; // 凌晨1点

		String sendmailminutes = "0";
		String sendmailsecond = "0";
		// 设置首次执行时间；24点
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(sendmailhour));
		cal.set(Calendar.MINUTE, Integer.parseInt(sendmailminutes));
		cal.set(Calendar.SECOND, Integer.parseInt(sendmailsecond));
		// 首次执行时间是24点，以后过24小时执行一次任务，时间间隔不能大于或小于24小时
		
		// 执行操作,三个参数：要执行的任务；时间起点；间隔时间（毫秒）
		//三分钟执行一次发送定时短信任务
		timer.schedule(new SyncTask(), new Date(),24*60*60*1000);//2020-09-04 10:10:10
		
		//会员的生日提醒。每天凌晨跑出来今天需要发的短信提醒。存储到短信记录里，定时发送。8:00开始发。
		
			 
		//System.out.println("数据同步定时器已启动！");
		}

	public void destroy() {
		super.destroy();
		timer.cancel(); // 要主动销毁；否则关闭项目应用时，定时器没被销毁
	}
}
