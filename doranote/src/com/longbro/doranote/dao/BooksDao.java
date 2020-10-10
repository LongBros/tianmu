package com.longbro.doranote.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.longbro.doranote.bean.Books;

@Repository
public class BooksDao extends BaseDao<Books>{
	public String getWorkSpace(){
		return Books.class.getName();
	}
	public void createBooks(Books book){
		this.insert(getWorkSpace()+".create",book);
	}
	public void updateBookById(Books book){
		this.update(getWorkSpace()+".update", book);
	}
	public List<Books> getBooksByAuthor(String author){
		List<Books> books=(List<Books>)this.selectList(getWorkSpace()+".getBooksByAuthor", author);
		return books;
	}
}