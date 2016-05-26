package com.zzcm.webase;

import java.util.regex.Pattern;

/**
 * Created by Administrator on 2016/2/22.
 */
public class Test {
    protected static final Pattern PATTERN = Pattern.compile("columns\\[(\\d+)\\]\\[data\\]");
    public static void main(String[] args) {
        //String s = "columns[0][data]";
        //Matcher matcher = PATTERN.matcher(s);
        //
        //System.out.println(matcher.matches());
        //System.out.println(matcher.groupCount());
        //System.out.println(matcher.group());
        //System.out.println(matcher.group(0));
        //System.out.println(matcher.group(1));


        System.out.println(~2);
        System.out.println();
    }
}
