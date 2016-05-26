package com.zzcm.webase.act.common;

import com.alibaba.fastjson.JSON;
import com.zzcm.app.util.WapUtils;
import com.zzcm.webase.core.datatable.DTReq;

import org.apache.shiro.authz.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Administrator on 2016/2/23.
 */
public abstract class BaseAct {

    protected final Logger LOG = LoggerFactory.getLogger(this.getClass());

    protected static final Pattern P_COLUMN = Pattern.compile("columns\\[(\\d+)\\]\\[data\\]");
    protected static final Pattern P_ORDER_C = Pattern.compile("order\\[(\\d+)\\]\\[column\\]");
    protected static final Pattern P_ORDER_D = Pattern.compile("order\\[(\\d+)\\]\\[dir\\]");

    // AJAX输出，返回null
    protected String ajax(String content, String type, HttpServletResponse response) {
        try {
            response.setContentType(type + ";charset=UTF-8");
            response.setHeader("Pragma", "No-cache");
            response.setHeader("Cache-Control", "no-cache");
            response.setDateHeader("Expires", 0);
            response.getWriter().write(content);
            response.getWriter().flush();
        } catch (IOException e) {
            LOG.error("ajax", e);
        }
        return null;
    }

    /**AJAX输出HTML，返回null**/
    protected String ajaxHtml(String html, HttpServletResponse response) {
        return ajax(html, "text/html", response);
    }

    /**AJAX输出json，返回null**/
    protected String ajaxJson(String json, HttpServletResponse response) {
        return ajax(json, "application/json", response);
    }

    protected String json(Object object){
        return JSON.toJSONString(object);
    }

    protected void showParams(HttpServletRequest request){
        Map map = new HashMap();
        Enumeration paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String paramName = (String) paramNames.nextElement();

            String[] paramValues = request.getParameterValues(paramName);
            if (paramValues.length == 1) {
                String paramValue = paramValues[0];
                if (paramValue.length() != 0) {
                    map.put(paramName, paramValue);
                }
            }
        }
        Set<Map.Entry<String, String>> set = map.entrySet();
    }

    protected DTReq getDtReq(HttpServletRequest request){
        DTReq dtReq = new DTReq();

        Enumeration paramNames = request.getParameterNames();
        Map<String,String> columnIdx = new HashMap<String,String>();
        Map<Integer,Map<String,String>> orderIdx = new HashMap<Integer,Map<String,String>>();
        while (paramNames.hasMoreElements()) {
            String paramName = (String) paramNames.nextElement();

            if(paramName.equals("start")){
                dtReq.setStart(getInt(request.getParameterValues(paramName)));
            }else if(paramName.equals("length")){
                dtReq.setLength(getInt(request.getParameterValues(paramName)));
            }else if(paramName.equals("draw")){
                dtReq.setDraw(getString(request.getParameterValues(paramName)));
            }else if(paramName.contains("][data]")){
                Matcher m_1 = P_COLUMN.matcher(paramName);
                if(m_1.matches()){
                    columnIdx.put(m_1.group(1),getString(request.getParameterValues(paramName)));
                }
            }else if(paramName.startsWith("order[")){
                Matcher m_1 = P_ORDER_C.matcher(paramName);
                Matcher m_2 = P_ORDER_D.matcher(paramName);
                if(m_1.matches()){
                    int idx = Integer.valueOf(m_1.group(1));
                    Map<String,String> map = orderIdx.get(idx);
                    if(null==map){
                        map = new HashMap<String,String>();
                        orderIdx.put(idx,map);
                    }
                    map.put("column",getString(request.getParameterValues(paramName)));
                }else if(m_2.matches()){
                    int idx = Integer.valueOf(m_2.group(1));
                    Map<String,String> map = orderIdx.get(idx);
                    if(null==map){
                        map = new HashMap<String,String>();
                        orderIdx.put(idx,map);
                    }
                    map.put("dir",getString(request.getParameterValues(paramName)));
                }
            }
        }

        StringBuilder orderBy = new StringBuilder();
        for (Map.Entry<Integer, Map<String, String>> entry : orderIdx.entrySet()) {
            Map<String, String> val = entry.getValue();
            String column = columnIdx.get(val.get("column"));
            if(getColumnMaping().containsKey(column)){
                column = getColumnMaping().get(column);
            }
            String dir = val.get("dir");
            if(!isEmpty(column) && !isEmpty(dir) && (dir.equals("asc")||dir.equals("desc"))){
                orderBy.append(column).append(" ").append(dir).append(",");
            }
        }

        if(orderBy.length()>0){
            dtReq.setOrder(orderBy.substring(0, orderBy.length() - 1));
        }

        StringBuilder selects = new StringBuilder();
        for (String column : columnIdx.values()) {
            selects.append(column).append(",");
        }

        if(selects.length()>0){
            dtReq.setSelect(selects.substring(0, selects.length() - 1));
        }

        return dtReq;

    }

    private String getString(String[] values){
        if(null==values||values.length==0) return null;
        return values[0];
    }

    private int getInt(String[] values){
        if(null==values||values.length==0) return 0;
        try {
            return Integer.valueOf(values[0]);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public ModelAndView handleException(Exception ex,HttpServletRequest request){
        LOG.error("错误:",ex);
        return new ModelAndView().addObject("error","内部错误");
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    public ModelAndView handleAuthException(Exception ex,HttpServletRequest request){
        return new ModelAndView().addObject("error","权限不够");
    }


    protected boolean isEmpty(String str){
        return null==str||str.length()==0;
    }

    protected boolean isBlank(String str){
        return null==str||str.trim().length()==0;
    }

    protected Map<String,String> getColumnMaping(){
        return new HashMap<String,String>();
    }
    
    public void processOrder(DTReq req,String order){
    	 if(WapUtils.isEmpty(req.getOrder()) || req.getOrder().indexOf("function") != -1){
         	req.setOrder(order);
         }
    }
}
