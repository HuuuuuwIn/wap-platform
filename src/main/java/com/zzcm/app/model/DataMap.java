package com.zzcm.app.model;

import java.util.HashMap;

/**
 * Created by zhangdi on 15-12-21.
 */
@SuppressWarnings({ "rawtypes", "serial" })
public class DataMap extends HashMap{

    @SuppressWarnings("unchecked")
	public DataMap add(Object key, Object value) {
        super.put(key, value);
        return this;
    }

    public DataMap delete(Object key) {
        super.remove(key);
        return this;
    }
}
