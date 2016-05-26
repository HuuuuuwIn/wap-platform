package com.zzcm.webase.core.mybatis.mapper;

import com.zzcm.webase.core.mybatis.provider.BaseProvider;
import org.apache.ibatis.annotations.UpdateProvider;

import java.io.Serializable;

/**
 * Created by Administrator on 2016/2/22.
 */
public interface BaseMapper<T,K extends Serializable> {

    @UpdateProvider(type = BaseProvider.class,method = "updateByPrimaryKey")
    int updateByPrimaryKey( T record);
}
