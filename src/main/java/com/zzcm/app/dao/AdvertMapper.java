package com.zzcm.app.dao;

import com.zzcm.app.model.Advert;
import com.zzcm.webase.core.dao.BaseDao;

import java.util.List;
import java.util.Map;

public interface AdvertMapper extends BaseDao<Advert,Long> {

    public List<Advert> list(Advert arctype);

	public Integer execute(Map<String, Object> paramMap);

	public Long insertRenPK(Advert entity);

	public Integer insertAdvertarc(Map<String, Object> paramMap);

	public Integer deleteAdvertarc(Advert entity);
    
}