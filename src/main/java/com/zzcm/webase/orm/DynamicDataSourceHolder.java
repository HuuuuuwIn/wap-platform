package com.zzcm.webase.orm;

/**
 * Created by Administrator on 2016/2/18.
 */
public class DynamicDataSourceHolder {
    private static final ThreadLocal<String> HOLDER = new ThreadLocal<String>();

    public static void putDataSource(String name){
        HOLDER.set(name);
    }

    public static String getDataSource(){
        return HOLDER.get();
    }
}
