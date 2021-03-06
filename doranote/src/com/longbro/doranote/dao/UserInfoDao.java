package com.longbro.doranote.dao;

import java.util.HashMap;
import java.util.List;

import com.google.gson.Gson;
import com.longbro.doranote.bean.Author;
import com.longbro.doranote.bean.UserInfo;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;
/**
 * 描述：d_user_info 
 * 作者:longbro
 * 日期:2019-10-26 13:06:58
 * 版权：多啦学娱网络科技有限公司
 */
@Repository
public class UserInfoDao extends BaseDao<UserInfo>{

	public String getNamespace() {
		return UserInfo.class.getName();
	}
	public Author get(int UUserId) {
		return (Author)this.selectOne(getNamespace()+".get", UUserId);
	}
	public void create(UserInfo bean) {
		this.insert(getNamespace()+".create", bean);
	}
	public void update(UserInfo bean) {
		this.update(getNamespace()+".update", bean);
	}
	public UserInfo loginNote(String acc,String pass){
		HashMap<String,String> map=new HashMap<>();
		map.put("acc", acc);
		map.put("pass", pass);
		System.out.println(">>>>>>>>>>登录信息："+new Gson().toJson(map));

		return (UserInfo)this.selectOne(getNamespace()+".loginNote", map);
	}
	//2019-11-16查询用户未读的被赞、评论、、、数量
	public List<HashMap<String, Object>> queryUnReadNum(String userId){
		return (List<HashMap<String, Object>>)this.selectList("queryUnReadNum",userId);
	}
	//2019-11-16查询某用户或所有用户的互动信息
	public List<HashMap<String, Object>> queryInteractNum(String userId){
		return (List<HashMap<String, Object>>)this.selectList("queryInteractNum",userId);
	}
	//2019-12-06查询用户数、日记数量的统计信息
	public HashMap<String,String> getStatisticInfo(){
		return (HashMap<String,String>)this.selectOne("getStatisticInfo",null);
	}
	
	public List<UserInfo> randomRecommend(){
		return null;
	}
//	@Select("SELECT * FROM d_user_info WHERE u_Born_Time LIKE concat('%',#{day},'%')")
	public List<UserInfo> getBirthDayUser(@Param("day") String day){
		return (List<UserInfo>)this.selectList(getNamespace()+".getBirthDayUser",day);
	}
}

