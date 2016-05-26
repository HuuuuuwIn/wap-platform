package com.zzcm.webase.core.service;

import com.zzcm.webase.core.dao.BaseDao;
import org.apache.ibatis.session.SqlSession;

import javax.annotation.Resource;
import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;

/**
 * Created by Administrator on 2016/2/19.
 */
public abstract class BaseServiceImpl<T,K extends Serializable,M extends BaseDao<T,K>> implements BaseService<T,K>{

    /**
     * 当前单读，如果多读，则配置集合，hash路由
     */
    protected M readDao;
    protected M writeDao;

    protected Class<M> mapperClass;

    @Resource(name = "readSqlSession")
    public void setReadDao(SqlSession sqlSession) {
        this.readDao = sqlSession.getMapper(getMapperClass());
    }
    @Resource(name = "writeSqlSession")
    public void setWriteDao(SqlSession sqlSession) {
        this.writeDao = sqlSession.getMapper(getMapperClass());
    }

    protected Class<M> getMapperClass(){
        if(null == mapperClass){
            ParameterizedType parameterizedType = (ParameterizedType)this.getClass().getGenericSuperclass();
            mapperClass = (Class<M>)parameterizedType.getActualTypeArguments()[2];
        }
        return mapperClass;
    }

    @Override
    public T selectByPrimaryKey(K id) {
        return readDao.selectByPrimaryKey(id);
    }

    @Override
    public List<T> selectAll() {
        return readDao.selectAll();
    }

    @Override
    public int deleteByPrimaryKey(K id) {
        return writeDao.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(T record) {
        return writeDao.insert(record);
    }

    @Override
    public int updateByPrimaryKey(T record) {
        return writeDao.updateByPrimaryKey(record);
    }
}
