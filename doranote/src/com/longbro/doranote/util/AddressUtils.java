package com.longbro.doranote.util;

import java.io.BufferedReader;  
import java.io.DataOutputStream;  
import java.io.IOException;  
import java.io.InputStreamReader;  
import java.io.UnsupportedEncodingException;  
import java.net.HttpURLConnection;  
import java.net.InetAddress;
import java.net.URL;  
import java.net.UnknownHostException;

import javax.servlet.http.HttpServletRequest;
  
/** 
 * 根据IP地址获取详细的地域信息 
 * 淘宝API : http://ip.taobao.com/service/getIpInfo.php?ip=218.192.3.42 
 * 新浪API : http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=218.192.3.42 
 * @File AddressUtils.java 
 * @Package org.gditc.weicommunity.util 
 * @Description TODO 
 * @Copyright Copyright © 2014 
 * @Site https://github.com/Cryhelyxx 
 * @Blog http://blog.csdn.net/Cryhelyxx 
 * @Email cryhelyxx@gmail.com 
 * @Company GDITC 
 * @Date 2014年11月6日 下午1:46:37 
 * @author Cryhelyxx 
 * @version 1.0 
 */  
public class AddressUtils {
	/**
	 * 	获取客户端的IP地址
	 * @param request
	 */
	public static String getIp(HttpServletRequest request) {
		String l_Ip=request.getHeader("x-forwarded-for");
		if(l_Ip==null||l_Ip.length()==0){
		   l_Ip=request.getHeader("Proxy-Client-IP");
		}if(l_Ip==null||l_Ip.length()==0||"unknown".equalsIgnoreCase(l_Ip)){
		    l_Ip=request.getHeader("WL-Proxy-Client-IP");
		}if(l_Ip==null||l_Ip.length()==0||"unknown".equalsIgnoreCase(l_Ip)){
		    l_Ip=request.getRemoteAddr();
		    if(l_Ip.equals("127.0.0.1") ||l_Ip.equals("0:0:0:0:0:0:0:1")){
			    //根据网卡取本机配置的IP
			    InetAddress in=null;
			    try {
					in=InetAddress.getLocalHost();
				} catch (UnknownHostException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			    l_Ip=in.getHostAddress();//输出的为本机的IP为172.24.21.129，
			    //但是宿舍无线分配的IP为219.157.79.134手机热点分配的是223.104.105.248，而需要记录的正是这，而非本机 
		   }
		}
		return l_Ip;
	} 
    /** 
     *  
     * @param content 
     *            请求的参数 格式为：name=xxx&pwd=xxx 
     * @param encoding 
     *            服务器端请求编码。如GBK,UTF-8等 
     * @return 
     * @throws UnsupportedEncodingException 
     */  
    public static String getAddresses(String content, String encodingString)  
            throws UnsupportedEncodingException {  
        // 这里调用淘宝API  
        String urlStr = "http://ip.taobao.com/service/getIpInfo.php";  
        // 从http://whois.pconline.com.cn取得IP所在的省市区信息  
        String returnStr = getResult(urlStr, content, encodingString);  
        if (returnStr != null) {  
            // 处理返回的省市区信息  
            System.out.println("(1) unicode转换成中文前的returnStr : " + returnStr);  
            returnStr = decodeUnicode(returnStr);  
            System.out.println("(2) unicode转换成中文后的returnStr : " + returnStr);  
            String[] temp = returnStr.split(",");  
            if(temp.length<3){  
                return "0";//无效IP，局域网测试  
            }  
            return returnStr;  
        }  
        return null;  
    }  
    /** 
     * @param urlStr 
     *            请求的地址 
     * @param content 
     *            请求的参数 格式为：name=xxx&pwd=xxx 
     * @param encoding 
     *            服务器端请求编码。如GBK,UTF-8等 
     * @return 
     */  
    private static String getResult(String urlStr, String content, String encoding) {  
        URL url = null;  
        HttpURLConnection connection = null;  
        try {  
            url = new URL(urlStr);  
            connection = (HttpURLConnection) url.openConnection();// 新建连接实例  
            connection.setConnectTimeout(5000);// 设置连接超时时间，单位毫秒  
            connection.setReadTimeout(5000);// 设置读取数据超时时间，单位毫秒  
            connection.setDoOutput(true);// 是否打开输出流 true|false  
            connection.setDoInput(true);// 是否打开输入流true|false  
            connection.setRequestMethod("POST");// 提交方法POST|GET  
            connection.setUseCaches(false);// 是否缓存true|false  
            connection.connect();// 打开连接端口  
//            System.out.println(connection.getResponseCode());
//            if(connection.getResponseCode()==200){
        	DataOutputStream out = new DataOutputStream(connection  
                        .getOutputStream());// 打开输出流往对端服务器写数据  
            out.writeBytes(content);// 写数据,也就是提交你的表单 name=xxx&pwd=xxx  
            out.flush();// 刷新  
            out.close();// 关闭输出流  
            BufferedReader reader = new BufferedReader(new InputStreamReader(  
                        connection.getInputStream(), encoding));// 往对端写完数据对端服务器返回数据  
                // ,以BufferedReader流来读取  
            StringBuffer buffer = new StringBuffer();  
            String line = "";  
            while ((line = reader.readLine()) != null) {  
                buffer.append(line);  
            }  
            reader.close();  
            return buffer.toString();  
//            }
            
        } catch (IOException e) {  
            
        } finally {  
            if (connection != null) {  
                connection.disconnect();// 关闭连接  
            }  
        }  
        return "";  
    }  
    /** 
     * unicode 转换成 中文 
     *  
     * @author fanhui 2007-3-15 
     * @param theString 
     * @return 
     */  
    public static String decodeUnicode(String theString) {  
        char aChar;  
        int len = theString.length();  
        StringBuffer outBuffer = new StringBuffer(len);  
        for (int x = 0; x < len;) {  
            aChar = theString.charAt(x++);  
            if (aChar == '\\') {  
                aChar = theString.charAt(x++);  
                if (aChar == 'u') {  
                    int value = 0;  
                    for (int i = 0; i < 4; i++) {  
                        aChar = theString.charAt(x++);  
                        switch (aChar) {  
                        case '0':  
                        case '1':  
                        case '2':  
                        case '3':  
                        case '4':  
                        case '5':  
                        case '6':  
                        case '7':  
                        case '8':  
                        case '9':  
                            value = (value << 4) + aChar - '0';  
                            break;  
                        case 'a':  
                        case 'b':  
                        case 'c':  
                        case 'd':  
                        case 'e':  
                        case 'f':  
                            value = (value << 4) + 10 + aChar - 'a';  
                            break;  
                        case 'A':  
                        case 'B':  
                        case 'C':  
                        case 'D':  
                        case 'E':  
                        case 'F':  
                            value = (value << 4) + 10 + aChar - 'A';  
                            break;  
                        default:  
                            throw new IllegalArgumentException(  
                                    "Malformed      encoding.");  
                        }  
                    }  
                    outBuffer.append((char) value);  
                } else {  
                    if (aChar == 't') {  
                        aChar = '\t';  
                    } else if (aChar == 'r') {  
                        aChar = '\r';  
                    } else if (aChar == 'n') {  
                        aChar = '\n';  
                    } else if (aChar == 'f') {  
                        aChar = '\f';  
                    }  
                    outBuffer.append(aChar);  
                }  
            } else {  
                outBuffer.append(aChar);  
            }  
        }  
        return outBuffer.toString();  
    }  
    /**
     *  
     * @param ip 
     * @return 返回该ip对应的地址
     */
    public static String getAddByIp(String ip) {  
        // 测试ip 219.136.134.157 中国=华南=广东省=广州市=越秀区=电信 
        //122.49.20.247北京
        //ip11=219.157.76.138;平顶山ip12=223.104.105.151,ip13=223.104.105.151;郑州ip14=117.136.104.66中国
        //ip15=115.57.145.154;郑州ip16=117.136.36.247郑州
        //ip21=61.158.149.35;郑州
        String address = "";  
        try {  
            address = AddressUtils.getAddresses("ip="+ip, "utf-8");  
        } catch (UnsupportedEncodingException e) {  
            // TODO Auto-generated catch block  
            address="0"; 
        }  
        System.out.println(address);  
        if(!address.equals("0")){
        	String country=address.substring(address.indexOf("country")+10, address.indexOf("area")-3);
            String province=address.substring(address.indexOf("region")+9, address.indexOf("city")-3);
            String city=address.substring(address.indexOf("city")+7, address.indexOf("county")-3);
            String county=address.substring(address.indexOf("county")+9, address.indexOf("isp")-3);
            if(country.contains("X")){
            	//System.out.println("127.0.0.1");
            	return "127.0.0.1";
            }
            else if(province.contains("X")){
//                System.out.println(country);
                return country;
            }else if(city.contains("X")){
//                System.out.println(country+province);
                return country+province;
            }else if(county.contains("X")){
//                System.out.println(country+province+city);
                return country+province+city;
            }else{
//            	System.out.println(country+province+city+county);
            	return country+province+city+county;
            }
        }
        return null;

    }
    public static void main(String[] args) {
		String add=getAddByIp("61.158.149.35");
	}
}  
