package com.zzcm.webase.act.common;

import com.zzcm.webase.core.datatable.DTReq;
import com.zzcm.webase.core.datatable.DTRes;
import com.zzcm.webase.model.Permission;
import com.zzcm.webase.model.Role;
import com.zzcm.webase.page.PageInfo;
import com.zzcm.webase.service.PermissionService;
import com.zzcm.webase.service.RoleService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/3/4.
 */
@Controller
@RequestMapping("/perm")
public class PermissionAct extends BaseAct {

    @Resource
    private PermissionService permissionService;
    @Resource
    private RoleService roleService;

    private static Map<String,String> columnMapping = new HashMap<>();
    static {
        columnMapping.put("permissionName","permission_name");
        columnMapping.put("permissionSign","permission_sign");
    }

    @Override
    protected Map<String, String> getColumnMaping() {
        return columnMapping;
    }

    @RequestMapping(value = {"/list"})
    @ResponseBody
    public DTRes test(Permission permission,HttpServletRequest request,HttpServletResponse response,Model model){
        //showParams(request);

        DTReq req = getDtReq(request);

        List<Permission> list = permissionService.selectByPermission(permission, req.getStart() / req.getLength() + 1, req.getLength(), req.getOrder());

        PageInfo pageInfo = new PageInfo<Permission>(list);

        DTRes dtBean = new DTRes();
        dtBean.setDraw(req.getDraw());
        dtBean.setRecordsFiltered(pageInfo.getTotal());
        dtBean.setRecordsTotal(pageInfo.getTotal());
        dtBean.setData(pageInfo.getList());
//        return json(dtBean);
        return dtBean;
    }

    @RequestMapping(value = "/save.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"perm:add","perm:update"})
    @ResponseBody
    public String saveJson(Permission permission) {
        if (permission.getId() != null) {
            permissionService.updateByPrimaryKey(permission);
        } else {
            permissionService.insert(permission);
        }
        return json("success");
    }

    @RequestMapping(value = "/unique.json", method = RequestMethod.POST)
    @RequiresAuthentication
    @ResponseBody
    public Boolean unique(String sign,Long id) {
        if(isBlank(sign)) return false;
        Permission permission = permissionService.selectBySign(sign);
        if(null!=permission && null!=id && permission.getId().longValue()==id.longValue())
            return true;
        return permission==null;
    }

    @RequestMapping(value = "/get.json")
    @RequiresAuthentication
    @ResponseBody
    public Permission get(Long id) {
        if(null==id) return null;
        Permission permission = permissionService.selectByPrimaryKey(id);
        return permission;
    }

    @RequestMapping(value = "/delete.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"perm:delete"})
    @ResponseBody
    public Map<String,Object> delete(Long id) {
        Map<String,Object> map = new HashMap<>();
        if(null==id || id <= 0) {
            map.put("result",false);
            map.put("msg","ID is null.");
            return map;
        }
        List<Role> roles = roleService.selectByPermId(id);
        if(null==roles || roles.isEmpty()) {
            permissionService.deleteByPrimaryKey(id);
            map.put("result",true);
            map.put("msg","删除成功");
        }else{
            map.put("result",false);
            map.put("msg","有关联角色");
        }
        return map;
    }

}
