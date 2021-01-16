package com.longbro.doranote.controller;
import java.awt.Color;
import java.awt.Font;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.Gson;
import com.longbro.doranote.BaseResult;
import com.longbro.doranote.bean.Diary;
import com.longbro.doranote.bean.NoteBook;
import com.longbro.doranote.service.NoteBookService;
import com.longbro.doranote.spider.SpideLapuda;
import com.longbro.doranote.spider.SpideWechat;
import com.longbro.doranote.util.FileProduce;
import com.longbro.doranote.util.ImageProduce;
import com.longbro.doranote.util.JdbcUtil;
import com.longbro.doranote.util.NumberUtil;
import com.longbro.doranote.util.Strings;
import com.longbro.doranote.util.TimeUtil;

/**
 * 笔记本控制器
 * @author longbro
 * @date 2019-10-09 21:11:32
 * @copyright 多啦学娱网络科技有限公司
 */
@Controller
@RequestMapping("note/diary/")
public class NoteBookController{
    @Autowired
    NoteBookService noteBookService;
    private Logger logger=Logger.getLogger(NoteBookController.class);
//    private String last=null;
    
    /**
     * @desc 1.写日记或编辑日记
     * @author zcl
     * @date 2019年10月19日&11-24
     * @param req
     * @param nb
     */
    @RequestMapping(value="addOrEditNote",method=RequestMethod.POST)
    @ResponseBody
    public BaseResult addOrEditNote(NoteBook nb){
    	BaseResult result=new BaseResult<>();
    	logger.info("id:"+nb.getNId());
    	if(nb.getNId()==0){//无id时新增
    		nb.setnTop(0);
    		nb.setnUserTop(0);
        	noteBookService.addNote(nb);
        	result.setMessage("日记发布成功，请勿重复提交");
        	logger.info("日记发布成功");
    	}else{
        	nb.setUpdateTime(TimeUtil.time());
        	noteBookService.editDiary(nb);
        	result.setMessage("日记修改成功，请勿重复提交");
        	logger.info("日记修改成功");
    	}
    	result.setCode(200);
    	return result;
    }
    /**
     * @desc 2.分页加载笔记(弃用，使用5)
     * @author zcl
     * @date 2019年10月13日
     * @param page
     */
    @RequestMapping(value="getDiaryByPage",method=RequestMethod.GET)
    @ResponseBody
    public List<NoteBook> getDiaryByPage(int page){
    	logger.info("开始加载第"+page+"页的笔记");
    	return noteBookService.getDiaryByPage(page);
    }
    /**
     * @desc 3.加载某日记
     * @author zcl
     * @date 2019年10月13日
     * @param id
     * @return
     */
    @RequestMapping(value="getDiaryById",method=RequestMethod.GET)
    @ResponseBody
    public NoteBook getDiaryById(int id){
    	logger.info("开始加载id为："+id+"的笔记");
    	return noteBookService.getDiaryById(id);
    }
    /**
     * @desc 4.根据……获取对应日记数量，比如时间、分类、作者、、
     * @author zcl
     * @date 2019年10月19日
     * @return
     */
    @RequestMapping(value="getDiaryNumBy",method=RequestMethod.GET)
    @ResponseBody
    public int getDiaryNumBy(NoteBook diary){
    	logger.info("开始获取指定笔记数量");
    	return noteBookService.getDiaryNumBy(diary);
    }
    /**
     * @desc 5.根据……加载日记，例如:作者，分类，心情等
     * @author zcl
     * @date 2019年10月19日
     * @param diary
     * @return
     */
    @RequestMapping(value="getDiaryBy",method=RequestMethod.GET)
    @ResponseBody
    public List<Diary> getDiaryBy(HttpServletRequest request){
    	//2020-08-30 换用定时器方式来生成
//    	SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
//    	String now=sdf.format(new Date());
//    	logger.info("当前时间："+now+",上次时间："+last);
//    	if(last==null||!now.equals(last)){
//    		last=now;
//        	genDiary(0,0);//生成歌词网和古诗网的日记
//    	}
    	
    	logger.info("开始加载笔记");
    	int per=10;
    	HashMap<String, String> map=new HashMap<>();
    	if(StringUtils.isNotEmpty(request.getParameter("author")))
    		map.put("author", request.getParameter("author"));
    	if(StringUtils.isNotEmpty(request.getParameter("time"))){
    		int time=Integer.parseInt(request.getParameter("time"));
    		if(time==1){//加载昨日的日记
        		map.put("time", TimeUtil.getYesterday());
    		}
    	}
    	if(StringUtils.isNotEmpty(request.getParameter("perPage")))
    	{
    		map.put("perPage", request.getParameter("perPage"));
    		per=Integer.parseInt(request.getParameter("perPage"));
    	}
    	if(StringUtils.isNotEmpty(request.getParameter("authority")))
    		map.put("authority", request.getParameter("authority"));
    	if(StringUtils.isNotEmpty(request.getParameter("page")))
    		map.put("page", (Integer.parseInt(request.getParameter("page"))-1)*per+"");
    	//12-05新增，黑名单功能使用
    	if(StringUtils.isNotEmpty(request.getParameter("user")))
    		map.put("user", request.getParameter("user"));
    	if(StringUtils.isNotEmpty(request.getParameter("bookId")))
    		map.put("NBookid", request.getParameter("bookId"));
    	logger.info("-------->查询日记列表所传参数:"+new Gson().toJson(map));
    	return noteBookService.getDiaryBy(map);
    }
    /**
     * @desc 6.得到和当前日记同作者的上一篇和下一篇日记的ID
     * @author zcl
     * @date 2019年11月3日
     * @param id	当前日记id
     * @param author当前日记的作者
     * @param user根据当前登录用户是否为空来判定是否可查看未登录用户不能看的日记
     */
    @RequestMapping(value="getBeforeAndNextId",method=RequestMethod.GET)
    @ResponseBody
    public List<HashMap<String,Object>> getBeforeAndNextId(int id,String author,String user){
    	logger.info("开始查询当前笔记的上下篇");
    	Map<String,Object> map=new HashMap<>();
		map.put("author", author);
		map.put("id", id);
		String authority="0";
		if(StringUtils.isNotEmpty(user)){//登录用户
			authority="0,2";
			if(author.equals(user)){
				authority="0,1,2";
			}
		}
		map.put("authority", authority);
    	return noteBookService.getBeforeAndNextId(map);
    }
    /**
     * @desc 7.每天随机生成歌词网和古诗网的日记，爬取庆兔兔日记
     * 01-05添加两参数，计划可以指定某个账号生成的日记。使不再随机
     * @author zcl
     * @date 2019年11月30日
     */
    @RequestMapping(value="genDiary",method=RequestMethod.GET)
    @ResponseBody
    public void genDiary(int poem,int song){
    	noteBookService.genDiary(poem, song);
    }
    public void genDiary1(int poem,int song){
    	//凌晨3~6点前及十一点后不执行该方法
    	int hour=TimeUtil.getNowHour();
		if(hour>11||(hour>3&&hour<6)){
			return;
    	}
    	int num1=noteBookService.ifHasGen(TimeUtil.getToday(), "65313340");
    	if(num1==0){//庆兔兔日记今日未爬取过
    		int diaryId=0;
    		for(int i=0;i<4;i++){
    			diaryId=SpideLapuda.spideIndex(i);//从首页获取庆兔兔日记id
    			if(diaryId!=0){
    	    		spideLapuda(diaryId);
    				break;
    			}
    		}
    	}
    	
    	int num=noteBookService.ifHasGen(TimeUtil.getToday(), "66666666");
    	if(num>0){//古诗网今日已生成过
    		logger.info("今日已生成过");
    		return;
    	}
    	int machines[]={66666666,88888888};
		for(int account:machines){
			System.out.println(">>>>>>>>>>>>>将生成用户"+account+"的日记");
			String table="poem";
			String idd="";//日记在原本数据表中的ID，方便修改状态为“已使用”状态
			if(account==88888888){
				table="song";
			}
			HashMap<String, Object> map=null;
			if(poem==0&&account==66666666){//未指定则随机
				List<HashMap<String, Object>> list=noteBookService.getDiaryByTable(table);
				logger.info(">>>>>>>>>>>>>用户"+account+"未被使用的内容数量为"+list.size());
				int i=new Random().nextInt(list.size());
				logger.info(">>>>>>>>>>>>>用户"+account+"今日将被使用的内容的序号为"+i);
				map=list.get(i);
			}else if(song==0&&account==88888888){//未指定则随机
				List<HashMap<String, Object>> list=noteBookService.getDiaryByTable(table);
				logger.info(">>>>>>>>>>>>>用户"+account+"未被使用的内容数量为"+list.size());
				int i=new Random().nextInt(list.size());
				logger.info(">>>>>>>>>>>>>用户"+account+"今日将被使用的内容的序号为"+i);
				map=list.get(i);
			}else{
				
			}
			
			NoteBook nb=new NoteBook();
			nb.setNWritter(account+"");
			nb.setNTime(TimeUtil.getToday()+" "+TimeUtil.genRandomTime(0));
			nb.setNAuthority(0);//所有人可见
			nb.setNType(3);
			nb.setNAllowComment(0);//允许评论
			nb.setNWeather(0);
			nb.setNMood(0);
			nb.setnTop(0);
			nb.setnUserTop(0);
			logger.info(">>>>>>>>>>>>>用户"+account+"今日被使用的内容的实体为"+new Gson().toJson(map));
			if(account==88888888){//歌曲
				nb.setNTitle(map.get("songName")+"-"+map.get("singer"));
				nb.setNContent(map.get("lyric")+"");
				nb.setnSongId(map.get("sourceId")+"");
				nb.setNLocation("河南省平顶山市");
				idd=map.get("id")+"";
			}else{//古诗
				nb.setNTitle(map.get("p_Name")+"-"+map.get("p_Poet"));
				nb.setNContent(map.get("p_PoemCons")+"");
				nb.setNLocation("河南省邓州市");
				idd=map.get("p_Id")+"";
			}
			noteBookService.addNote(nb);//插入笔记
			//修改使用状态，万万不可用i
			noteBookService.alterUseStatus(table, TimeUtil.time(), idd);
			logger.info(">>>>>>>>>>>>>已生成今日"+account+"的日记为第"+idd);

		}
    }
    /**
     * 8.庆兔兔日记每日录入
     * @author LongBro
     * 2019年12月13日
     * 下午3:03:56
     * @param id
     */
    @RequestMapping(value="spideLapuda",method=RequestMethod.GET)
    @ResponseBody
    public BaseResult spideLapuda(int id){
    	BaseResult result=new BaseResult<>();
    	noteBookService.spideLapuda(id);
    	return result;
    }
    /**
     * @desc 9.随机推荐n篇日记
     * @author zcl
     * @date 2019年12月25日
     * @return
     */
    @RequestMapping(value="randomRecommend",method=RequestMethod.GET)
    @ResponseBody
    public BaseResult<List<Diary>> randomRecommend(int n){
    	BaseResult<List<Diary>> result=new BaseResult<>();
    	String s=Strings.genNumber(n, 6000);
    	List<Diary> list=noteBookService.randomRecommend(s);
    	result.setCode(200);
    	result.setMessage("已随机推荐"+n+"篇日记");
    	result.setResult(list);
    	return result;
    }
    /**
     * @desc 10.关注的人的最新n篇日记
     * @author zcl
     * @date 2019年12月26日
     * @return
     */
    @RequestMapping(value="noticeUserDiary",method=RequestMethod.GET)
    @ResponseBody
    public BaseResult<List<Diary>> noticeUserDiary(String user,int n){
    	BaseResult<List<Diary>> result=new BaseResult<>();
    	List<Diary> list=noteBookService.noticeUserDiary(user,n);
    	result.setCode(200);
    	result.setMessage("已加载你关注用户的"+n+"篇日记");
    	result.setResult(list);
    	return result;
    }
    /**
     * 11.上传图片
     * @param request
     * @param response
     * @param attachs
     * @return
     * @throws Exception
     */
    @RequestMapping(value={"uploadImage"}, method={RequestMethod.POST})
	  @ResponseBody
	  public BaseResult<List<HashMap<String, Object>>> uploadImage(HttpServletRequest request, HttpServletResponse response, @RequestParam(value="pic", required=false) MultipartFile[] attachs)
		throws Exception
	  {
		BaseResult<List<HashMap<String, Object>>> result = new BaseResult();
		response.setCharacterEncoding("utf-8");
		if (attachs.length == 0)
		{
		  result.setCode(100);
		  result.setMessage("");
		  return result;
		}
		String userId = "";
		userId = request.getParameter("userId");
//		String path = request.getSession().getServletContext()
//		  .getRealPath("image" + File.separator + "diary" + File.separator);
		String path =Strings.imgPath+"image/diary/";
		ArrayList<HashMap<String, Object>> list = new ArrayList();
		for (int i = 0; i < attachs.length; i++)
		{
		  HashMap<String, Object> map = new HashMap();
		  MultipartFile attach = attachs[i];
		  long fname = System.currentTimeMillis();
		  String prefix = FilenameUtils.getExtension(attach.getOriginalFilename());
		  int fileSize = 2097152;
		  if (attach.getSize() > fileSize)
		  {
			request.setAttribute("uploadFileError", "");
		  }
		  else if ((prefix.equalsIgnoreCase("jpg")) || (prefix.equalsIgnoreCase("png")) || (prefix.equalsIgnoreCase("jpeg")) || (prefix.equalsIgnoreCase("pneg")) || (prefix.equalsIgnoreCase("gif")))
		  {
			File file = new File(path, userId + "_" + fname + "_" + i + ".jpg");
			attach.transferTo(file);
			map.put("url", "http://img.duola.vip/image/diary/" + userId + "_" + fname + "_" + i + ".jpg");
			map.put("isImage", Boolean.valueOf(true));
			list.add(map);
		  }
		  else
		  {
			request.setAttribute("uploadFileError", "");
		  }
		}
		result.setCode(200);
		result.setMessage("");
		result.setResult(list);
		return result;
	  }
    /**
     * 12.给日记图片添加水印
     * @param imgurl
     * @param res
     * @throws IOException
     */
	 @RequestMapping({"markImage"})
	  @ResponseBody
	  public void markImage(String imgurl,HttpServletRequest req, HttpServletResponse res)
	    throws IOException{
		String type=req.getParameter("type");
		String filePath = Strings.imgPath+"image/diary/" + imgurl;
		 if(StringUtils.isNotEmpty(type)&&"acc".equals(type)){
			 filePath = Strings.imgPath+"image/acc/" + imgurl;
		 }
	    BufferedImage bi = ImageProduce.markText(filePath, "DoraWeb: www.duola.vip", new Font("宋体", 1, 36), Color.PINK, 30, 31);
	    
	    res.setContentType("image/jpeg");
	    
	    res.setDateHeader("expries", -1L);
	    res.setHeader("Cache-Control", "no-cache");
	    res.setHeader("Pragma", "no-cache");
	    ImageIO.write(bi, "jpg", res.getOutputStream());
	  }
	 /**
	  * 13.加载某用户发表过的图片
	  * @param userId
	  * @param page
	  * @return
	  */
	 @RequestMapping({"listAllPic"})
	  @ResponseBody
	  public BaseResult<ArrayList<String>> listAllPic(String userId, int page)
	  {
	    BaseResult<ArrayList<String>> result = new BaseResult();
	    if (StringUtils.isEmpty(page+"")) {
	      page = 1;
	    }
	    ArrayList<String> files = FileProduce.getAllFiles(userId, Strings.imgPath+"image/diary/");
	    if(files.size()<1){
	    	result.setResult(null);
		    result.setCode(200);
		    result.setMessage("" + userId + "无发布图片");
		    result.setNum(0);
		    return result;
	    }
	    result.setResult(files.subList(6 * (page - 1), 6 * page));
	    result.setCode(200);
	    result.setMessage("" + userId + "" + page + "");
	    result.setNum(files.size());
	    return result;
	  }
	 
	 /**
     * 14.上传音频
     * @param request
     * @param response
     * @param attachs
     * @return
     * @throws Exception
     */
    @RequestMapping(value={"uploadAudio"}, method={RequestMethod.POST})
	  @ResponseBody
	  public BaseResult<String> uploadAudio(HttpServletRequest request, HttpServletResponse response, @RequestParam(value="audio", required=false) MultipartFile attach)
		throws Exception
	  {
		BaseResult<String> result = new BaseResult();
		response.setCharacterEncoding("utf-8");
		
		String userId = "";
		userId = request.getParameter("userId");
		if(attach.isEmpty()){
			result.setCode(100);
			result.setMessage("无音频文件");
			return result;
		}
		String path=request.getSession().getServletContext().
				getRealPath("res"+File.separator+"audio"+File.separator);
		logger.debug("==========>"+path);
		long fname=System.currentTimeMillis();
		String prefix=FilenameUtils.getExtension(attach.getOriginalFilename());
		logger.debug("==========>"+prefix);
		int fileSize=11*1024*1024;
		if(attach.getSize()>fileSize){//限制上传大小为2兆内的图片
			result.setCode(100);
			result.setMessage("音频文件过大");
			return result;
		}else{
			//if(prefix.equalsIgnoreCase("mp3")||prefix.equalsIgnoreCase("wav")){
				File file=new File(path,userId+"_"+fname+".mp3");
				attach.transferTo(file);
				
			//}else{
			//	result.setCode(100);
			//	result.setMessage("非正确音频格式");
			//	return result;
			//}
		}
		
		result.setCode(200);
		result.setMessage("音频文件上传成功");
		result.setResult(userId+"_"+fname+".mp3");
		return result;
	  }
    /**
     * @desc 15.获取第page页的音频日记
     * @Author dora
     * @time 2020年9月08日 下午12:26:23
     * @param page页码 	perPage每页数量 	onlySong是否只歌曲	 websiteId歌曲源站id
     * @return
     */
    @RequestMapping(value="getAudioDiary",method=RequestMethod.GET)
    @ResponseBody
    public BaseResult<List<Diary>> getAudioDiary(int page,int perPage,int onlySong){
    	BaseResult<List<Diary>> result=new BaseResult<>();
    	if(StringUtils.isEmpty(perPage+"")){
    		perPage=20;
    	}
//    	10-17统计	音频1479		其中歌曲559		11-07音频1561	其中歌曲585
    	int max=0,songNum=641,allNum=1694;
    	if(onlySong==1){//只查歌曲
    		max=songNum/perPage;
    	}else if(onlySong==2){//查询非歌曲
    		max=(allNum-songNum)/perPage;
    	}else{//都查
    		max=allNum/perPage;
    	}
//    	if(StringUtils.isEmpty(page+"")){
        	page=NumberUtil.getRandomNum(max);//随机生成一个大于0小于等于最大页数的整数
//    	}
    	
    	HashMap<String, Object> map=new HashMap<>();
		map.put("pageIndex", (page-1)*10);map.put("perPage", perPage);map.put("onlySong", onlySong);
		map.put("websiteId", "");//0:网易云音乐、1:酷我音乐、2:QQ音乐、3:其他
    	logger.info("将加载第"+page+"页的音频,查询参数->>>>"+map);
    	List<Diary> list=noteBookService.getAudioDiary(map);
    	result.setCode(200);
    	result.setMessage("已为你加载第"+page+"页的音频日记");
    	result.setResult(list);
    	return result;
    }
    /**
     * @desc 16.根据日记id批量获取日记
     * @Author dora
     * @time 2020年10月6日 下午7:05:11
     * @param str
     * @return
     */
    @RequestMapping(value="getAudioByIds")
    @ResponseBody
    public BaseResult<List<Diary>> getAudioByIds(String ids) {
    	BaseResult<List<Diary>> result=new BaseResult<>();
    	List<Diary> list=noteBookService.getAudioByIds(ids);
    	result.setCode(200);
    	result.setMessage("成功批量获取音频日记");
    	result.setResult(list);
    	return result;
    }
    /**
     * @desc 17.手动爬取未爬取过的人民日报的日记（与自动爬取一起使用）
     * @Author dora
     * @time 2020年10月17日 上午9:42:21
     * @return
     * @throws Exception
     */
    @RequestMapping(value="spideDaily")
    @ResponseBody
    public BaseResult spideDaily() throws Exception{
    	BaseResult result=new BaseResult<>();

    	String selectSql=new String("select we_url from d_wechat_data where we_status=0 and we_acc_id='22760641'");
		ResultSet rs=JdbcUtil.select(selectSql);
		String urls[]=new String[20];
		int i=0;
		while(rs.next()){
			urls[i]=rs.getString("we_url");
			System.out.println(rs.getString("we_url"));
			i++;
		}
//		rs.close();
		
		if(StringUtils.isEmpty(urls[0])){
			result.setMessage("没有未爬取的人民日报日记");
			result.setCode(200);
			return result;
		}
		System.out.println("开始爬取人民日报的日记");
		long start=System.currentTimeMillis();
		List<HashMap<String,String>> list=SpideWechat.getPeopleDailyReport(urls,"22760641");
		System.out.println("爬取"+list.size()+"篇日记共计耗时："+(System.currentTimeMillis()-start));
		System.out.println("开始写入人民日报的日记");
		
		for(HashMap<String,String> map:list){
			NoteBook nb=new NoteBook();
			nb.setNWritter("22760641");nb.setNAuthority(0);nb.setNAllowComment(0);
			nb.setNTitle(map.get("title"));nb.setNContent(map.get("content"));
			nb.setNWeather(0);nb.setNMood(0);nb.setnTop(0);nb.setnUserTop(0);
			nb.setNTime(map.get("time")+" 22:00:00");nb.setnSongId(map.get("voice"));
			nb.setNType(4);nb.setNLocation("北京市");nb.setnWriteDevice("spider");
			noteBookService.addNote(nb);
		}
		
		System.out.println("成功写入人民日报的日记");
		
		String updateSql="update d_wechat_data set we_status=1 where we_acc_id='22760641'";
		JdbcUtil.insertOrUpdate(updateSql);
    	
    	result.setCode(200);
    	result.setMessage("爬取成功");
    	return result;
    }
}
