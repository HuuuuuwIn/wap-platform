package com.zzcm.app.model;

import java.util.List;


public class ItemTree {

	private Long id;
	private String text;
	private List<ItemTree> children;
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public List<ItemTree> getChildren() {
		return children;
	}
	public void setChildren(List<ItemTree> children) {
		this.children = children;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
}
