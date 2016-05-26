package com.zzcm.app.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

/**
 * 常见的辅助类
 * 
 * @author XiongChun
 * @since 2009-07-15
 */
public class WapUtils {

	/**
	 * 判断对象是否Empty(null或元素为0)<br>
	 * 实用于对如下对象做判断:String Collection及其子类 Map及其子类
	 * 
	 * @param pObj
	 *            待检查对象
	 * @return boolean 返回的布尔值
	 */
	@SuppressWarnings("rawtypes")
	public static boolean isEmpty(Object pObj) {
		if (pObj == null)
			return true;
		if (pObj == "")
			return true;
		if (pObj instanceof String) {
			if (((String) pObj).length() == 0) {
				return true;
			}
		} else if (pObj instanceof Collection) {
			if (((Collection) pObj).size() == 0) {
				return true;
			}
		} else if (pObj instanceof Map) {
			if (((Map) pObj).size() == 0) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 判断对象是否为NotEmpty(!null或元素>0)<br>
	 * 实用于对如下对象做判断:String Collection及其子类 Map及其子类
	 * 
	 * @param pObj
	 *            待检查对象
	 * @return boolean 返回的布尔值
	 */
	@SuppressWarnings("rawtypes")
	public static boolean isNotEmpty(Object pObj) {
		if (pObj == null)
			return false;
		if (pObj == "")
			return false;
		if (pObj instanceof String) {
			if (((String) pObj).length() == 0) {
				return false;
			}
		} else if (pObj instanceof Collection) {
			if (((Collection) pObj).size() == 0) {
				return false;
			}
		} else if (pObj instanceof Map) {
			if (((Map) pObj).size() == 0) {
				return false;
			}
		}
		return true;
	}


	/**
	 * 合并字符串数组
	 * 
	 * @param a
	 *            字符串数组0
	 * @param b
	 *            字符串数组1
	 * @return 返回合并后的字符串数组
	 */
	public static String[] mergeStringArray(String[] a, String[] b) {
		if (a.length == 0 || isEmpty(a))
			return b;
		if (b.length == 0 || isEmpty(b))
			return a;
		String[] c = new String[a.length + b.length];
		for (int m = 0; m < a.length; m++) {
			c[m] = a[m];
		}
		for (int i = 0; i < b.length; i++) {
			c[a.length + i] = b[i];
		}
		return c;
	}

	/**
	 * 对文件流输出下载的中文文件名进行编码 屏蔽各种浏览器版本的差异性
	 */
	public static String encodeChineseDownloadFileName(HttpServletRequest request, String pFileName) {
		String agent = request.getHeader("USER-AGENT");
		try {
			if (null != agent && -1 != agent.indexOf("MSIE")) {
				pFileName = URLEncoder.encode(pFileName, "utf-8");
			} else {
				pFileName = new String(pFileName.getBytes("utf-8"), "iso8859-1");
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return pFileName;
	}


	/**
	 * 判断是否是IE浏览器
	 * 
	 * @param userAgent
	 * @return
	 */
	public static boolean isIE(HttpServletRequest request) {
		String userAgent = request.getHeader("USER-AGENT").toLowerCase();
		boolean isIe = true;
		int index = userAgent.indexOf("msie");
		if (index == -1) {
			isIe = false;
		}
		return isIe;
	}

	/**
	 * 判断是否是Chrome浏览器
	 * 
	 * @param userAgent
	 * @return
	 */
	public static boolean isChrome(HttpServletRequest request) {
		String userAgent = request.getHeader("USER-AGENT").toLowerCase();
		boolean isChrome = true;
		int index = userAgent.indexOf("chrome");
		if (index == -1) {
			isChrome = false;
		}
		return isChrome;
	}

	/**
	 * 判断是否是Firefox浏览器
	 * 
	 * @param userAgent
	 * @return
	 */
	public static boolean isFirefox(HttpServletRequest request) {
		String userAgent = request.getHeader("USER-AGENT").toLowerCase();
		boolean isFirefox = true;
		int index = userAgent.indexOf("firefox");
		if (index == -1) {
			isFirefox = false;
		}
		return isFirefox;
	}

	/**
	 * 获取客户端类型
	 * 
	 * @param userAgent
	 * @return
	 */
	public static String getClientExplorerType(HttpServletRequest request) {
		String userAgent = request.getHeader("USER-AGENT").toLowerCase();
		String explorer = "非主流浏览器";
		if (isIE(request)) {
			int index = userAgent.indexOf("msie");
			explorer = userAgent.substring(index, index + 8);
		} else if (isChrome(request)) {
			int index = userAgent.indexOf("chrome");
			explorer = userAgent.substring(index, index + 12);
		} else if (isFirefox(request)) {
			int index = userAgent.indexOf("firefox");
			explorer = userAgent.substring(index, index + 11);
		}
		return explorer.toUpperCase();
	}

	/**
	 * JS输出含有\n的特殊处理
	 * 
	 * @param pStr
	 * @return
	 */
	public static String replace4JsOutput(String pStr) {
		pStr = pStr.replace("\r\n", "<br/>&nbsp;&nbsp;");
		pStr = pStr.replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
		pStr = pStr.replace(" ", "&nbsp;");
		return pStr;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static List getListRandom(List list,int count){
		if(isEmpty(list) || count < 1) return null;
        Random random = new Random();
        List res = new ArrayList();
        for (int i = 0; i < count; i++) {
        	int size = list.size();
        	if(size == 0) break;
        	res.add(list.remove(random.nextInt(size)));
		}
        return res;
	}


	@SuppressWarnings("rawtypes")
	public static String[] getArray(HttpServletRequest request,String key) {
		Map map = request.getParameterMap();
		Object obj = map.get(key);
		if(obj instanceof String[]){
			return (String[])obj;
		}
		return null;
	}
	
	@SuppressWarnings("rawtypes")
	public static Map build(HttpServletRequest request){
		return MapUtils.copy(request.getParameterMap());
	}
	
	@SuppressWarnings("rawtypes")
	public static Map buildAuto(HttpServletRequest request){													
		String method = request.getMethod();											
		if(method.toUpperCase().equals("GET")){											
			return MapUtils.copy(request.getParameterMap(),"UTF-8");										
		}else{											
			return MapUtils.copy(request.getParameterMap());										
		}											
	}
}