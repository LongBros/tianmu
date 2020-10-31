package com.longbro.doranote.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.Jsoup;

/**
 * 抖音去水印
 * 2020-10-29
 * @author ASUS
 *
 */
public class RemoveWaterPrint {

	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		//●抖音链接(使用手机分享功能,复制链接)
        removeWater();
	}
	private static void removeWater() throws IOException, FileNotFoundException {
//		String url = "https://v.douyin.com/Ja2dWhN";
        String urls[][] ={
        		{"#成长力计划 #沙雕沙雕沙雕 #搞笑 直男的基础操作  https://v.douyin.com/JaME7sN/ 复制此链接，打开抖音，直接观看视频！","2020-10-28"},
        		{"#成长力计划 #沙雕沙雕沙雕 那些年的小树林等你  https://v.douyin.com/JaMEKay/ 复制此链接，打开抖音，直接观看视频！","2020-10-27"},
        		{"#成长力计划 #沙雕沙雕沙雕 #搞笑 这是一个有味道的宿舍  https://v.douyin.com/JarFn2C/ 复制此链接，打开抖音，直接观看视频！","2020-10-26"},
        		{"#成长力计划 #沙雕沙雕沙雕 #搞笑 诸葛亮舌战群儒  https://v.douyin.com/JaraWyy/ 复制此链接，打开抖音，直接观看视频！","2020-10-22"},
        		{"#成长力计划 #搞笑 #沙雕沙雕沙雕 学长查寝 就挺秃然的  https://v.douyin.com/JarD5x3/ 复制此链接，打开抖音，直接观看视频！","2020-10-21"},
        		{"#成长力计划 #沙雕沙雕沙雕 #搞笑 大半夜宿舍上演熬夜的诱惑  https://v.douyin.com/Jar53nw/ 复制此链接，打开抖音，直接观看视频！","2020-10-20"},
        };
        String url1 ="#成长力计划 #沙雕沙雕沙雕 #搞笑 直男的基础操作  https://v.douyin.com/JaME7sN/ 复制此链接，打开抖音，直接观看视频！";

        //过滤链接，获取http连接地址
        String finalUrl = decodeHttpUrl(url1);
        System.out.println(finalUrl);
        //1.利用Jsoup抓取抖音链接
        //抓取抖音网页
        String htmls = Jsoup.connect(finalUrl).ignoreContentType(true).execute().body();
        System.out.println(htmls); //做测试时使用

        //2.利用正则匹配可以抖音下载链接
        //playAddr: "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200ffc0000bfil6o4mavffbmroeo80&line=0",
        //具体匹配内容格式：「https://aweme.snssdk.com/aweme/...line=0」
        Pattern patternCompile = Pattern.compile("(?<=playAddr: \")https?://.+(?=\",)");
        //利用Pattern.compile("正则条件").matcher("匹配的字符串对象")方法可以将需要匹配的字段进行匹配封装 返回一个封装了匹配的字符串Matcher对象

        //3.匹配后封装成Matcher对象
        Matcher m = patternCompile.matcher(htmls);

        //4.①利用Matcher中的group方法获取匹配的特定字符串 ②利用String的replace方法替换特定字符,得到抖音的去水印链接
        String matchUrl ="";
        while(m.find()) {
            matchUrl = m.group(0).replaceAll("playwm", "play");
        }
        System.out.println("去水印链接："+matchUrl); //做测试时使用
        //5.将链接封装成流
        //注:由于抖音对请求头有限制,只能设置一个伪装手机浏览器请求头才可实现去水印下载
        Map<String, String> headers = new HashMap<>();
        headers.put("Connection", "keep-alive");
        headers.put("Host", "aweme.snssdk.com");
        headers.put("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16D57 Version/12.0 Safari/604.1");

        //6.利用Joup获取视频对象,并作封装成一个输入流对象
        BufferedInputStream in = Jsoup.connect("").headers(headers).timeout(10000).ignoreContentType(true).execute().bodyStream();

        Long timetmp = new Date().getTime();
        String fileAddress = "F:/新建文件夹/抖音视频/82年的熊猫君_"+timetmp+".mp4";

        //7.封装一个保存文件的路径对象
        File fileSavePath = new File(fileAddress);

        //注:如果保存文件夹不存在,那么则创建该文件夹
        File fileParent = fileSavePath.getParentFile();
        if(!fileParent.exists()){
            fileParent.mkdirs();
        }

        //8.新建一个输出流对象
        OutputStream out =
                new BufferedOutputStream(
                        new FileOutputStream(fileSavePath));

        //9.遍历输出文件
        int b ;
        while((b = in.read()) != -1) {
            out.write(b);
        }

        out.close();//关闭输出流
        in.close(); //关闭输入流

        //注:打印获取的链接
        System.out.println("-----抖音去水印链接-----\n"+matchUrl);
        System.out.println("\n-----视频保存路径-----\n"+fileSavePath.getAbsolutePath());
	}
	   public static String decodeHttpUrl(String url) {
	        int start = url.indexOf("http");
	        int end = url.lastIndexOf("/");
	        String decodeurl = url.substring(start, end);
	        return decodeurl;
	    }
}
