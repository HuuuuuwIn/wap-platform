package com.zzcm.webase.dao;

import com.zzcm.webase.core.dao.BaseDao;
import com.zzcm.webase.model.RolePermission;

public interface RolePermissionMapper extends BaseDao<RolePermission,Long> {
    public int deleteByRoleId(Long roleId);
}