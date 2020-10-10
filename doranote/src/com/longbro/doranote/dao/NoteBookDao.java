package com.longbro.doranote.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.longbro.doranote.bean.Diary;
import com.longbro.doranote.bean.NoteBook;
/**
 * 描述：笔记本 DAO接口
 * 作者:longbro
 * 日期:2019-10-09 21:11:32
 * 版权：多啦学娱网络科技有限公司
 */
@Repository
public class NoteBookDao extends BaseDao{
	private String pre="com.longbro.doranote.bean.NoteBook.";
	public void addNote(NoteBook nb) {
		// TODO Auto-generated method stub
		this.insert(pre+"create", nb);
	}
	public List<NoteBook> getDiaryByPage(int page) {
		//每页十篇
		return (List<NoteBook>)this.selectList(pre+"getDiaryByPage", (page-1)*10);
	}
	public NoteBook getDiaryById(int id) {
		// TODO Auto-generated method stub
		return (NoteBook)this.selectOne(pre+"get", id);
	}
	public int getDiaryNumBy(NoteBook nb) {
		// TODO Auto-generated method stub
		return (Integer)this.selectOne(pre+"getDiaryNumBy", nb);
	}
	public List<Diary> getDiaryBy(HashMap<String, String> map) {
		// TODO Auto-generated method stub
		return (List<Diary>)this.selectList(pre+"getDiaryBy", map);
	}
	public List<HashMap<String,Object>> getBeforeAndNextId(Map<String,Object> map){
		return (List<HashMap<String,Object>>)this.selectList(pre+"getBeforeAndNextId", map);
	}
	//2019-11-24编辑日记
	public void editDiary(NoteBook nb){
		this.update(pre+"update", nb);
	}
//	11-30判断当天是否已生成过
	public Integer ifHasGen(String day,String author){
		HashMap<String, String> map=new HashMap<>();
		map.put("day",day);
		map.put("account", author);
		return (Integer)this.selectOne(pre+"ifHasGen",map);
	}
	//得到某表所有未被使用过的
	public List<HashMap<String, Object>> getDiaryByTable(String tables){
		return (List<HashMap<String, Object>>)this.selectList(pre+"getDiaryByTable", tables);
	}
	public void alterUseStatus(String table,String time,String id){
		HashMap<String, String> map=new HashMap<>();
		map.put("tables",table);
		map.put("time", time);
		map.put("id", id+"");
		this.update(pre+"alterUseStatus", map);
	}
	//12-25随机推荐n篇日记
	public List<Diary> randomRecommend(String ids){
		return this.selectList(pre+"randomRecommend",ids);
	}
	//12-26关注的人的最新n篇日记
	public List<Diary> noticeUserDiary(String user,Integer n){
		HashMap<String, Object> map=new HashMap<>();
		map.put("user", user);
		map.put("n", n);
		return this.selectList(pre+"noticeUserDiary",map);
	}
	/**
	 * 日记阅读量0，评论1，赞2，收藏3	加1
	 * 2020-06-07
	 * @param diaryId
	 * @param type
	 */
	public void alterTypeNum(String diaryId,int which,int type){
		HashMap<String, Object> map=new HashMap<>();
		map.put("diaryId", diaryId);
		map.put("which", which);//
		map.put("type", type);//0为减一，1为加1
		this.update(pre+"alterTypeNum", map);
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
		return (List<Diary>)this.selectList(pre+"getAudioDiary",map);
	}
	public void cancelTop(){
		this.update("cancelTop", null);
	}
	public List<Diary> getAudioByIds(String ids) {
		//每页十篇
		return (List<Diary>)this.selectList(pre+"getAudioByIds",ids);
	}
}

