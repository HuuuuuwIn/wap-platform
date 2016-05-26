package com.zzcm.app.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.zzcm.app.dao.CountMapper;
import com.zzcm.app.util.Constant;
import com.zzcm.app.util.WapUtils;
import com.zzcm.webase.core.datatable.DTReq;
import com.zzcm.webase.core.datatable.DTRes;
import com.zzcm.webase.core.service.BaseServiceImpl;

//用户服务类
@Service
public class CountService extends BaseServiceImpl<Map<String,Object>,Long,CountMapper>  {
	
	public DTRes pageList(Map<String,Object> map, DTReq req){
		List<Map<String,Object>> list = readDao.pageList(map);
		Integer count = readDao.pageListCount(map);
		DTRes dtBean = new DTRes();
		dtBean.setDraw(req.getDraw());
		dtBean.setRecordsFiltered(count);
		dtBean.setRecordsTotal(count);
		dtBean.setData(list);
		processAdvert(list, count);
        return dtBean;
	}

//	public List<Map<String,Object>> list(Map<String,Object> map, int page, int size,String order) {
//        PageHelper.startPage(page,size,order);
//        List<Map<String,Object>> list = readDao.list(map);
//        if(WapUtils.isNotEmpty(list)){
//        	for (Map<String,Object> m : list) {
//				String adverId = m.get("dimension_one_value").toString();
//				String advertname=null;
//				try {
//					advertname = readDao.getAdvertNameById(adverId);
//				} catch (DataAccessException e) {
//					e.printStackTrace();
//				}
//				if(advertname == null) {
//					advertname="未知广告";
//				}
//				map.put("advertname", advertname);
//			}
//        }
//        return list;
//    }
	
	/**
	 * 获取广告点击数，展示数总数
	 * @return
	 */
	public Map<String,Object> getadSum(Map<String,Object> paramMap) {
		return readDao.getadSum(paramMap);
	}
	/**
	 * 根据广告名获取广告id
	 * @param advertType 
	 * @return
	 */
	public String getAdvertIds(Map<String,Object> paramMap){
		return readDao.getAdvertIds(paramMap);
	}
	/**
	 * 按小时获取广告
	 * @return
	 */
	public DTRes adlistForHour(Map<String,Object> map, DTReq req) {
		List<Map<String,Object>> list = readDao.adlistForHour(map);
		Integer count = readDao.adlistForHourCount(map);
		DTRes dtBean = new DTRes();
		dtBean.setDraw(req.getDraw());
		dtBean.setRecordsFiltered(count);
		dtBean.setRecordsTotal(count);
		dtBean.setData(list);
		processAdvert(list, count);
		return dtBean;
	}


	public DTRes adposList(Map<String, Object> paramMap, DTReq req) {
		List<Map<String,Object>> list = readDao.adposList(paramMap);
		Integer count = readDao.adposListCount(paramMap);
		DTRes dtBean = new DTRes();
		dtBean.setDraw(req.getDraw());
		dtBean.setRecordsFiltered(count);
		dtBean.setRecordsTotal(count);
		dtBean.setData(list);
		processAdvertPos(list, count);
        return dtBean;
	}

	protected void processAdvert(List<Map<String, Object>> list, Integer count) {
		if(count > 0){
        	for (Map<String,Object> m : list) {
				String adverId = m.get("dimension_one_value").toString();
				String advertname=null;
				String adverttype=null;
				try {
					Map<String,Object> map = readDao.getAdvertNameById(adverId);
					if(WapUtils.isNotEmpty(map)){
						if(WapUtils.isNotEmpty(map.get("advertname"))){
							advertname = map.get("advertname") + "";
						}
						if(WapUtils.isNotEmpty(map.get("adverttype"))){
							adverttype = map.get("adverttype") + "";
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				if(advertname == null) {
					advertname="未知广告";
				}
				if(adverttype == null) {
					adverttype="9";
				}
				m.put("advertname", advertname);
				m.put("adverttype", adverttype);
			}
        }
	}
	
	protected void processAdvertPos(List<Map<String, Object>> list, Integer count) {
		if(count > 0){
        	for (Map<String,Object> m : list) {
				String adverId = m.get("dimension_one_value").toString();
				String posname = Constant.POSITION_MAPPING.get(adverId);
				if(posname == null) {
					posname="未知广告位";
				}
				m.put("advertname", posname);
			}
        }
	}
	
	public Map<String, Object> getadposSum(Map<String, Object> paramMap) {
		return readDao.getadposSum(paramMap);
	}

	public DTRes adposlistForHour(Map<String, Object> paramMap, DTReq req) {
		List<Map<String,Object>> list = readDao.adPoslistForHour(paramMap);
		Integer count = readDao.adPoslistForHourCount(paramMap);
		DTRes dtBean = new DTRes();
		dtBean.setDraw(req.getDraw());
		dtBean.setRecordsFiltered(count);
		dtBean.setRecordsTotal(count);
		dtBean.setData(list);
		processAdvertPos(list, count);
		return dtBean;
	}

	public DTRes siteList(Map<String, Object> paramMap, DTReq req) {
		List<Map<String,Object>> list = readDao.siteList(paramMap);
		Integer count = readDao.siteListCount(paramMap);
		DTRes dtBean = new DTRes();
		dtBean.setDraw(req.getDraw());
		dtBean.setRecordsFiltered(count);
		dtBean.setRecordsTotal(count);
		dtBean.setData(list);
        return dtBean;
	}

	public DTRes columnList(Map<String, Object> paramMap, DTReq req) {
		List<Map<String,Object>> list = readDao.columnList(paramMap);
		Integer count = readDao.columnListCount(paramMap);
		DTRes dtBean = new DTRes();
		dtBean.setDraw(req.getDraw());
		dtBean.setRecordsFiltered(count);
		dtBean.setRecordsTotal(count);
		dtBean.setData(list);
        return dtBean;
	}

	public Map<String, Object> siteSum(Map<String, Object> paramMap) {
		return readDao.siteSum(paramMap);
	}

	public Map<String, Object> columnSum(Map<String, Object> paramMap) {
		return readDao.columnSum(paramMap);
	}

	public DTRes siteHourList(Map<String, Object> paramMap, DTReq req) {
		List<Map<String,Object>> list = readDao.hourList(paramMap);
		Integer count = readDao.hourListCount(paramMap);
		DTRes dtBean = new DTRes();
		dtBean.setDraw(req.getDraw());
		dtBean.setRecordsFiltered(count);
		dtBean.setRecordsTotal(count);
		dtBean.setData(list);
		processSite(list,count);
		return dtBean;
	}

	private void processSite(List<Map<String, Object>> list,Integer count) {
		if(count > 0){
			for (Map<String,Object> m : list) {
				String arcid = m.get("dimension_one_value").toString();
				try {
					m.put("typename", readDao.getArcnameById(arcid));
				} catch (Exception e) {
					e.printStackTrace();
					continue;
				}
			}
		}
	}

	public DTRes columnHourList(Map<String, Object> paramMap, DTReq req) {
		List<Map<String,Object>> list = readDao.hourList(paramMap);
		Integer count = readDao.hourListCount(paramMap);
		DTRes dtBean = new DTRes();
		dtBean.setDraw(req.getDraw());
		dtBean.setRecordsFiltered(count);
		dtBean.setRecordsTotal(count);
		dtBean.setData(list);
		processColumn(list,count);
		return dtBean;
	}

	private void processColumn(List<Map<String, Object>> list, Integer count) {
		if(count > 0){
			for (Map<String,Object> m : list) {
				String arcid = m.get("dimension_one_value").toString();
				try {
					Map<String,Object> map = readDao.getArcnamesById(arcid);
					m.put("typename", map.get("typename"));
					m.put("pname", map.get("pname"));
				} catch (Exception e) {
					e.printStackTrace();
					continue;
				}
			}
		}
	}
}
