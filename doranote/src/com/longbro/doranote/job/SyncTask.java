package com.longbro.doranote.job;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimerTask;

import org.apache.log4j.Logger;
import com.longbro.doranote.util.HttpClientUtils;

public class SyncTask extends TimerTask {
	public static Logger logger = Logger.getLogger(SyncTask.class);
	private static boolean isRunning = false;
	boolean isFirst=true;
	public void run() {
		Calendar cal = Calendar.getInstance();
		if (!isRunning){
			logger.info("Timer定时任务执行开始...");
			/*// 时间为24点时才执行任务，否则不执行；
				// 所以调度器timer.schedule的间隔时间不能大于一小时，否则可能错过时间段；
				// 调度器timer.schedule的间隔时间也不能小于一小时，否则可能一天执行几次任务；
*/				
				// 每隔三分钟执行一次
				isRunning = true;
				try {
					if(isFirst){//第一次不执行，以后每次都执行
						isFirst=false;
					}else{
//						String url="http://localhost:8080/doranote/" + "/note/diary/genDiary.do";
						String url="http://www.duola.vip" + "/note/diary/genDiary.do";
						Map<String, String> param=new HashMap<>();
						param.put("poem", "0");
						param.put("song", "0");
						logger.info("请求地址：" + url + "===>>>请求参数：" + param);
						HttpClientUtils.httpGetMethod(url, param);
					}
					
					logger.info("定时任务执行结束...");
				} catch (Exception e) {
					e.printStackTrace();
				}finally {
					isRunning = false;
				}
		}
	}
}
