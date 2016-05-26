package com.zzcm.webase.act.common;

import com.zzcm.webase.core.datatable.DTReq;
import com.zzcm.webase.core.datatable.DTRes;
import com.zzcm.webase.model.Permission;
import com.zzcm.webase.model.Role;
import com.zzcm.webase.model.User;
import com.zzcm.webase.page.PageInfo;
import com.zzcm.webase.service.PermissionService;
import com.zzcm.webase.service.RoleService;
import com.zzcm.webase.service.UserService;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/3/3.
 */
@Controller
@RequestMapping(value = "/role")
public class RoleAct extends BaseAct {

    @Resource
    private RoleService roleService;
    @Resource
    private PermissionService permissionService;
    @Resource
    private UserService userService;

    private static Map<String,String> columnMapping = new HashMap<>();
    static {
        columnMapping.put("roleName","role_name");
        columnMapping.put("roleSign","role_sign");
    }

    @RequestMapping(value = {"/list"})
    @ResponseBody
    public DTRes test(Role role,HttpServletRequest request,HttpServletResponse response,Model model){
        //showParams(request);

        DTReq req = getDtReq(request);

        List<Role> list = roleService.selectByRole(role,req.getStart() / req.getLength() + 1, req.getLength(), req.getOrder());

        PageInfo pageInfo = new PageInfo<Role>(list);

        DTRes dtBean = new DTRes();
        dtBean.setDraw(req.getDraw());
        dtBean.setRecordsFiltered(pageInfo.getTotal());
        dtBean.setRecordsTotal(pageInfo.getTotal());
        dtBean.setData(pageInfo.getList());
//        return json(dtBean);
        return dtBean;
    }

    @RequestMapping(value = "/save.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"role:add","role:update"})
    @ResponseBody
    public String saveJson(Role role) {
        if (role.getId() != null) {
            roleService.updateByPrimaryKey(role);
        } else {
            roleService.insert(role);
        }
        return json("success");
    }

    @RequestMapping(value = "/unique.json", method = RequestMethod.POST)
    @RequiresAuthentication
    @ResponseBody
    public Boolean unique(String sign,Long id) {
        if(isBlank(sign)) return false;
        Role role = roleService.selectBySign(sign);
        if(null!=role && null!=id && role.getId().longValue()==id.longValue())
            return true;
        return role==null;
    }

    @RequestMapping(value = "/get.json")
    @RequiresAuthentication
    @ResponseBody
    public Role get(Long id) {
        if(null==id) return null;
        Role role = roleService.selectByPrimaryKey(id);
        return role;
    }

    @RequestMapping(value = "/delete.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"role:delete"})
    @ResponseBody
    public Map<String,Object> delete(Long id) {
        Map<String,Object> map = new HashMap<>();
        if(null==id || id <= 0) {
            map.put("result",false);
            map.put("msg","ID is null.");
            return map;
        }
        List<User> users = userService.selectByRoleId(id);
        if(null==users || users.isEmpty()) {
            roleService.deleteRoleByPrimaryKey(id);
            map.put("result",true);
            map.put("msg","删除成功");
        }else{
            map.put("result",false);
            map.put("msg","有关联用户");
        }
        return map;
    }

    @RequestMapping(value = "/getPerms.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"role:query"})
    @ResponseBody
    public List<Permission> getPerms(Long id) {
        if(null==id || id <= 0) return new ArrayList<>();
        List<Permission> roles = permissionService.selectPermissionsByRoleId(id);
        if(null==roles) return new ArrayList<>();
        return roles;
    }

    @RequestMapping(value = "/setPerms.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"role:update"})
    @ResponseBody
    public Boolean setPerms(Long roleId,String perms) {
        List<Long> list = new ArrayList<>();
        if(!isEmpty(perms)){
            String[] rs = perms.split(",");
            for (String r : rs) {
                list.add(Long.valueOf(r));
            }
        }

        return roleService.updateRolePerms(roleId,list);
    }

    @Override
    protected Map<String, String> getColumnMaping() {
        return columnMapping;
    }
}
