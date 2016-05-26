package com.zzcm.webase.act.common;

//import com.octo.captcha.service.image.ImageCaptchaService;
import com.zzcm.webase.core.datatable.DTReq;
import com.zzcm.webase.core.datatable.DTRes;
import com.zzcm.webase.model.Permission;
import com.zzcm.webase.model.Role;
import com.zzcm.webase.model.User;
import com.zzcm.webase.page.PageInfo;
import com.zzcm.webase.service.RoleService;
import com.zzcm.webase.service.UserService;
import com.zzcm.webase.util.StrUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.*;

/**
 * Created by Administrator on 2016/2/29.
 */
@Controller
@RequestMapping(value = "/user")
public class UserAct extends BaseAct {
    @Resource
    private UserService userService;
    @Resource
    private RoleService roleService;
//    @Autowired
//    private ImageCaptchaService imageCaptchaService;

    private static Map<String,String> columnMapping = new HashMap<>();
    static {
        columnMapping.put("createTime","create_time");
    }

    @RequestMapping(value = "/login",method = RequestMethod.POST)
    public String login(@Valid User user,String captcha, BindingResult result, Model model, HttpServletRequest request,RedirectAttributes attrs) {
        try {
//            boolean flag = imageCaptchaService.validateResponseForID(request.getSession().getId(),captcha);

//            if(!flag){
//                model.addAttribute("error", "验证码错误！");
//                attrs.addFlashAttribute("error","验证码错误！");
//                return "redirect:/login";
//            }
            Subject subject = SecurityUtils.getSubject();
            // 已登陆则 跳到首页
//            if (subject.isAuthenticated()) {
//                return "redirect:/";
//            }
            if (result.hasErrors()) {
                model.addAttribute("error", "参数错误！");
                attrs.addFlashAttribute("error","参数错误！");
                return "redirect:/login";
            }
            // 身份验证
            subject.login(new UsernamePasswordToken(user.getUsername(), StrUtil.md5Hex(user.getPassword())));
            // 验证成功在Session中保存用户信息
            final User authUserInfo = userService.selectByUsername(user.getUsername());
            request.getSession().setAttribute("userInfo", authUserInfo);
        } catch (AuthenticationException e) {
            // 身份验证失败
            model.addAttribute("error", "用户名或密码错误 ！");
            attrs.addFlashAttribute("error","用户名或密码错误 ！");
            return "redirect:/login";
        }
        return "redirect:/";
    }

    /**
     * 用户登出
     *
     * @param session
     * @return
     */
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(HttpSession session) {
        session.removeAttribute("userInfo");
        // 登出操作
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
        return "redirect:/login";
    }

    //@RequiresRoles
    //@RequiresPermissions

    @RequestMapping(value = "/info")
    @RequiresAuthentication
    @ResponseBody
    public String getUser(HttpSession session){
        User user = (User) session.getAttribute("userInfo");

        User uu = userService.selectUserInfoByName(user.getUsername());
        Set<Permission> permissions = userService.getAllPermission(user.getId());
        StringBuilder sb = new StringBuilder();
        for (Permission permission : permissions) {
            sb.append(permission.getPermissionSign()).append(",");
        }

        Map<String,Object> map = new HashMap<>();
        map.put("userName",user.getUsername());
        map.put("userId",user.getId());
        map.put("permissions",sb.toString());
        return json(map);
    }

    @RequestMapping(value = {"/list"})
    @ResponseBody
    public DTRes test(User user,HttpServletRequest request,HttpServletResponse response,Model model){
        //showParams(request);

        DTReq req = getDtReq(request);

        List<User> list = userService.selectByUser(user, req.getStart() / req.getLength() + 1, req.getLength(), req.getOrder());

        PageInfo pageInfo = new PageInfo<User>(list);

        DTRes dtBean = new DTRes();
        dtBean.setDraw(req.getDraw());
        dtBean.setRecordsFiltered(pageInfo.getTotal());
        dtBean.setRecordsTotal(pageInfo.getTotal());
        dtBean.setData(pageInfo.getList());
//        return json(dtBean);
        return dtBean;
    }

    @RequestMapping(value = "/save.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"user:add","user:update"})
    @ResponseBody
    public String saveJson(User user) {
        if (user.getId() != null) {
            user.setPassword(StrUtil.md5Hex(user.getPassword()));
            userService.updateByPrimaryKey(user);
        } else {
            user.setPassword(StrUtil.md5Hex(user.getPassword()));
            user.setCreateTime(new Date());
            userService.insert(user);
        }
        return json("success");
    }

    @RequestMapping(value = "/name.json", method = RequestMethod.POST)
    @RequiresAuthentication
    @ResponseBody
    public Boolean name(String username) {
        if(isBlank(username)) return false;
        User user = userService.selectByUsername(username);
        return user==null;
    }

    @RequestMapping(value = "/delete.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"user:delete"})
    @ResponseBody
    public Boolean delete(Long id) {
        if(null==id || id <= 0) return false;
//        userService.deleteByPrimaryKey(id);
        userService.deleteUserByPrimaryKey(id);
        return true;
    }

    @RequestMapping(value = "/getRoles.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"user:query"})
    @ResponseBody
    public List<Role> getRoles(Long id) {
        if(null==id || id <= 0) return new ArrayList<>();
        List<Role> roles = roleService.selectRolesByUserId(id);
        if(null==roles) return new ArrayList<>();
        return roles;
    }

    @RequestMapping(value = "/setRoles.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"user:update"})
    @ResponseBody
    public Boolean setRoles(Long userId,String roles) {
        List<Long> list = new ArrayList<>();
        if(!isEmpty(roles)){
            String[] rs = roles.split(",");
            for (String r : rs) {
                list.add(Long.valueOf(r));
            }
        }

        return userService.updateUserRoles(userId,list);
    }


    @Override
    protected Map<String, String> getColumnMaping() {
        return columnMapping;
    }
}
