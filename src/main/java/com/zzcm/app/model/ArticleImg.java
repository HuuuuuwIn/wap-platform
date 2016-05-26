package com.zzcm.app.model;

public class ArticleImg {

	private Long id;
	private Long articleid;
	private String path;
	private Integer width;
	private Integer height;
	public Integer getWidth() {
		return width;
	}
	public void setWidth(Integer width) {
		this.width = width;
	}
	public Integer getHeight() {
		return height;
	}
	public void setHeight(Integer height) {
		this.height = height;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getArticleid() {
		return articleid;
	}
	public void setArticleid(Long articleid) {
		this.articleid = articleid;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
}
