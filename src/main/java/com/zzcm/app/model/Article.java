package com.zzcm.app.model;

import java.util.Date;
import java.util.List;

public class Article {

	private Long id;
	private Long typeid ;//栏目ID
    private Integer sortrank;//时间排序
    private Integer flag;//自定义属性值
    private Integer ismake;//是否审核
    private String title;//标题
    private String source;//文档来源
    private String litpic;//缩略图
    private String body; //内容
    private String sourceweb; //来源网站
    private Date spidertime;
    private Date createTime;
	private List<ArticleImg> imglist;
	private String thumbnail;
	private String typename;
	private Integer litpictype;
	public String getThumbnail() {
		return thumbnail;
	}
	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}
	public String getTypename() {
		return typename;
	}
	public void setTypename(String typename) {
		this.typename = typename;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getTypeid() {
		return typeid;
	}
	public void setTypeid(Long typeid) {
		this.typeid = typeid;
	}
	public Integer getSortrank() {
		return sortrank;
	}
	public void setSortrank(Integer sortrank) {
		this.sortrank = sortrank;
	}
	public Integer getFlag() {
		return flag;
	}
	public void setFlag(Integer flag) {
		this.flag = flag;
	}
	public Integer getIsmake() {
		return ismake;
	}
	public void setIsmake(Integer ismake) {
		this.ismake = ismake;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getLitpic() {
		return litpic;
	}
	public void setLitpic(String litpic) {
		this.litpic = litpic;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public String getSourceweb() {
		return sourceweb;
	}
	public void setSourceweb(String sourceweb) {
		this.sourceweb = sourceweb;
	}
	public List<ArticleImg> getImglist() {
		return imglist;
	}
	public void setImglist(List<ArticleImg> imglist) {
		this.imglist = imglist;
	}
	public Integer getLitpictype() {
		return litpictype;
	}
	public void setLitpictype(Integer litpictype) {
		this.litpictype = litpictype;
	}
	public Date getSpidertime() {
		return spidertime;
	}
	public void setSpidertime(Date spidertime) {
		this.spidertime = spidertime;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
}
