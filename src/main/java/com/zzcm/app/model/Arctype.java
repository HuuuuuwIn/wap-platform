package com.zzcm.app.model;


/*
 * 栏目表
 * */
public class Arctype extends BaseEntity{
	private Long reid ; //上级栏目 
	private String retypename;//父级栏目名
	private Long topid ; //顶级栏目
	private int sortrank ; // 栏目排序
	private String typename ; //栏目名
	private String typedir ;// 目录地址
	private int isdefault ;// 栏目列表选项（1：链接到默认页；0：链接到列表第一页；-1：使用动态页）
	private String defaultname ;// 默认页的名称
	private int channeltype ; //所属频道ID
	private int ispart; //栏目属性（0：最终列表栏目；1：频道封面；2：外部连接） 
	private int corank; // 浏览权限 
	private String tempindex; //封面模板 
	private String templist ;//列表模板 
	private String temparticle ;//内容模板
	private String description ;//栏目描述;
	private String keywords; //关键字
	private String sitepath ;//栏目地址 
	private String siteurl;//绑定域名
	private int ishidden;//是否隐藏栏目（0：显示）
	private String crossid;//交叉栏目ID
	private String content;//栏目内容
	private String clickmethods;//打开方式
	public Long getReid() {
		return reid;
	}
	public void setReid(Long reid) {
		this.reid = reid;
	}
	public Long getTopid() {
		return topid;
	}
	public void setTopid(Long topid) {
		this.topid = topid;
	}
	public int getSortrank() {
		return sortrank;
	}
	public void setSortrank(int sortrank) {
		this.sortrank = sortrank;
	}
	public String getTypename() {
		return typename;
	}
	public void setTypename(String typename) {
		this.typename = typename;
	}
	public String getTypedir() {
		return typedir;
	}
	public void setTypedir(String typedir) {
		this.typedir = typedir;
	}
	public int getIsdefault() {
		return isdefault;
	}
	public void setIsdefault(int isdefault) {
		this.isdefault = isdefault;
	}
	public String getDefaultname() {
		return defaultname;
	}
	public void setDefaultname(String defaultname) {
		this.defaultname = defaultname;
	}
	public int getChanneltype() {
		return channeltype;
	}
	public void setChanneltype(int channeltype) {
		this.channeltype = channeltype;
	}
	public int getIspart() {
		return ispart;
	}
	public void setIspart(int ispart) {
		this.ispart = ispart;
	}
	public int getCorank() {
		return corank;
	}
	public void setCorank(int corank) {
		this.corank = corank;
	}
	public String getTempindex() {
		return tempindex;
	}
	public void setTempindex(String tempindex) {
		this.tempindex = tempindex;
	}
	public String getTemplist() {
		return templist;
	}
	public void setTemplist(String templist) {
		this.templist = templist;
	}
	public String getTemparticle() {
		return temparticle;
	}
	public void setTemparticle(String temparticle) {
		this.temparticle = temparticle;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getKeywords() {
		return keywords;
	}
	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}
	public String getSitepath() {
		return sitepath;
	}
	public void setSitepath(String sitepath) {
		this.sitepath = sitepath;
	}
	public String getSiteurl() {
		return siteurl;
	}
	public void setSiteurl(String siteurl) {
		this.siteurl = siteurl;
	}
	public int getIshidden() {
		return ishidden;
	}
	public void setIshidden(int ishidden) {
		this.ishidden = ishidden;
	}
	public String getCrossid() {
		return crossid;
	}
	public void setCrossid(String crossid) {
		this.crossid = crossid;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getClickmethods() {
		return clickmethods;
	}
	public void setClickmethods(String clickmethods) {
		this.clickmethods = clickmethods;
	}
	public String getRetypename() {
		return retypename;
	}
	public void setRetypename(String retypename) {
		this.retypename = retypename;
	}
}