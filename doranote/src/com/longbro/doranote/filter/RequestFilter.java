package com.longbro.doranote.filter;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.support.RequestContextUtils;

import com.longbro.doranote.util.ContextUtil;
import com.longbro.doranote.util.JdbcUtil;
import com.longbro.doranote.util.TimeUtil;

/**
 *  需要配置在web.xml中,配置格式如下所示:
 *  <pre>
 *  <filter>
    	<filter-name>requestFilter</filter-name>
    	<filter-class>com.redxun.saweb.filter.RequestFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>requestFilter</filter-name>
        <url-pattern>*.do</url-pattern>
    </filter-mapping>
 *  </pre>
 * @author csx
 *
 */
public class RequestFilter implements Filter{
	
	private static final Log logger= LogFactory.getLog(RequestFilter.class);
	
	//不需要记录的请求地址:获取信息提醒、根据key获取字典表信息、获取地区信息
	public static String[] filterUrls = {"","","",""};
	
	public void init(FilterConfig filterConfig) throws ServletException { }

	public void doFilter(ServletRequest arg0, ServletResponse arg1,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request=(HttpServletRequest)arg0;
		HttpServletResponse response=(HttpServletResponse)arg1;
		Date startDate = new Date();
		HttpServletResponse resp=(HttpServletResponse)response;
		//设置Request至线程变量
		
		String reqPath = getRequestPath((HttpServletRequest) request,"path");//完整路径
		String reqUrl = getRequestPath((HttpServletRequest) request,"url");//请求路径
		String params = getParam((HttpServletRequest) request);//请求参数
		String ipAddr = getIpAddr((HttpServletRequest) request);//访问IP
		
		//设置当前语言区域至请求对象中
		request.setAttribute("currentLocale", RequestContextUtils.getLocale((HttpServletRequest)request));
		
		chain.doFilter(request, response);
		
		Date endDate = new Date();
		List<String> urlList = Arrays.asList(filterUrls);
		if(!urlList.contains(reqPath)){//如果该请求不在非记录的数组里，则插入数据库记录
			//插入访问请求记录信息
			final long startRec = System.currentTimeMillis();
			String userId="",userNick="";
			if(request!=null){
				userId=ContextUtil.getCurrentUserId(request);
				userNick=ContextUtil.getCurrentUserName(request);
			}
			
			//String ip="";//AddressUtils.getIp(request);//"";
			String add="";//AddressUtils.getAddByIp(ip);//"";//
			long time_consumed=System.currentTimeMillis() - startRec;
			long recordCost=System.currentTimeMillis() - startRec;
			String insertSql="INSERT INTO `dora_web_longbro`.`d_api_visit` "
					+ "(`visit_id`, `visit_name`, `href`, `real_ip`, `real_add`, `visit_time`, `callback_time`, `time_consumed`, `params`)"
					+ " VALUES ('"+userId+"', '"+userNick+"', '"+reqUrl+"', '"+ipAddr+"', '"+add+"', '"+TimeUtil.time()+"', "+recordCost+", "+time_consumed+", '"+params+"');";
			logger.info("insertSql:"+ insertSql);
			JdbcUtil.insertOrUpdate(insertSql);
		}
	}
	
	/**
	 * 获取请求参数
	 * @param request
	 * @return
	 */
	public String getParam(HttpServletRequest request){
		/*
		 * 获取所有请求参数，封装到Map中
		*/
		Map<String,String[]> map = (Map<String,String[]>)request.getParameterMap();
		String params = "";
		for(String name:map.keySet()){
			String[] values = map.get(name);
			params = params.equals("") ? params : params+"&";
			String p = "";
			if(values.length>0){
				for(String str : values){
					p = p.equals("") ? p : p+",";
					p += str;
				}
			}
			params = params + name + "=" + p;
		}
		return params;
	}
	
	/**
	 * 获取请求路径
	 * @param request
	 * @param type:url-完整路径(http://dev.lcbpm.com/req/req.do),uri-请求(req.do),path-请求路径(包含目录\req\req.do),query-GET请求参数(custNo=001&authType=2)
	 * @return
	 */
	public String getRequestPath(HttpServletRequest request, String type) {
		String path = "";
		if(type.equals("url")){
			path = request.getRequestURL()==null ? "" : request.getRequestURL().toString();
		}else if(type.equals("uri")){
			path = request.getRequestURI()==null ? "" : request.getRequestURI();
		}else if(type.equals("path")){
			path = request.getServletPath()==null ? "" : request.getServletPath();
		}else if(type.equals("query")){
			path = request.getQueryString()==null ? "" : request.getQueryString();
		}
		return path;
	}
	
	
	//获取请求IP
	public static String getIpAddr(HttpServletRequest request) {
        String ipAddress = request.getHeader("x-forwarded-for");
        if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
            String localIp = "127.0.0.1";
            String localIpv6 = "0:0:0:0:0:0:0:1";
            if (ipAddress.equals(localIp) || ipAddress.equals(localIpv6)) {
                // 根据网卡取本机配置的IP
                InetAddress inet = null;
                try {
                    inet = InetAddress.getLocalHost();
                    ipAddress = inet.getHostAddress();
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
            }
        }
        // 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
        String ipSeparate = ",";
        int ipLength = 15;
        if (ipAddress != null && ipAddress.length() > ipLength) {
            if (ipAddress.indexOf(ipSeparate) > 0) {
                ipAddress = ipAddress.substring(0, ipAddress.indexOf(ipSeparate));
            }
        }
        return ipAddress;
    }
	public void destroy() {
	}
}
