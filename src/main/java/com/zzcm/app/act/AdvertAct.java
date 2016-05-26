package com.zzcm.app.act;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.authz.annotation.Logical;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zzcm.app.model.Advert;
import com.zzcm.app.service.AdvertService;
import com.zzcm.app.util.Constant;
import com.zzcm.app.util.WapUtils;
import com.zzcm.webase.act.common.BaseAct;
import com.zzcm.webase.core.datatable.DTReq;
import com.zzcm.webase.core.datatable.DTRes;
import com.zzcm.webase.page.PageInfo;


/**
 * @author zhaoming
 *
 */
@Controller
@RequestMapping("/advert")
public class AdvertAct extends BaseAct{

	@Autowired
	private AdvertService advertService;
	
	@Value("${imageRequest}")
	public String imageRequest;
	
	@RequestMapping("/edit/{id}")
	@ResponseBody
	@RequiresPermissions(value={"advert:query","advert:query"},logical=Logical.OR)
	public Advert edit(Model model,@PathVariable Long id) {
		Advert entity = new Advert();
		if (id != null) entity = advertService.get(id);
		if(WapUtils.isNotEmpty(entity) && WapUtils.isNotEmpty(entity.getAdvertposition())){
			if(WapUtils.isNotEmpty(entity.getAdvertposition())){
				String[] pos = entity.getAdvertposition().split(",");
				for (String p : pos) {
					entity.getChecked().put(p, true);
				}
			}
			if(WapUtils.isNotEmpty(entity.getTypeid())){
				String[] tid = entity.getTypeid().split(",");
				for (String t : tid) {
					entity.getArChecked().add(Long.parseLong(t));
				}
			}
		}
		return entity;
	}
	
	
	@RequestMapping(value = {"/list"})
    @ResponseBody
    @RequiresPermissions(value={"advert:query"})
	public String list(Advert advert,HttpServletRequest request,HttpServletResponse response,Model model) {
		String order = request.getParameter("order[0][column]");
    	String by = request.getParameter("order[0][dir]");
        DTReq req = getDtReq(request);
        if(WapUtils.isNotEmpty(order) && "5".equals(order) && WapUtils.isNotEmpty(by)){
    		req.setOrder("status" + " " + by);
    	}else{
    		processOrder(req, "status desc,createTime desc");
    	}
        List<Advert> list = advertService.list(advert,req.getStart()/req.getLength()+1,req.getLength(),req.getOrder());
        for (Advert data : list) {
        	String position = "";
        	if(WapUtils.isNotEmpty(data.getAdvertposition())){
        		for (String pos : data.getAdvertposition().split(",")) {
					if("".equals(position)){
						position += Constant.POSITION_MAPPING.get(pos);
					}else{
						position += "," + Constant.POSITION_MAPPING.get(pos);
					}
				}
        	}
        	data.setImageLink(imageRequest + data.getAdvertimage());
        	data.setPosition(position);
		}
        PageInfo<Advert> pageInfo = new PageInfo<Advert>(list);
        DTRes dtBean = new DTRes();
        dtBean.setDraw(req.getDraw());
        dtBean.setRecordsFiltered(pageInfo.getTotal());
        dtBean.setRecordsTotal(pageInfo.getTotal());
        dtBean.setData(pageInfo.getList());
        return json(dtBean);
	}


	@RequestMapping("/delete/{id}")
	@ResponseBody
	@RequiresPermissions(value={"advert:query"})
	public Map<String,Object> delete(@PathVariable Long id) {
		boolean b = advertService.delete(id);
		Map<String,Object> jsonMap = new HashMap<String, Object>();
		jsonMap.put("sucess", b);
		return jsonMap; 
	}

	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ResponseBody
	@RequiresPermissions(value={"advert:query","advert:query"},logical=Logical.OR)
	public Map<String,Object> save(Advert entity) {
		boolean b = advertService.saveOrUdate(entity);
		Map<String,Object> jsonMap = new HashMap<String, Object>();
		jsonMap.put("sucess", b);
		return jsonMap;
	}
	
	@RequestMapping("/execute/{status}/{ck}")
	@ResponseBody
	@RequiresPermissions(value={"advert:query"})
	public Map<String,Object> execute(@PathVariable Integer status, @PathVariable String ck) {
		boolean b = false;
		if(WapUtils.isNotEmpty(ck)){
			Map<String,Object> paramMap = new HashMap<String, Object>();
			paramMap.put("status", status);
			paramMap.put("list", ck);
			b = advertService.updateExecute(paramMap);
		}
		Map<String,Object> jsonMap = new HashMap<String, Object>();
		jsonMap.put("sucess", b);
		return jsonMap; 
	}
	
	@RequestMapping(value="/preview/{id}",produces = "text/html;charset=UTF-8")
    public @ResponseBody String preview(@PathVariable Long id){
		String html = "";
        Advert entity = advertService.get(id);
        if(entity == null) return null;
        if(entity.getAdverttype().equals("0")) {
        	if(entity.getAdverturl().startsWith("http:")){
        		html = String.format("<html><body><a href='%s'><img src='%s'/></a></body></html>", 
            			entity.getAdverturl(),imageRequest + entity.getAdvertimage());
        	}else{
        		html = String.format("<html><body><a href='http://%s'><img src='%s'/></a></body></html>", 
            			entity.getAdverturl(),imageRequest + entity.getAdvertimage());
        	}
        }else if(entity.getAdverttype().equals("1")){
        	html = String.format("<html><body>%s</body></html>",entity.getJscode());
        }
        
        return html;
    }
}