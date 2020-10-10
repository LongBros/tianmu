package com.longbro.doranote.util;

import java.util.Random;

public class NumberUtil {
	/**
     * @desc 如果生成的随机数为0，则重新生成
     * @Author dora
     * @time 2020年9月5日 下午10:20:40
     * @param number
     * @return
     */
    public static int getRandomNum(int number){
    	int num=new Random().nextInt(number);
//    	System.out.println("中间值："+num);
    	if(num<1){
    		return getRandomNum(number);//此处必须return，不然仍可能返回0
    	}
    	return num;
    }
    
    public static void main(String[] args) {
		System.out.println(getRandomNum(2));
	}
}
