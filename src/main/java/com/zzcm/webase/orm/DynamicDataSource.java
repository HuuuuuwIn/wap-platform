package com.zzcm.webase.orm;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * Created by Administrator on 2016/2/18.
 */
public class DynamicDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        String name = DynamicDataSourceHolder.getDataSource();
        System.out.println(name);
        if(null==name){
            name="write";
        }
        return name;
    }
}
