package com.longbro.doranote.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.log4j.Logger;

import com.mysql.jdbc.PreparedStatement;

public class JdbcUtil {
	private static Logger logger= Logger.getLogger(JdbcUtil.class);
	static Connection conn=null;
	static Statement st=null;
	static PreparedStatement ps=null;
	static ResultSet rs=null;
//	static{
		static final String driver="com.mysql.jdbc.Driver";
		static final String url="jdbc:mysql://localhost:3306/dora_web_longbro?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC";
		static final String user="root";
		static final String pass="ZCLZY";
//	}
	public static Connection openConnection() throws SQLException{
		if(conn==null||conn.isClosed()){
			try {
				Class.forName(driver);
				conn=DriverManager.getConnection(url,user,pass);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return conn;
	}
	public static void closeConnection(){
		if(conn!=null){
			try {
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	public static void insertOrUpdate(String insertSql){
		try {
			conn=openConnection();
			st=conn.createStatement();
			st.execute(insertSql);
			logger.info("插入成功");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
//				st.close();
//				conn.close();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}
	public static ResultSet select(String selectSql){
		try {
			conn=openConnection();
			st=conn.createStatement();
			rs=st.executeQuery(selectSql);
			logger.info("查询成功");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
//				st.close();
//				conn.close();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return rs;

	}
}
