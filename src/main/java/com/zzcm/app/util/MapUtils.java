package com.zzcm.app.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import com.zzcm.app.model.DataMap;

public class MapUtils {

    @SuppressWarnings("unchecked")
	public static DataMap add(String key,Object obj){
        DataMap map = new DataMap();
        map.put(key,obj);
        return map;
    }

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static Map copy(Map map) {
		Map newMap = new HashMap();
		Set<String> keys= map.keySet();
		for(String key : keys ){
			Object obj = map.get(key);
			if(obj instanceof String[]){
				newMap.put(key, ((String[])obj)[0]);
			}else{
				newMap.put(key, obj);
			}
		}
		return newMap;
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static Map copy(Map map,String  code) {
		Map newMap = new HashMap();
		Set<String> keys= map.keySet();
		for(String key : keys ){
			Object obj = map.get(key);
			if(obj instanceof String[]){
				try {
					newMap.put(key, URLDecoder.decode(((String[])obj)[0],code));
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
			}else{
				newMap.put(key, obj);
			}
		}
		return newMap;
	}


	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static void cleanEmpty(Map map){
		Iterator<Map.Entry> it = map.entrySet().iterator();
        while(it.hasNext()){
            Map.Entry entry=it.next();
            if(WapUtils.isEmpty(entry.getValue())){
                it.remove();
            }
        }
	}
}
