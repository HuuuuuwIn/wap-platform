package com.zzcm.app.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;

/*
 * 广告表
 * */
public class Advert extends BaseEntity{

	private String typeid;//广告栏目
	private String advertname;//广告名
	private String adverttype;//广告类型  0 自建图片链接广告   1 js广告
	private String advertimage;//广告图片地址
	private String adverturl;//广告url地址
	private String advertposition;//广告栏位
	private String status;//广告状态  0 暂停   1运行  
	private String jscode;//js代码
	private String advertheight;
	private String advertwidth;
	private String position;
	private String imageLink;
	@DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private Date createTime;
	@DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private Date updateTime;
	private Map<String,Boolean> checked = new HashMap<String, Boolean>();
	private List<Long> arChecked = new ArrayList<Long>();
	public String getTypeid() {
		return typeid;
	}
	public void setTypeid(String typeid) {
		this.typeid = typeid;
	}
	public String getAdvertname() {
		return advertname;
	}
	public void setAdvertname(String advertname) {
		this.advertname = advertname;
	}
	public String getAdvertimage() {
		return advertimage;
	}
	public void setAdvertimage(String advertimage) {
		this.advertimage = advertimage;
	}
	public String getAdverturl() {
		return adverturl;
	}
	public void setAdverturl(String adverturl) {
		this.adverturl = adverturl;
	}
	public String getAdvertposition() {
		return advertposition;
	}
	public void setAdvertposition(String advertposition) {
		this.advertposition = advertposition;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getJscode() {
		return jscode;
	}
	public void setJscode(String jscode) {
		this.jscode = jscode;
	}
	public String getAdvertheight() {
		return advertheight;
	}
	public void setAdvertheight(String advertheight) {
		this.advertheight = advertheight;
	}
	public String getAdvertwidth() {
		return advertwidth;
	}
	public void setAdvertwidth(String advertwidth) {
		this.advertwidth = advertwidth;
	}
	public String getPosition() {
		return position;
	}
	public void setPosition(String position) {
		this.position = position;
	}
	public String getImageLink() {
		return imageLink;
	}
	public void setImageLink(String imageLink) {
		this.imageLink = imageLink;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public Map<String, Boolean> getChecked() {
		return checked;
	}
	public void setChecked(Map<String, Boolean> checked) {
		this.checked = checked;
	}
	public List<Long> getArChecked() {
		return arChecked;
	}
	public void setArChecked(List<Long> arChecked) {
		this.arChecked = arChecked;
	}
	public String getAdverttype() {
		return adverttype;
	}
	public void setAdverttype(String adverttype) {
		this.adverttype = adverttype;
	}
}
