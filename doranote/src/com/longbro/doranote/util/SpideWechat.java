package com.longbro.doranote.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
/**
 * 爬取人民日报夜读
 * @author ASUS
 *
 */
public class SpideWechat {
	public static void main(String[] args) {
		String url[]={"https://mp.weixin.qq.com/s/jd2U2qiKCE13YbwgXlWEZg"};
		getPeopleDailyReport(url,"acc");
	}
	public static List<HashMap<String,String>> getPeopleDailyReport(String urls[],String acc){
		List<HashMap<String,String>> list=new ArrayList<>();
		HashMap<String,String> map=null;

		Document doc;
		try{
			for(String url:urls){
				doc = Jsoup.connect(url).get();
//				System.out.println(doc);
				Elements es3=doc.getElementsByClass("rich_media_title");
//				System.out.println(es3.size());
				String title=es3.get(0).toString();
				title=title.replaceAll("<[.[^<]]*>", "").replaceAll(" ", "");
				System.out.println(title);
				
				Elements es=doc.getElementsByClass("rich_media_content");
//				System.out.println(es.size());
				String s=es.get(0).toString();
				String content=s.replaceAll(" style=\"visibility: hidden;\"", "");

				if("57453563".equals(acc)){//十点人物志
					content=content.substring(content.indexOf("作者"));
					content=content.substring(0, content.indexOf("长按识别二维码"));
					content=content.replaceAll(" ", "").replaceAll("<[.[^<]]*>", "<br>")
							.replaceAll("\n", "").replaceAll("<br><br><br><br><br><br>", "<br>").replaceAll("<br><br><br><br><br>", "<br>")
							.replaceAll("<br><br><br><br>", "<br>").replaceAll("<br><br><br>", "<br>").replaceAll("<br><br>", "<br>")
							;
				}else if("22760641".equals(acc)){
					content=content.replaceAll("<br></p>", "").replaceAll("<br></span>", "");
				}
				
				System.out.println(content);
				
				String voice=s.substring(s.indexOf("<mpvoice"), s.indexOf("</mpvoice>"));
				voice=voice.substring(voice.indexOf("voice_encode_fileid")+21, voice.indexOf("\" data-topic_id"));
				voice="https://res.wx.qq.com/voice/getvoice?mediaid="+voice;
				System.out.println(voice);
				String docs=doc+"";
				
				String time=docs.substring(docs.indexOf("e(t,n,s,document.getElementById(")-200, docs.indexOf("e(t,n,s,document.getElementById("));
				time=time.substring(time.indexOf(",s=\"")+4).substring(0, 10);
				System.out.println(time);
				map=new HashMap<>();
				map.put("title", title);map.put("content", content);
				map.put("voice", voice);map.put("time", time);
				list.add(map);
			}
		}catch(Exception e){
			
		}finally{
		}
		return list;
	}
}
