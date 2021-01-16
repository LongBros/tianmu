package com.longbro.doranote.bean;
/**
 *  
 * 描述：点歌台预约点歌表实体类定义
 * 作者：longbro
 * 邮箱: 1459892910@qq.com
 * 日期:2021-01-16 13:10:37
 * 版权：哆啦学娱网络科技有限公司
 * </pre>
 */
public class BookSong{

	protected Integer BId;

	protected Integer BUserId; //预约点歌的用户id
	protected Integer BSongId; //被点的歌曲id
	protected String BBookTime; //预约时间
	protected String BBookDevice; //预约者所用设备
	
	
	public Integer getBId() {
		return this.BId;
	}
	public void setBId(Integer aValue) {
		this.BId = aValue;
	}
	public void setBUserId(Integer BUserId) {
		this.BUserId = BUserId;
	}
	
	/**
	 * 返回 预约点歌的用户id
	 * @return
	 */
	public Integer getBUserId() {
		return this.BUserId;
	}
	public void setBSongId(Integer BSongId) {
		this.BSongId = BSongId;
	}
	
	/**
	 * 返回 被点的歌曲id
	 * @return
	 */
	public Integer getBSongId() {
		return this.BSongId;
	}
	public void setBBookTime(String BBookTime) {
		this.BBookTime = BBookTime;
	}
	
	/**
	 * 返回 预约时间
	 * @return
	 */
	public String getBBookTime() {
		return this.BBookTime;
	}
	public void setBBookDevice(String BBookDevice) {
		this.BBookDevice = BBookDevice;
	}
	
	/**
	 * 返回 预约者所用设备
	 * @return
	 */
	public String getBBookDevice() {
		return this.BBookDevice;
	}
	
}



