package com.zzcm.webase.service;

import com.zzcm.webase.core.service.BaseService;
import com.zzcm.webase.model.Permission;

import java.util.List;

/**
 * Created by Administrator on 2016/2/17.
 */
public interface PermissionService extends BaseService<Permission,Long> {
    /**
     * 通过角色id 查询角色 拥有的权限
     *
     * @param roleId
     * @return
     */
    List<Permission> selectPermissionsByRoleId(Long roleId);

    List<Permission> selectByPermission(Permission permission, int page, int size, String order);

    Permission selectBySign(String sign);
}
