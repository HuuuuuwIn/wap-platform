package com.zzcm.app.act;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.Logical;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zzcm.app.model.ArticleImg;
import com.zzcm.app.service.ArctypeService;
import com.zzcm.app.service.ArticleService;
import com.zzcm.app.util.Constant;
import com.zzcm.app.util.MapUtils;
import com.zzcm.app.util.WapUtils;
import com.zzcm.webase.act.common.BaseAct;
import com.zzcm.webase.core.datatable.DTReq;
import com.zzcm.webase.core.datatable.DTRes;

@Controller
@RequestMapping("/article")
public class ArticleAct extends BaseAct{

    @Autowired
    private ArticleService articleService;

    @Autowired
    private ArctypeService arctypeService;
    
    @SuppressWarnings({ "unchecked" })
    @ResponseBody
	@RequestMapping("/list")
    @RequiresPermissions(value={"article:query"})
    public DTRes list(Model model, HttpServletRequest request) {
    	//0 未审核 1审核
    	String ismake = request.getParameter("ismake") == null ? "0" : request.getParameter("ismake");
    	//"" 缩略图全部 1无  2有
    	String thumbnail = request.getParameter("thumbnail");
    	//"" 全部栏目 
    	String ownweb = request.getParameter("ownweb") == null ? "" : request.getParameter("ownweb");
    	//"" 全部二级栏目 
    	String ownwebSecond = request.getParameter("ownwebSecond");
    	String filterTitle = request.getParameter("filterTitle");
    	String istop = request.getParameter("istop");
    	DTReq req = getDtReq(request);
    	processOrder(req, "spidertime desc");
		Map<String, Object> paramMap = MapUtils.add("thumbnail", thumbnail)
				.add("ownwebSecond", ownwebSecond).add("ownweb", ownweb)
				.add("filterTitle", filterTitle).add("ismake", ismake)
				.add("start", req.getStart()).add("length", req.getLength())
				.add("order", req.getOrder()).add("sortrank", istop);
    	if(WapUtils.isNotEmpty(Constant.TJ_MAPPING.get(ownwebSecond))){
    		paramMap.put("reidFlag", Constant.TJ_MAPPING.get(ownwebSecond));
    	}
    	DTRes dtBean = articleService.list(paramMap,req);
        return dtBean;
    }
    
    @ResponseBody
    @RequestMapping("/edit/{id}")
    @RequiresPermissions(value={"article:query","article:query"},logical=Logical.OR)
    public Map<String,Object> edit(Model model,@PathVariable Long id) {
        Map<String,Object> map = articleService.get(id);
        return map;
    }
    
    @SuppressWarnings("unchecked")
	@RequestMapping("/save")
    @ResponseBody
    @RequiresPermissions(value={"article:query","article:query"},logical=Logical.OR)
    public Map<String,Object> save(HttpServletRequest request) {
    	Map<String,Object> paramMap = WapUtils.build(request);
		if(WapUtils.isNotEmpty(paramMap.get("body"))){
			Document doc = Jsoup.parse(paramMap.get("body") + "");
			Elements imgs = doc.select("img");
			for (Element img : imgs) {
				if(img.hasAttr("style"))
				img.removeAttr("style");
			}
			paramMap.put("body",doc.html());
		}
		Boolean b = articleService.update(paramMap);
    	Map<String,Object> jsonMap = new HashMap<String, Object>();
		jsonMap.put("sucess", b);
		return jsonMap;
    }
    
    @RequestMapping("/childNodes/{pid}")
    public @ResponseBody List<Map<String,Object>> childNodes(@PathVariable String pid) {
    	return arctypeService.childNodes(pid);
    }
    
    @SuppressWarnings("unchecked")
	@RequestMapping("/batchEdit")
    @RequiresPermissions(value={"article:query","article:query"})
    public @ResponseBody Map<String,Object> batchEdit(HttpServletRequest request) {
    	Map<String,Object> paramMap = WapUtils.build(request);
    	boolean b = articleService.updateBatch(paramMap);
    	Map<String,Object> jsonMap = new HashMap<String, Object>();
		jsonMap.put("sucess", b);
		return jsonMap;
    }
    
    @SuppressWarnings("unchecked")
	@RequestMapping("/cancelRecommend")
    @RequiresPermissions(value={"article:query"})
    public @ResponseBody Map<String,Object> cancelRecommend(HttpServletRequest request) {
    	Map<String,Object> paramMap = WapUtils.build(request);
    	boolean b = articleService.updateRecommend(paramMap);
    	Map<String,Object> jsonMap = new HashMap<String, Object>();
		jsonMap.put("sucess", b);
		return jsonMap;
    }
    
    @SuppressWarnings("unchecked")
	@RequestMapping("/cancelTop")
    @RequiresPermissions(value={"article:query"})
    public @ResponseBody Map<String,Object> cancelTop(HttpServletRequest request) {
    	Map<String,Object> paramMap = WapUtils.build(request);
    	boolean b = articleService.updateTop(paramMap);
    	Map<String,Object> jsonMap = new HashMap<String, Object>();
		jsonMap.put("sucess", b);
		return jsonMap;
    }
    
    @ResponseBody
    @RequestMapping("/getArticleImg/{id}")
    @RequiresPermissions(value={"article:query","article:query"},logical=Logical.OR)
    public List<ArticleImg> getArticleImg(Model model,@PathVariable Long id) {
        return articleService.getArticleImg(id);
    }
}
