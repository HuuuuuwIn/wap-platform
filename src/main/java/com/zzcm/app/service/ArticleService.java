package com.zzcm.app.service;


import java.util.List;
import java.util.Map;

import com.zzcm.app.dao.ArticleMapper;
import com.zzcm.app.model.Article;
import com.zzcm.app.model.ArticleImg;
import com.zzcm.app.util.WapUtils;
import com.zzcm.webase.core.datatable.DTReq;
import com.zzcm.webase.core.datatable.DTRes;
import com.zzcm.webase.core.service.BaseServiceImpl;

import org.springframework.stereotype.Service;

@Service
public class ArticleService extends BaseServiceImpl<Map<String,Object>,Long,ArticleMapper> {

	public DTRes list(Map<String, Object> paramMap, DTReq req) {
		List<Article> list = readDao.list(paramMap);
		Integer count = readDao.listCount(paramMap);
		DTRes dtBean = new DTRes();
		dtBean.setDraw(req.getDraw());
		dtBean.setRecordsFiltered(count);
		dtBean.setRecordsTotal(count);
		dtBean.setData(list);
        return dtBean;
	}
	
	public Map<String, Object> get(Long id) {
		return readDao.selectByPrimaryKey(id);
	}

	public Boolean update(Map<String, Object> paramMap) {
		int i = writeDao.updateByPrimaryKey(paramMap);
		return i > 0 ? true : false;
	}

	public boolean updateBatch(Map<String, Object> paramMap) {
		try {
			if(WapUtils.isNotEmpty(paramMap.get("delId"))){
				writeDao.updateBatchDel(paramMap);
			}
			if(WapUtils.isNotEmpty(paramMap.get("auditId"))){
				writeDao.updateBatchAudit(paramMap);
			}
			if(WapUtils.isNotEmpty(paramMap.get("suggestId"))){
				writeDao.updateBatchSuggest(paramMap);
			}
			if(WapUtils.isNotEmpty(paramMap.get("istopId"))){
				writeDao.updateBatchIstop(paramMap);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public boolean updateRecommend(Map<String, Object> paramMap) {
		try {
			writeDao.cancelRecommend(paramMap);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public boolean updateTop(Map<String, Object> paramMap) {
		try {
			writeDao.cancelTop(paramMap);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public List<ArticleImg> getArticleImg(Long id) {
		return readDao.getArticleImg(id);
	}

	public boolean updateLitpic(Map<String,Object> map) {
		int i = writeDao.updateLitpic(map);
		return i > 0 ? true : false;
	}
}