package com.zzcm.app.dao;

import java.util.List;
import java.util.Map;

import com.zzcm.app.model.Article;
import com.zzcm.app.model.ArticleImg;
import com.zzcm.webase.core.dao.BaseDao;

public interface ArticleMapper  extends BaseDao<Map<String,Object>,Long> {

	List<Article> list(Map<String, Object> paramMap);

	Integer listCount(Map<String, Object> paramMap);

	Integer updateBatchDel(Map<String, Object> paramMap);

	Integer updateBatchAudit(Map<String, Object> paramMap);

	Integer updateBatchSuggest(Map<String, Object> paramMap);

	Integer cancelRecommend(Map<String, Object> paramMap);

	Integer updateBatchIstop(Map<String, Object> paramMap);

	Integer cancelTop(Map<String, Object> paramMap);

	List<ArticleImg> getArticleImg(Long id);

	Integer updateLitpic(Map<String,Object> map);

}
