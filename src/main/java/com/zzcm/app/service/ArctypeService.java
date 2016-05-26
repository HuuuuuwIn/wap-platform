package com.zzcm.app.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.zzcm.app.dao.ArctypeMapper;
import com.zzcm.app.model.Arctype;
import com.zzcm.app.model.ItemTree;
import com.zzcm.app.util.WapUtils;
import com.zzcm.webase.core.service.BaseServiceImpl;
import com.zzcm.webase.page.PageHelper;

import org.springframework.stereotype.Service;

@Service
public class ArctypeService extends BaseServiceImpl<Arctype,Long,ArctypeMapper> {

    public List<Arctype> list(Arctype arctype, int page, int size,String order) {
        PageHelper.startPage(page, size,order);
        return readDao.list(arctype);
    }
    
    public List<ItemTree> treeItemList(){
		return treeItemList(new Long("0"));
	}
    
    public List<ItemTree> treeItemList(Long id){
		List<ItemTree> list = new ArrayList<ItemTree>();
		List<Arctype> arctypelist = arctypeListByReid(id);//获取子栏目信息
		for(Arctype sing : arctypelist){
			ItemTree item = new ItemTree();
			item.setId(sing.getId());
			item.setText(sing.getTypename());
			item.setChildren(treeItemList(sing.getId()));
			list.add(item);
		}
		return list.size() == 0 ? null:list;
	}
    
    public List<Arctype> arctypeListByReid(Long id){
        Map<String,Object> param = new HashMap<String, Object>();
        param.put("reid", id);
        return readDao.listTree(param);
    }

	public boolean saveOrUdate(Arctype entity) {
		int n = 0;
		if(WapUtils.isNotEmpty(entity.getId())){
			n = writeDao.updateByPrimaryKey(entity);
		}else{
			n = writeDao.insert(entity);
		}
		return n <= 0 ? false : true;
	}

	public Arctype get(Long id) {
		return readDao.selectByPrimaryKey(id);
	}
	
	public boolean delete(Long id){
		int n = writeDao.deleteByPrimaryKey(id);
		return n <= 0 ? false : true;
	}
	
	public List<Map<String, Object>> childNodes(String pid) {
		if(WapUtils.isEmpty(pid)){
			return null;
		}
		return readDao.queryNodes(pid);
	}
}
