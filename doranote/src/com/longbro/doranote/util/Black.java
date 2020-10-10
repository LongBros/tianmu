package com.longbro.doranote.util;

import java.util.HashMap;
import java.util.Map;

public class Black {
	static int a;//成员变量可以不赋初值

	public static void main(String[] args) {
		// TODO Auto-generated method stub
//		String url="https://www.higu.tv" + "";
		for(int i=0;i<1;i++){
//			HttpClientUtils.httpGetMethod(url, null);
			String url="http://www.duola.vip" + "/note/diary/genDiary.do";
			Map<String, String> param=new HashMap<>();
			param.put("poem", "0");
			param.put("song", "0");
//			logger.info("请求地址：" + url + "===>>>请求参数：" + param);
			HttpClientUtils.httpGetMethod(url, param);
		}
		
		int b;//局部变量不赋初值会报错
		
		System.out.println(a);
//		System.out.println(b);
	}

}
