package com.longbro.doranote.controller;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.longbro.doranote.BaseResult;
import com.longbro.doranote.bean.Books;
import com.longbro.doranote.service.BooksService;
import com.longbro.doranote.util.Strings;
import com.longbro.doranote.util.TimeUtil;

@Controller
@RequestMapping("note/books/")
public class BooksController {
	@Autowired
	BooksService booksService;
	
	/**
	 *  1.创建日记本
	 *  2020-06-10
	 * @param book
	 * @return
	 */
	@RequestMapping("createBook")
	@ResponseBody
	public BaseResult createBook(Books book){
		BaseResult result=new BaseResult<>();
		if(StringUtils.isEmpty(book.getBWriter())){
			result.setCode(100);
			result.setMessage("参数缺失");
			return result;
		}
		book.setBTime(TimeUtil.time());
		book.setBBookid(Strings.allotNum(8));//分配八位bookId
		booksService.createBooks(book);

		result.setCode(200);
		result.setMessage("日记本创建成功");
		result.setResult(book);
		return result;
	}
	/**
	 * 
	 * @desc 2.根据作者得到其所有日记本
	 * @Author dora
	 * @time 2020年6月10日 下午9:21:55
	 * @return
	 */
	@RequestMapping("getBooksByAuthor")
	@ResponseBody
	public BaseResult getBooksByAuthor(String author){
		BaseResult result=new BaseResult<>();
		if(StringUtils.isEmpty(author)){
			result.setCode(100);
			result.setMessage("参数缺失");
			return result;
		}
		List<Books> books=booksService.getBooksByAuthor(author);
		result.setResult(books);
		result.setNum(books.size());
		result.setCode(200);
		result.setMessage("查询"+author+"的日记书成功");
		return result;
	}
	/**
	 * 根据bookId修改日记本的描述/封面等信息
	 * @desc 
	 * @Author dora
	 * @time 2020年6月11日 下午11:34:12
	 * @param book
	 * @return
	 */
	@RequestMapping("updateBookById")
	@ResponseBody
	public BaseResult updateBookById(Books book){
		BaseResult result=new BaseResult<>();
		if(StringUtils.isEmpty(book.toString())){
			result.setCode(100);
			result.setMessage("参数缺失");
			return result;
		}
		book.setBTime(TimeUtil.time());
		booksService.updateBookById(book);

		result.setCode(200);
		result.setMessage("日记本修改成功");
		result.setResult(book);
		return result;
	}
}
