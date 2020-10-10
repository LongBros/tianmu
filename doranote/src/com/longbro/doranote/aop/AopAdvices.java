package com.longbro.doranote.aop;

import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
public class AopAdvices {


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

		logger.info("@Around：前置通知执行完成"+ point.getSignature()+"");
		logger.info("接口："+point.getSignature()+"，耗时："+(System.currentTimeMillis() - start)+"ms");

		return returnValue;
	}

}
