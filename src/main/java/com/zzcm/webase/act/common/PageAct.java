package com.zzcm.webase.act.common;

import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Administrator on 2016/2/18.
 */
@Controller
public class PageAct {

    @RequestMapping(value = {"index","/","index.html"})
    @RequiresAuthentication
    public String index() {
        return "index";
    }

    /**
     * 登录
     * @return
     */
    @RequestMapping("/login")
    public String login(){
        return "common/login";
    }

    /**
     * 404页
     */
    @RequestMapping("/page/404")
    public String error404() {
        return "common/404";
    }

    /**
     * 401页
     */
    @RequestMapping("/page/401")
    public String error401() {
        return "common/401";
    }

    /**
     * 500页
     */
    @RequestMapping("/page/500")
    public String error500() {
        return "common/500";
    }
}
