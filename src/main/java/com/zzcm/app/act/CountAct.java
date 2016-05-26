package com.zzcm.app.act;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zzcm.app.service.CountService;
import com.zzcm.app.util.DateUtil;
import com.zzcm.app.util.MapUtils;
import com.zzcm.app.util.WapUtils;
import com.zzcm.webase.act.common.BaseAct;
import com.zzcm.webase.core.datatable.DTReq;
import com.zzcm.webase.core.datatable.DTRes;


@Controller
@RequestMapping("/count")
public class CountAct extends BaseAct{

    @Autowired
    private CountService countService;
    
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @ResponseBody
	@RequestMapping("/list")
    @RequiresPermissions(value={"ad:query"})
    public String adlist(Model model, HttpServletRequest request) {
    	String beginDate = request.getParameter("beginDate");
    	String endDate = request.getParameter("endDate");
    	String advName = request.getParameter("advName");
    	String advertType = request.getParameter("adverttype");
    	String order = request.getParameter("order[0][column]");
    	String by = request.getParameter("order[0][dir]");
    	//flag 标记广告id不限制
    	String advIds = "flag";
    	if(WapUtils.isNotEmpty(advName) || WapUtils.isNotEmpty(advertType)){
    		advIds = countService.getAdvertIds(MapUtils.add("advName", advName).add("advertType",advertType));
    	}
    	if(beginDate == null || beginDate.trim().length() == 0) {
    		beginDate = DateUtil.getYestDay();
    	}
    	if(endDate == null || endDate.trim().length() == 0) {
    		endDate = DateUtil.getYestDay();
    	}
    	DTReq req = getDtReq(request);
    	if(WapUtils.isNotEmpty(order) && "2".equals(order) && WapUtils.isNotEmpty(by)){
    		req.setOrder("date" + " " + by);
    	}
    	Map<String,Object> paramMap = MapUtils.add("beginDate", beginDate).add("endDate", endDate)
    			.add("advIds", advIds).add("start", req.getStart()).add("length", req.getLength())
    			.add("order", req.getOrder());
    	Map<String,Object> map = null;
    	DTRes dtBean = new DTRes();
    	if(WapUtils.isNotEmpty(advIds)) {
    		dtBean = countService.pageList(paramMap,req);
    		map = countService.getadSum(paramMap);
    		if(map==null) map = new HashMap<String,Object>();
    		map.put("advertname", "合计");
    		map.put("DATE", "");
    		map.put("click", WapUtils.isEmpty(map.get("clicknum")) ? 0 : map.get("clicknum"));
    		map.put("shows", WapUtils.isEmpty(map.get("showsnum")) ? 0 : map.get("showsnum"));
    		dtBean.getData().add(map);
    	}else{
    		dtBean.setDraw(req.getDraw());
    		dtBean.setRecordsFiltered(0);
    		dtBean.setRecordsTotal(0);
    		dtBean.setData(new ArrayList());
    	}
    	return json(dtBean);
    }
    
    @SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping("/adposlist")
    @ResponseBody
    @RequiresPermissions(value={"adpos:query"})
    public String adposlist(Model model, HttpServletRequest request) {
    	String beginDate = request.getParameter("beginDate");
    	String endDate = request.getParameter("endDate");
    	String posname = request.getParameter("posname");
    	String order = request.getParameter("order[0][column]");
    	String by = request.getParameter("order[0][dir]");
    	//flag 标记广告id不限制
    	String advposIds = WapUtils.isEmpty(posname) ? "flag" : posname;
    	if(beginDate == null || beginDate.trim().length() == 0) {
    		beginDate = DateUtil.getYestDay();
    	}
    	if(endDate == null || endDate.trim().length() == 0) {
    		endDate = DateUtil.getYestDay();
    	}
    	DTReq req = getDtReq(request);
    	if(WapUtils.isNotEmpty(order) && "1".equals(order) && WapUtils.isNotEmpty(by)){
    		req.setOrder("date" + " " + by);
    	}
    	Map<String,Object> paramMap = MapUtils.add("beginDate", beginDate).add("endDate", endDate)
    			.add("advposIds", advposIds).add("start", req.getStart()).add("length", req.getLength())
    			.add("order", req.getOrder());
    	Map<String,Object> map = null;
    	DTRes dtBean = new DTRes();
    	if(WapUtils.isNotEmpty(advposIds)) {
    		dtBean = countService.adposList(paramMap,req);
    		map = countService.getadposSum(paramMap);
    		if(map==null) map = new HashMap<String,Object>();
    		map.put("advertname", "合计");
    		map.put("DATE", "");
    		map.put("click", WapUtils.isEmpty(map.get("clicknum")) ? 0 : map.get("clicknum"));
    		map.put("shows", WapUtils.isEmpty(map.get("showsnum")) ? 0 : map.get("showsnum"));
    		dtBean.getData().add(map);
    	}else{
    		dtBean.setDraw(req.getDraw());
    		dtBean.setRecordsFiltered(0);
    		dtBean.setRecordsTotal(0);
    		dtBean.setData(new ArrayList());
    	}
    	return json(dtBean);
    }
    /**
     * 按小时显示广告统计
     * @return
     */
    @SuppressWarnings("unchecked")
    @ResponseBody
	@RequestMapping("/showAdHour")
    public String showAdHour(Model model, HttpServletRequest request) {
    	String advid = request.getParameter("advid");
    	String date = request.getParameter("date");
    	DTReq req = getDtReq(request);
    	Map<String,Object> paramMap = MapUtils.add("advid", advid).add("date", date)
    			.add("start", req.getStart()).add("length", req.getLength());
    	DTRes dtBean = countService.adlistForHour(paramMap, req);
    	return json(dtBean);
    }
    
    /**
     * 按小时显示广告位统计
     * @return
     */
    @SuppressWarnings("unchecked")
	@ResponseBody
    @RequestMapping("/showAdposHour")
    public String showAdposHour(Model model, HttpServletRequest request) {
    	String advposid = request.getParameter("advposid");
    	String date = request.getParameter("date");
    	DTReq req = getDtReq(request);
    	Map<String,Object> paramMap = MapUtils.add("advposid", advposid).add("date", date)
    			.add("start", req.getStart()).add("length", req.getLength());
    	DTRes dtBean = countService.adposlistForHour(paramMap, req);
    	return json(dtBean);
    }
    
    @SuppressWarnings("unchecked")
	@ResponseBody
    @RequestMapping("/siteList")
    @RequiresPermissions(value={"site:query"})
    public String siteList(Model model, HttpServletRequest request) {
    	String arctype = request.getParameter("arctype");
    	String beginDate = request.getParameter("beginDate");
    	String endDate = request.getParameter("endDate");
    	String order = request.getParameter("order[0][column]");
    	String by = request.getParameter("order[0][dir]");
    	DTReq req = getDtReq(request);
    	if(WapUtils.isNotEmpty(order) && "1".equals(order) && WapUtils.isNotEmpty(by)){
    		req.setOrder("date" + " " + by);
    	}
		Map<String, Object> paramMap = MapUtils.add("arctype", arctype)
				.add("beginDate", beginDate).add("endDate", endDate)
				.add("start", req.getStart()).add("length", req.getLength())
				.add("order", req.getOrder());
    	DTRes dtBean = countService.siteList(paramMap, req);
    	if(WapUtils.isNotEmpty(dtBean.getData()) && dtBean.getData().size() > 0){
    		Map<String,Object> map = countService.siteSum(paramMap);
    		map.put("typename", "合计");
    		map.put("date", "");
    		dtBean.getData().add(map);
    	}
    	return json(dtBean);
    }
    
    
    @SuppressWarnings("unchecked")
	@ResponseBody
    @RequestMapping("/columnList")
    @RequiresPermissions(value={"column:query"})
    public String columnList(Model model, HttpServletRequest request) {
    	String firstType = request.getParameter("firstType");
    	String secondType = request.getParameter("secondType");
    	String beginDate = request.getParameter("beginDate");
    	String endDate = request.getParameter("endDate");
    	String order = request.getParameter("order[0][column]");
    	String by = request.getParameter("order[0][dir]");
    	DTReq req = getDtReq(request);
    	if(WapUtils.isNotEmpty(order) && "2".equals(order) && WapUtils.isNotEmpty(by)){
    		req.setOrder("date" + " " + by);
    	}
		Map<String, Object> paramMap = MapUtils.add("firstType", firstType)
				.add("secondType", secondType).add("beginDate", beginDate)
				.add("endDate", endDate).add("start", req.getStart())
				.add("length", req.getLength()).add("order", req.getOrder());
    	DTRes dtBean = countService.columnList(paramMap, req);
    	if(WapUtils.isNotEmpty(dtBean.getData()) && dtBean.getData().size() > 0){
    		Map<String,Object> map = countService.columnSum(paramMap);
    		map.put("pname", "合计");
    		map.put("typename", "total");
    		map.put("date", "");
    		dtBean.getData().add(map);
    	}
    	return json(dtBean);
    }
    
    
    @SuppressWarnings("unchecked")
    @ResponseBody
	@RequestMapping("/siteHourList")
    public String siteHourList(Model model, HttpServletRequest request) {
    	String arcid = request.getParameter("arcid");
    	String date = request.getParameter("date");
    	DTReq req = getDtReq(request);
    	Map<String,Object> paramMap = MapUtils.add("arcid", arcid).add("date", date)
    			.add("start", req.getStart()).add("length", req.getLength());
    	DTRes dtBean = countService.siteHourList(paramMap, req);
    	return json(dtBean);
    }
    
    @SuppressWarnings("unchecked")
    @ResponseBody
	@RequestMapping("/columnHourList")
    public String columnHourList(Model model, HttpServletRequest request) {
    	String arcid = request.getParameter("arcid");
    	String date = request.getParameter("date");
    	DTReq req = getDtReq(request);
    	Map<String,Object> paramMap = MapUtils.add("arcid", arcid).add("date", date)
    			.add("start", req.getStart()).add("length", req.getLength());
    	DTRes dtBean = countService.columnHourList(paramMap, req);
    	return json(dtBean);
    }
}
