package com.longbro.doranote.util;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/**
* @desc 借助于String或StringBuilder来输出文件流
* @author dora
* @date 2020年9月18日
* @time 下午5:23:48
*/
public class GetPath {
  static StringBuilder sb=new StringBuilder();
  static String str="";
  public static void main(String[] args) throws IOException {
    // TODO Auto-generated method stub
    String path="D:\\alc202007031\\lcfex-mortgageBusiness\\src\\main\\java\\com";
    File file=new File(path);

//    listFile(file);
    
    str=new String("".getBytes(),"utf-8");
    listFile1(file);
    
    File file1=new File(path+"/path4.txt");
    FileWriter fos=new FileWriter(file1);
    fos.write(str);
    
//    fos.write(sb.toString());
  }
  /**
   * @desc 使用StringBuilder
   * @author dora
   * @date 2020年9月18日
   * @time 下午5:24:42
   */
  public static void listFile(File file) throws IOException {
    if(file.isDirectory()) {
      File subFile[]=file.listFiles();
      for(File f :subFile) {
        if (f.isDirectory()) {
          listFile(f);
        }else {
          System.out.println(f.getAbsolutePath());
          sb.append(f.getAbsolutePath()+"\r");
        }
      }
    }else {
      System.out.println(file.getAbsolutePath());
      sb.append(file.getAbsolutePath()+"\r");
    }
  }
  /**
   * @desc 使用String
   * @author dora
   * @date 2020年9月18日
   * @time 下午5:25:01
   */
  public static void listFile1(File file) throws IOException {
    if(file.isDirectory()) {
      File subFile[]=file.listFiles();
      for(File f :subFile) {
        if (f.isDirectory()) {
          listFile1(f);
        }else {
//          System.out.println(f.getAbsolutePath());
          str+=f.getAbsolutePath()+"\r";
        }
      }
    }else {
//      System.out.println(file.getAbsolutePath());
      str+=file.getAbsolutePath()+"\r";
    }
  }


}
