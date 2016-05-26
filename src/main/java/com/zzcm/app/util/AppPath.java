 /**
 * Copyright (c) 2010-2012 love320.com
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * 
 * Founder admin@love320.com
 */
package com.zzcm.app.util;


import java.net.URL;

import com.zzcm.monitor.zookeeper.utils.EPlatform;
import com.zzcm.monitor.zookeeper.utils.OSInfoUtil;

/** 
 * @ClassName: AppPath
 * @date 2012-6-16 下午07:36:33 
 *  应用运行的路径
 */
public class AppPath {
	private static URL URL = AppPath.class.getResource("/");
	
	public static String path(){
		return APPath();
	}
	
	//APP
	public static String APPath(){
        String url = URL.toString();
        String appPath = null;
        if(OSInfoUtil.getOSname() == EPlatform.Windows){
            String path = url.substring(6, url.length());
            appPath = path.replace('/','\\');
        }
        if(OSInfoUtil.getOSname() == EPlatform.Linux){
            String path = url.substring(5, url.length());
            appPath = path;
        }
        return appPath;
	}
	
	//WEB
	public static String WebPath(){
		return APPath();
	}

    public static String WebRoot(){
        String appPath = APPath();
        return appPath.substring(0,appPath.indexOf("WEB-INF"));
    }

    public static String WebUploads(){
        return WebRoot()+"uploads/";
    }

}
