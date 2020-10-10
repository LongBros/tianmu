package com.longbro.doranote.bean;

public class Books {
	private int BId;
	private int BBookid;
	private int scale;
	private int BType;
	private String BWriter;
	private String BDescription;
	private String BCover;
	private int diaryNum;
	private String BTime;
	public int getBId() {
		return BId;
	}
	public void setBId(int bId) {
		BId = bId;
	}
	public int getBBookid() {
		return BBookid;
	}
	public void setBBookid(int bBookid) {
		BBookid = bBookid;
	}
	
	public int getScale() {
		return scale;
	}
	public void setScale(int scale) {
		this.scale = scale;
	}
	public int getBType() {
		return BType;
	}
	public void setBType(int bType) {
		BType = bType;
	}
	public String getBWriter() {
		return BWriter;
	}
	public void setBWriter(String bWriter) {
		BWriter = bWriter;
	}
	public String getBDescription() {
		return BDescription;
	}
	public void setBDescription(String bDescription) {
		BDescription = bDescription;
	}
	public String getBCover() {
		return BCover;
	}
	public void setBCover(String bCover) {
		BCover = bCover;
	}
	
	public int getDiaryNum() {
		return diaryNum;
	}
	public void setDiaryNum(int diaryNum) {
		this.diaryNum = diaryNum;
	}
	public String getBTime() {
		return BTime;
	}
	public void setBTime(String bTime) {
		BTime = bTime;
	}
	
}
