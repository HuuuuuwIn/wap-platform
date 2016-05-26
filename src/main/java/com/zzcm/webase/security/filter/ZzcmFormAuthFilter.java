package com.zzcm.webase.security.filter;

import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 满足其中一个角色则认证通过
 * Created by Administrator on 2016/3/19.
 */
public class ZzcmFormAuthFilter extends FormAuthenticationFilter{
    private static final Logger LOG = LoggerFactory.getLogger(ZzcmFormAuthFilter.class);

    private boolean isAjax(HttpServletRequest httpRequest){
        String type = httpRequest.getHeader("X-Requested-With");
        if(null!=type && type.equals("XMLHttpRequest")) return true;
        return false;
    }

    public void sendJson(HttpServletResponse response,String content){
        try {
            response.setContentType("text/html;charset=UTF-8");
            response.setHeader("Pragma", "No-cache");
            response.setHeader("Cache-Control", "no-cache");
            response.setDateHeader("Expires", 0);
            response.getWriter().write(content);
            response.getWriter().flush();
        } catch (IOException e) {
            LOG.error("ajax", e);
        }
    }

    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        if(this.isLoginRequest(request, response)) {
            if(this.isLoginSubmission(request, response)) {
                if(LOG.isTraceEnabled()) {
                    LOG.trace("Login submission detected.  Attempting to execute login.");
                }

                return this.executeLogin(request, response);
            } else {
                if(LOG.isTraceEnabled()) {
                    LOG.trace("Login page view.");
                }

                return true;
            }
        } else {
            if(LOG.isTraceEnabled()) {
                LOG.trace("Attempting to access a path which requires authentication.  Forwarding to the Authentication url [" + this.getLoginUrl() + "]");
            }
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            if (isAjax(httpRequest)) {
            	WebUtils.toHttp(response).sendError(401);
            } else {
                this.saveRequestAndRedirectToLogin(request, response);
            }
            return false;
        }
    }
}
