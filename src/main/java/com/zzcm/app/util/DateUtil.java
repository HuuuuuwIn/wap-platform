package com.zzcm.app.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateUtil {
	
    /**
     * 获取昨天日期
     * @return
     */
	@SuppressWarnings("static-access")
	public static String getYestDay(){
		Date date=new Date();//取时间
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		calendar.add(calendar.DATE,-1);//把日期往后增加一天.整数往后推,负数往前移动
		date=calendar.getTime(); //这个时间就是日期往后推一天的结果 
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String dateString = formatter.format(date);
	 
		return dateString;
	}
	
	/**
     * 转换指定日期格式
     * @return
     */
    public static Date parseDate(Date date, String format) {
        DateFormat df = new SimpleDateFormat(format);
        try {
            String s =  df.format(date);
            return df.parse(s);
        } catch (ParseException e) {
            return new Date();
        }
    }
    
    /**
     * 获取指定格式日期
     * @return
     */
    public static Date getTodayDate(String format) {
    	DateFormat df = new SimpleDateFormat(format);
    	try {
    		String s = df.format(new Date());
			return df.parse(s);
		} catch (ParseException e) {
			e.printStackTrace();
			return new Date();
		}
    }
    
    /**
     * 获取指定格式日期
     * @param format
     * @return
     */
    public static String getCurrentDay(String format){
    	DateFormat df = new SimpleDateFormat(format);
    	return df.format(new Date());
    }
    
    public static String getFormatDate(String date,String format) throws ParseException{
    	SimpleDateFormat fmt = new SimpleDateFormat(format);
    	Date fd = fmt.parse(date);
    	return fmt.format(fd);
    }
}
