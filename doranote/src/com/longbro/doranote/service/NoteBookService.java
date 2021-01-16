package com.longbro.doranote.service;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.longbro.doranote.BaseResult;
import com.longbro.doranote.bean.BookSong;
import com.longbro.doranote.bean.Diary;
import com.longbro.doranote.bean.NoteBook;
import com.longbro.doranote.dao.NoteBookDao;
import com.longbro.doranote.spider.SpideLapuda;
import com.longbro.doranote.util.TimeUtil;
/**
 * 描述：笔记本 DAO接口
 * 作者:longbro
 * 日期:2019-10-09 21:11:32
 * 版权：多啦学娱网络科技有限公司
 */
@Service
public class NoteBookService{
	@Autowired NoteBookDao dao;
	@Autowired
	BookSongService bss;
	public void addNote(NoteBook nb) {
		// TODO Auto-generated method stub
		dao.addNote(nb);
	}
	public List<NoteBook> getDiaryByPage(int page) {
		// TODO Auto-generated method stub
		return dao.getDiaryByPage(page);
	}
	public NoteBook getDiaryById(int id) {
		// TODO Auto-generated method stub
		return dao.getDiaryById(id);
	}
	public int getDiaryNumBy(NoteBook nb) {
		// TODO Auto-generated method stub
		return dao.getDiaryNumBy(nb);
	}
	public List<Diary> getDiaryBy(HashMap<String, String> map) {
		// TODO Auto-generated method stub
		return dao.getDiaryBy(map);
	}
	public List<HashMap<String,Object>> getBeforeAndNextId(Map<String,Object> map){
		return dao.getBeforeAndNextId(map);
	}
	public void editDiary(NoteBook nb){
		dao.editDiary(nb);
	}
	//11-30判断当天是否已生成过
	public Integer ifHasGen(String day,String author){
		return dao.ifHasGen(day, author);
	}
	//得到随机生成的对应日记
	public List<HashMap<String, Object>> getDiaryByTable(String table){
		return dao.getDiaryByTable(table);
	}
	//插入对应日记，并在对应表置为已使用过
	public void alterUseStatus(String table,String time,String id){
		dao.alterUseStatus(table, time, id);
	}
	//12-25随机推荐n篇日记
	public List<Diary> randomRecommend(String ids){
		return dao.randomRecommend(ids);
	}
	//12-26关注的人的最新n篇日记
	public List<Diary> noticeUserDiary(String user,Integer n){
		return dao.noticeUserDiary(user,n);
	}
	/**
	 * 	日记表互动数量控制器
	 * 2020-06-07
	 * @param diaryId
	 * @param which 日记阅读量0，评论1，赞2，收藏3
	 * @param type type=0->减1，type=1->加1
	 */
	public void alterTypeNum(String diaryId,int which,int type){
		dao.alterTypeNum(diaryId,which, type);
	}
	
	public BaseResult spideLapuda(int id){
    	BaseResult result=new BaseResult<>();
    	if(StringUtils.isEmpty(id+"")){
    		result.setCode(100);
    		result.setMessage("待爬取的日记id不能为空");
    		return result;
    	}
    	HashMap<String, String> map=SpideLapuda.spideLapuda(id);
    	String time=map.get("time").substring(0, 10);
    	if(!time.equals(TimeUtil.getToday())){
    		result.setCode(100);
    		result.setMessage("不是当日的日记");
    		return result;
    	}
    	NoteBook nb=new NoteBook();
    	nb.setNWritter("65313340");
    	nb.setNType(0);
    	nb.setNTitle(map.get("title"));
    	nb.setNContent(map.get("content"));
    	nb.setNTime(map.get("time").substring(0, 10)+" "+TimeUtil.genRandomTime(0));
    	nb.setNLocation("兔子窝");
    	nb.setNWeather(0);
    	nb.setNMood(0);
    	nb.setNAllowComment(0);
    	nb.setNAuthority(0);
    	nb.setnTop(0);
    	nb.setnUserTop(0);
    	addNote(nb);
    	result.setCode(200);
    	result.setMessage("爬取庆兔兔日记成功");
    	result.setResult(map.get("title"));
    	return result;
    }
	public void genDiary(int poem,int song){
//		int num1=ifHasGen(TimeUtil.getToday(), "65313340");
//		System.out.print("开始获取庆兔兔日记->");
//    	if(num1==0){//庆兔兔日记今日未爬取过
//    		int diaryId=0;
//    		System.out.print("今日未爬取过->");
//    		for(int i=0;i<4;i++){
//    			System.out.print("开始获取id->");
//    			diaryId=SpideLapuda.spideIndex(i);//从首页获取庆兔兔日记id
//    			if(diaryId!=0){
//    				System.out.println("id:"+diaryId);
//    	    		spideLapuda(diaryId);
//    				break;
//    			}
//    		}
//    	}
    	
    	int num=ifHasGen(TimeUtil.getToday(), "66666666");
    	if(num>0){//古诗网今日已生成过
        	System.out.println("古诗网今日已生成过");
    		return;
    	}
    	int machines[]={66666666,88888888};
		for(int account:machines){
			System.out.println(">>>>>>>>>>>>>将生成用户"+account+"的日记");
			String table="poem";
			String idd="";//日记在原本数据表中的ID，方便修改状态为“已使用”状态
			HashMap<String, Object> map=null;
			if(account==88888888){
				table="song";
				//首先看预约表中是否有数据
				List<HashMap<String, Object>> bsongs=bss.getBookSongBy(null, TimeUtil.getYesterday());//昨天预约的歌曲
				if(bsongs!=null&&bsongs.size()>0){//昨天有用户预约，从中随机选择一首歌曲
					System.out.println("【预约点歌】>>>>>>>>>>>>>歌词网"+account+"用户预约的内容数量为"+bsongs.size());
					int i=new Random().nextInt(bsongs.size());
					System.out.println("【预约点歌】>>>>>>>>>>>>>用户"+account+"今日将被使用的预约内容的序号为"+i);
					map=bsongs.get(i);
				}else{
					List<HashMap<String, Object>> list=getDiaryByTable(table);
					System.out.println(">>>>>>>>>>>>>用户"+account+"未被使用的内容数量为"+list.size());
					int i=new Random().nextInt(list.size());
					System.out.println(">>>>>>>>>>>>>用户"+account+"今日将被使用的内容的序号为"+i);
					map=list.get(i);
				}
			}else{
				List<HashMap<String, Object>> list=getDiaryByTable(table);
				System.out.println(">>>>>>>>>>>>>用户"+account+"未被使用的内容数量为"+list.size());
				int i=new Random().nextInt(list.size());
				System.out.println(">>>>>>>>>>>>>用户"+account+"今日将被使用的内容的序号为"+i);
				map=list.get(i);
			}
			
			NoteBook nb=new NoteBook();
			nb.setNWritter(account+"");
			nb.setNTime(TimeUtil.getToday()+" "+Calendar.HOUR+":"+TimeUtil.genRandomTime(1));//2020-09-05用回随机时间
//			nb.setNTime(TimeUtil.time());//2020-03-16取消使用随机时间
			nb.setNAuthority(0);//所有人可见
			nb.setNType(3);
			nb.setNAllowComment(0);//允许评论
			nb.setNWeather(0);
			nb.setNMood(0);
			nb.setnTop(0);
			nb.setnUserTop(0);
//			System.out.println(">>>>>>>>>>>>>用户"+account+"今日被使用的内容的实体为"+new Gson().toJson(map));
			if(account==88888888){//歌曲
				String bookUserName="";//2021-01-16点歌的用户
				if(StringUtils.isNotEmpty(map.get("userName")+"")&&!"null".equals(map.get("userName")+"")){
					bookUserName="【由"+map.get("userName")+"点播】";
				}
				
				nb.setNTitle(map.get("songName")+"-"+map.get("singer")+bookUserName);
				nb.setNContent("<p style='text-align: center;'>"+map.get("lyric")+"</p>");
				nb.setnSongId(map.get("sourceId")+"");
				nb.setNLocation("河南省平顶山市");
				idd=map.get("id")+"";
			}else{//古诗
				nb.setNTitle(map.get("p_Name")+"-"+map.get("p_Poet"));
				nb.setNContent(map.get("p_PoemCons")+"");
				nb.setNLocation("河南省邓州市");
				idd=map.get("p_Id")+"";
			}
			addNote(nb);//插入笔记
			//修改使用状态，万万不可用i
			alterUseStatus(table, TimeUtil.time(), idd);
	    	System.out.println(">>>>>>>>>>>>>已生成今日"+account+"的日记为第"+idd);

		}
	}
	/**
	 * @desc 获取音频日记
	 * @Author dora
	 * @time 2020年9月5日 下午9:20:58
	 * @param page
	 * @return
	 */
	public List<Diary> getAudioDiary(HashMap<String, Object> map) {
		//每页十篇
		return dao.getAudioDiary(map);
	}
	public void cancelTop(){
		dao.cancelTop();
	}
	public List<Diary> getAudioByIds(String ids) {
		return dao.getAudioByIds(ids);
	}
}

