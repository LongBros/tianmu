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
		Cookie[]  cs=req.getCookies();
		if(cs==null){//未登录时可能无cookie
			
		}else{
			for(Cookie c:cs)
			{
				if("userId".equals(c.getName())){
					return c.getValue();
				}
			}
		}
		
		return "";
	}
	public static void main(String[] args) {
		
	}
}
