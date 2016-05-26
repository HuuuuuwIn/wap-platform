package com.zzcm.app.dao;

import com.zzcm.app.model.Arctype;
import com.zzcm.webase.core.dao.BaseDao;

import java.util.List;
import java.util.Map;

public interface ArctypeMapper extends BaseDao<Arctype,Long> {

    public List<Arctype> list(Arctype arctype);
    
    public List<Arctype> listTree(Map<String,Object> reid);

	public List<Map<String, Object>> queryNodes(String pid);
    
}