package com.zzcm.app.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.zzcm.app.dao.AdvertMapper;
import com.zzcm.app.model.Advert;
import com.zzcm.app.util.WapUtils;
import com.zzcm.webase.core.service.BaseServiceImpl;
import com.zzcm.webase.page.PageHelper;

@Service
public class AdvertService extends BaseServiceImpl<Advert,Long,AdvertMapper> {

	public List<Advert> list(Advert advert, int page, int size,String order) {
        PageHelper.startPage(page, size,order);
        return readDao.list(advert);
    }
	
	public boolean saveOrUdate(Advert entity) {
		try {
			if(WapUtils.isNotEmpty(entity.getId())){
				writeDao.updateByPrimaryKey(entity);
				writeDao.deleteAdvertarc(entity);
				insertAdvertarc(entity);
			}else{
				writeDao.insertRenPK(entity);
				insertAdvertarc(entity);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	protected void insertAdvertarc(Advert entity) {
		if(WapUtils.isNotEmpty(entity.getTypeid())){
			String[] ids = entity.getTypeid().split(",");
			Map<String,Object> paramMap = new HashMap<String, Object>();
			paramMap.put("advid", entity.getId());
			for (String arcid : ids) {
				paramMap.put("arcid", arcid);
				writeDao.insertAdvertarc(paramMap);
			}
		}
	}
	
	public Advert get(Long id) {
		return readDao.selectByPrimaryKey(id);
	}
	
	public boolean delete(Long id){
		int n = writeDao.deleteByPrimaryKey(id);
		return n <= 0 ? false : true;
	}
	
	public boolean updateExecute(Map<String, Object> paramMap) {
		int n = writeDao.execute(paramMap);
		return n <= 0 ? false : true;
	}
}
