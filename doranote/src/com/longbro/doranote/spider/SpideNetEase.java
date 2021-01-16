package com.longbro.doranote.spider;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.google.gson.Gson;
import com.google.gson.internal.LinkedTreeMap;
/**
 * 2020-10-18
 * @author ASUS
 *
 */
public class SpideNetEase {
	public static void main(String[] args) {
//		System.out.println(getTime("193160.0"));
		
		long start=System.currentTimeMillis();
		String url="https://music.163.com/discover/toplist?id=3778678";
		List<HashMap<String, String>> songs=SpideNetEase.getAllSongByUrl(url);
		
		String requrl="http://m.duola.vip" + "/addSong.do";
//		for(HashMap<String, String> param:songs){//遍历并插入数据库
//			Map<String, String> param=new HashMap<>();
//			param.put("sourceId", song.get("sourceId"));param.put("songName", song.get("songName"));
//			param.put("singer",song.get("singer"));param.put("duration",song.get("duration"));
//			param.put("album",song.get("album"));param.put("imgPath",song.get("imgPath"));
//			param.put("releaseTime", "");param.put("website","网易云音乐");param.put("downSong","0");
//			param.put("descr",song.get("descr")+","+TimeUtil.getToday()+"由机器自动爬取");param.put("time",TimeUtil.time());
//			HttpClientUtils.httpPostMethod(requrl, param);
//		}
	}
	public static String getTime(String s){
		String result="";
		int dura=Integer.parseInt(s.substring(0, s.indexOf(".")));
		int sec=dura/1000;
		int minute=sec/60;
		int second=sec%60;
		if(minute<10){
			result="0"+minute;
		}else{
			result=""+minute;
		}
		result+=":";
		if(second<10){
			result+="0"+second;
		}else{
			result+=""+second;
		}
		return result;
	}
	public static List<HashMap<String, String>> getAllSongByUrl(String url) {
		List<HashMap<String, String>> songs=new ArrayList<>();
		long beginTime=System.currentTimeMillis();
		Document doc;
		try {
			doc = Jsoup.connect(url).get();
//			System.out.println(doc);
			Element e=doc.getElementById("song-list-pre-data");//song-list-pre-data
			Elements es= doc.getElementsByClass("f-hide");
			
			//加载正常资源id
			String ess=es.toString();
			String esss[]=ess.split("song");System.out.println(esss.length);
			HashMap<String,String> idMap=new HashMap<>();
			for(String s:esss){
				if(s.contains("</a>")){
					String id=s.substring(4, s.indexOf("\">"));
					String songN=s.substring(s.indexOf("\">")+2,s.indexOf("</a>"));
					idMap.put(songN, id);
				}
			}
//			System.out.println(idMap);

			String se=e.toString();
			se=se.replace("<textarea id=\"song-list-pre-data\" style=\"display:none;\">", "").replace("</textarea>", "");
			List<LinkedTreeMap> lists=new Gson().fromJson(se, ArrayList.class);
			for(LinkedTreeMap map:lists){
				System.out.println(map);
				if("1.0".equals(map.get("fee")+""))//收费歌曲
				{
					System.out.println(">>>>>>>>>>>>>>>过滤掉收费歌曲"+map.get("name")+"----fee"+map.get("fee"));
					continue;
				}else{
					System.out.println(">>>>>>>>>>>>>>>"+map.get("name")+"----fee"+map.get("fee"));
				}
				HashMap<String, String> song=new HashMap<>();
				song.put("sourceId", idMap.get(map.get("name"))+"");
				song.put("songName", map.get("name")+"");
				if("0.0".equals(map.get("mvid")+""))//2021-01-04添加爬取mvid
					song.put("mv_path","" );
				else
					song.put("mv_path","https://music.163.com/#/mv?id="+(long)Double.parseDouble(map.get("mvid")+"")+"" );
				song.put("duration", map.get("duration")+"");
				System.out.println("歌名："+map.get("name")+",mv地址:"+song.get("mv_path"));

				String album=map.get("album")+"";
				
//				HashMap albums=new Gson().fromJson(album, HashMap.class);
//				song.put("album", albums.get("name")+"");
//				song.put("imgPath", albums.get("picUrl")+"");
				song.put("album", album.substring(album.indexOf("name")+5,album.indexOf("picUrl")-2));
				song.put("imgPath", album.substring(album.indexOf("picUrl")+7,album.indexOf("tns")-2));
				
				String singer=map.get("artists")+"";
//				List<LinkedTreeMap> singers=new Gson().fromJson(singer, ArrayList.class);
//				if(singers.size()==1){
//					singer="&"+singers.get(0).get("name")+"";
//				}else{
//					for(int i=0;i<singers.size();i++){
//						singer+="&"+singers.get(i).get("name")+"";
//					}
//				}
				song.put("singer",singer.substring(singer.indexOf("name")+5,singer.indexOf("tns")-2));
				song.put("descr", map.get("alias")+"");
				songs.add(song);
			}
//			System.out.println(songs);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("耗时："+(System.currentTimeMillis()-beginTime)/1000+",共"+songs.size()+"不收费歌曲");
		return songs;
	}
}
