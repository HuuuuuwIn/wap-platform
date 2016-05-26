package com.zzcm.app.act;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.authz.annotation.Logical;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zzcm.app.model.Arctype;
import com.zzcm.app.model.ItemTree;
import com.zzcm.app.service.ArctypeService;
import com.zzcm.webase.act.common.BaseAct;
import com.zzcm.webase.core.datatable.DTReq;
import com.zzcm.webase.core.datatable.DTRes;
import com.zzcm.webase.page.PageInfo;

@Controller
@RequestMapping("/arctype")
public class ArctypeAct extends BaseAct{
	
	@Autowired
	private ArctypeService arctypeService;
	
	@RequestMapping(value = {"/list"})
    @ResponseBody
    @RequiresPermissions(value={"arctype:query"})
    public String list(Arctype arctype,HttpServletRequest request,HttpServletResponse response,Model model){
        showParams(request);
        DTReq req = getDtReq(request);
        List<Arctype> list = arctypeService.list(arctype,req.getStart()/req.getLength()+1,req.getLength(),req.getOrder());
        PageInfo<Arctype> pageInfo = new PageInfo<Arctype>(list);
        DTRes dtBean = new DTRes();
        dtBean.setDraw(req.getDraw());
        dtBean.setRecordsFiltered(pageInfo.getTotal());
        dtBean.setRecordsTotal(pageInfo.getTotal());
        dtBean.setData(pageInfo.getList());
        return json(dtBean);
    }
	
	@RequestMapping("/tree")
	public @ResponseBody List<ItemTree> tree(){
		return arctypeService.treeItemList(0L);
	}
	@RequestMapping("/edit/{id}")
	@ResponseBody
	@RequiresPermissions(value={"arctype:query","arctype:query"},logical=Logical.OR)
	public Arctype edit(Model model,@PathVariable Long id) {
		Arctype entity = new Arctype();
		if(id != null) entity = arctypeService.get(id);
		return entity;
	}
	@RequestMapping("/save")
	@RequiresPermissions(value={"arctype:query","arctype:query"},logical=Logical.OR)
	public @ResponseBody Map<String,Object> save(Arctype entity) {
		boolean b = arctypeService.saveOrUdate(entity);
		Map<String,Object> jsonMap = new HashMap<String, Object>();
		jsonMap.put("sucess", b);
		return jsonMap; 
	}
	@RequestMapping("/delete/{id}")
	@ResponseBody
	@RequiresPermissions(value={"arctype:query"})
	public Map<String,Object> delete(@PathVariable Long id) {
		boolean b = arctypeService.delete(id);
		Map<String,Object> jsonMap = new HashMap<String, Object>();
		jsonMap.put("sucess", b);
		return jsonMap; 
	}

}
