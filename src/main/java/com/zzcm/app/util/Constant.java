package com.zzcm.app.util;

import java.util.HashMap;
import java.util.Map;

public class Constant {
	/**
	 * 上传图片限制
	 */
	public static final int MAX_WIDTH = 500;
	public static final int MAX_HEIGHT = 500;
	
	public static int scale = 2;
	/**
	 * 栏目位置
	 */
	public static final Map<String,String> POSITION_MAPPING = new HashMap<String,String>(){
		private static final long serialVersionUID = -6983562608158123188L;
		{
			put("1","列表1");
			put("2","列表2");
			put("3","列表3");
			put("4","列表4");
			put("5","详情位1");
			put("6","详情位2");
			put("7","详情位3");
		}
	};
	/**
	 * 推荐所属栏目
	 */
	public static final Map<String,Long> TJ_MAPPING = new HashMap<String,Long>(){
		private static final long serialVersionUID = -6554241345615562879L;
		{
			put("2",1L);
			put("87",7L);
			put("88",9L);
			put("89",31L);
			put("90",32L);
			put("91",33L);
			put("92",34L);
			put("93",35L);
			put("94",36L);
			put("95",37L);
			put("96",71L);
			put("97",77L);
			put("98",82L);
		}
	};
}