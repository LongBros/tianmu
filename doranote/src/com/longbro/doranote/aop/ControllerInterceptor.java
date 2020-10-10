package com.longbro.doranote.aop;

import org.apache.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * aop控制类
 * 
 * 切点执行顺序： 1、@Around 2、@Before 3、@Around 4、@After 5、@AfterReturning
 * 其中2、3是由1觉得是否会执行，即如果1不执行point.proceed(args)，2、3就不会执行
 * 
 * @author 0
 *
 */
//@Aspect
//@Component
public class ControllerInterceptor {

	private final Logger logger = Logger.getLogger(this.getClass());

//	@Autowired
//	private SystemConfig systemConfig;

	public ControllerInterceptor() {
		logger.info("aop控制切面日志类");
	}
	/**
	 * 注解方式
	 */
	private final String annotation = "(@annotation(org.springframework.web.bind.annotation.RequestMapping)"
			+ " || @annotation(org.springframework.web.bind.annotation.PostMapping)"
			+ " || @annotation(org.springframework.web.bind.annotation.GetMapping)"
			+ " || @annotation(org.springframework.web.bind.annotation.PutMapping)"
			+ " || @annotation(org.springframework.web.bind.annotation.DeleteMapping))";

	/**
	 * 切入点定义
	 */
	private final String point = "(execution(* com.longbro.doranote..controller..*(..)) && " + annotation + ")";

	/**
	 * 定义切点
	 */
//	@Pointcut(point)
	public void controllerMethodPointcut() {
	}

	/**
	 * 环绕通知 最先执行该通知
	 * 
	 * @throws Throwable
	 */
//	@Around("controllerMethodPointcut()")
	public Object doAround(ProceedingJoinPoint point) throws Throwable {
		return AopAdvices.aroundNotice(logger, point);
	}

	/**
	 * 前置通知
	 */
//	@Before("controllerMethodPointcut()")
	public void doBefore(JoinPoint point) {
		logger.info("@Before：进入前置通知");
	}

	/**
	 * 后置通知
	 */
//	@After("controllerMethodPointcut()")
	public void doAfter(JoinPoint point) {
		logger.info("@After：进入后置通知");
		System.out.println();
	}

	/**
	 * 返回后通知
	 */
//	@AfterReturning(pointcut = "controllerMethodPointcut()", returning = "returnValue")
	public void doAfterReturn(JoinPoint point, Object returnValue) {
//		if (returnValue instanceof BaseResp) {
//			if (StringUtils.isEmpty(((BaseResp) returnValue).getV())) {
//				((BaseResp) returnValue).setV(systemConfig.getVersion());
//			}
//		}
	}

	/**
	 * 异常通知
	 */
//	@AfterThrowing("controllerMethodPointcut()")
	public void doAfterThrowing(JoinPoint point) {
		logger.info("@AfterThrowing：进入异常通知");
	}

}
