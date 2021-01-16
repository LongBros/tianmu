package com.longbro.doranote.aop;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.google.gson.Gson;
import com.longbro.doranote.util.AddressUtils;
import com.longbro.doranote.util.ContextUtil;
import com.longbro.doranote.util.JdbcUtil;
import com.longbro.doranote.util.TimeUtil;
public class AopAdvices {
	//两种方法获取request
//	static HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
	@Autowired 
	static HttpServletRequest request; //这里可以获取到request
	/**
	 * 请求环绕通知
	 * 
	 * @param logger
	 * @param point
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static Object aroundNotice(Logger logger, ProceedingJoinPoint point) {
		logger.info("@Around：进入环绕通知"+point.getSignature()+"");

		// 访问目标方法的参数：
		final Object[] args = point.getArgs();
		// 执行目标方法
		final long start = System.currentTimeMillis();
		Object returnValue = null;
		try {
			returnValue = point.proceed(args);
		} catch (Throwable e) {
			logger.error("mapping 方法：" + point.getSignature());
			logger.error("异常信息：", e);
			e.printStackTrace();
			if (e instanceof NullPointerException) {
			}else {
			}

			String transactionMessage = "";
			try {
				// 手动回滚事务
				TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
				logger.info("事务回滚成功");
				transactionMessage = "事务回滚成功";
			} catch (Exception ex) {
				transactionMessage = "事务回滚失败：" + ex.getMessage();
				logger.info("事务回滚失败：" + ex.getMessage());
			}
		}
		
		//2020-12-20添加接口调用记录	2021-01-09移至request中进行
//		final long startRec = System.currentTimeMillis();
//		String userId="",userNick="";
//		if(request!=null){
//			userId=ContextUtil.getCurrentUserId(request);
//			userNick=ContextUtil.getCurrentUserName(request);
//		}
//		
//		String ip="";//AddressUtils.getIp(request);//"";//
//		String add="";//AddressUtils.getAddByIp(ip);//"";//
		long time_consumed=System.currentTimeMillis() - start;
//		long recordCost=System.currentTimeMillis() - startRec;
//		String insertSql="INSERT INTO `dora_web_longbro`.`d_api_visit` "
//				+ "(`visit_id`, `visit_name`, `href`, `real_ip`, `real_add`, `visit_time`, `callback_time`, `time_consumed`, `params`)"
//				+ " VALUES ('"+userId+"', '"+userNick+"', '"+point.getSignature()+"', '"+ip+"', '"+add+"', '"+TimeUtil.time()+"', "+recordCost+", "+time_consumed+", '');";
//		logger.info("insertSql:"+ insertSql);
//		JdbcUtil.insertOrUpdate(insertSql);
		
		logger.info("@Around：前置通知执行完成"+ point.getSignature()+"");
		logger.info("接口："+point.getSignature()+"，耗时："+time_consumed+"ms");

		return returnValue;
	}

}
