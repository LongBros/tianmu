package com.longbro.doranote.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Hashtable;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class ContextUtil {
	public static String getCurrentUserId(HttpServletRequest req){
		return getCookieValueByKey("userId",req);
	}
	public static String getCurrentUserName(HttpServletRequest req){
		return getCookieValueByKey("userNick",req);
	}
	public static String getCookieValueByKey(String key,HttpServletRequest req){
		Cookie[]  cs=req.getCookies();
		if(cs==null){//未登录时可能无cookie
			
		}else{
			for(Cookie c:cs)
			{
				if(key.equals(c.getName())){
					return c.getValue();
				}
			}
		}
		
		return "";
	}
	public static void main(String[] args) {
		
	}
}
