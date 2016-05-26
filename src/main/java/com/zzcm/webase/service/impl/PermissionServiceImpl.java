package com.zzcm.webase.service.impl;

import com.zzcm.webase.core.service.BaseServiceImpl;
import com.zzcm.webase.dao.PermissionMapper;
import com.zzcm.webase.model.Permission;
import com.zzcm.webase.page.PageHelper;
import com.zzcm.webase.service.PermissionService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2016/2/17.
 */
@Service
public class PermissionServiceImpl extends BaseServiceImpl<Permission,Long,PermissionMapper> implements PermissionService {
    @Override
    public List<Permission> selectPermissionsByRoleId(Long roleId) {
        return readDao.selectPermissionsByRoleId(roleId);
    }

    @Override
    public List<Permission> selectByPermission(Permission permission, int page, int size, String order) {
        if(size<0) return readDao.selectByPermission(permission);
        PageHelper.startPage(page, size, order);
        return readDao.selectByPermission(permission);
    }

    @Override
    public Permission selectBySign(String sign) {
        return readDao.selectBySign(sign);
    }
}
