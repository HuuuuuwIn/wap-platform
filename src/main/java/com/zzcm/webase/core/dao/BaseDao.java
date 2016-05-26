package com.zzcm.webase.core.dao;


import java.io.Serializable;

/**
 * Created by Administrator on 2016/2/19.
 */
public interface BaseDao<T,K extends Serializable> extends WriteDao<T,K>,ReadDao<T,K> {
}
