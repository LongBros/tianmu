package com.longbro.doranote.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.longbro.doranote.bean.Books;
import com.longbro.doranote.dao.BooksDao;

@Service
public class BooksService {
	@Autowired
	BooksDao booksDao;
	
	public void createBooks(Books book){
		booksDao.createBooks(book);
	}
	public void updateBookById(Books book){
		booksDao.updateBookById(book);
	}
	public List<Books> getBooksByAuthor(String author){
		return booksDao.getBooksByAuthor(author);
	}
}
