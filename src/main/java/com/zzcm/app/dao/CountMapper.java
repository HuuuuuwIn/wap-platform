package com.zzcm.app.dao;

import com.zzcm.webase.core.dao.BaseDao;

import java.util.List;
import java.util.Map;

public interface CountMapper extends BaseDao<Map<String,Object>,Long> {

    public List<Map<String,Object>> list(Map<String,Object> map);
    
    public List<Map<String,Object>> pageList(Map<String,Object> map);
    
    public String getAdvertIds(Map<String, Object> paramMap);
    
    public Map<String,Object> getadSum(Map<String,Object> map);

	public Map<String,Object> getAdvertNameById(String adverId);

	public Integer pageListCount(Map<String, Object> map);

	public List<Map<String, Object>> adlistForHour(Map<String, Object> map);

	public Integer adlistForHourCount(Map<String, Object> map);

	public List<Integer> getAdvertplaceIds(Map<String, Object> pmap);

	public Integer adposListCount(Map<String, Object> paramMap);

	public List<Map<String, Object>> adposList(Map<String, Object> paramMap);

	public Map<String, Object> getadposSum(Map<String, Object> paramMap);

	public List<Map<String, Object>> adPoslistForHour(Map<String, Object> paramMap);

	public Integer adPoslistForHourCount(Map<String, Object> paramMap);

	public List<Map<String, Object>> siteList(Map<String, Object> paramMap);

	public Integer siteListCount(Map<String, Object> paramMap);

	public List<Map<String, Object>> columnList(Map<String, Object> paramMap);

	public Integer columnListCount(Map<String, Object> paramMap);

	public Map<String, Object> siteSum(Map<String, Object> paramMap);

	public Map<String, Object> columnSum(Map<String, Object> paramMap);

	public List<Map<String, Object>> hourList(Map<String, Object> paramMap);

	public Integer hourListCount(Map<String, Object> paramMap);

	public String getArcnameById(String arcid);

	public Map<String, Object> getArcnamesById(String arcid);
	
}