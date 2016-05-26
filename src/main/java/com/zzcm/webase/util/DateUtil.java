package com.zzcm.webase.util;

import org.joda.time.DateTime;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * Created by Administrator on 2016/2/23.
 */
public class DateUtil {
    private static final SimpleDateFormat SDF_YYMd = new SimpleDateFormat("yyyyMMdd");
    private static final SimpleDateFormat SDF_YY_M_d = new SimpleDateFormat("yyyy-MM-dd");

    private static final SimpleDateFormat SDF_YYMdHms = new SimpleDateFormat("yyyyMMddHHmmss");
    private static final SimpleDateFormat SDF_YY_M_d_H_m_s = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static String getYYMd(){
        return getString(null,SDF_YYMd);
    }

    public static String getYY_M_d(){
        return getString(null,SDF_YY_M_d);
    }

    public static String getYYMdHms(){
        return getString(null,SDF_YYMdHms);
    }

    public static String getYY_M_d_H_m_s(){
        return getString(null,SDF_YY_M_d_H_m_s);
    }

    public static String getYYMd(Date date){
        return getString(date,SDF_YYMd);
    }

    public static String getYY_M_d(Date date){
        return getString(date,SDF_YY_M_d);
    }

    public static String getYYMdHms(Date date){
        return getString(date,SDF_YYMdHms);
    }

    public static String getYY_M_d_H_m_s(Date date){
        return getString(date,SDF_YY_M_d_H_m_s);
    }

    private static String getString(Date date,DateFormat format){
        if(null==date){
            date = new Date();
        }
        return format.format(date);
    }

    public static void main(String[] args) {
        DateTime dateTime = new DateTime();
        System.out.println(dateTime.getYear());
        System.out.println(dateTime.getMonthOfYear());
        System.out.println(dateTime.getDayOfMonth());
        System.out.println(UUID.randomUUID().toString().replaceAll("-", ""));
    }

}
