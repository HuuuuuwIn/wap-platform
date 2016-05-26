package com.zzcm.app.model;

public class ItemFile {

	private int  id;//哈希码。
	private String allpath;//文件路径
	private String path;//文件路径
	private String root;//文件根
	private long size;//文件大小
	private String name;//文件名
    private String lastModified;//文件修改时间
	private boolean isdir;//是否是目录
	private int num; //目录下文件数
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getRoot() {
		return root;
	}
	public void setRoot(String root) {
		this.root = root;
	}
	public long getSize() {
		return size;
	}
	public void setSize(long size) {
		this.size = size;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public boolean isIsdir() {
		return isdir;
	}
	public void setIsdir(boolean isdir) {
		this.isdir = isdir;
	}
	public int getNum() {
		return num;
	}
	public void setNum(int num) {
		this.num = num;
	}
	public String getAllpath() {
		return allpath;
	}
	public void setAllpath(String allpath) {
		this.allpath = allpath;
	}

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }
}
