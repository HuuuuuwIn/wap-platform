package com.zzcm.webase.dao;

import com.zzcm.webase.core.dao.BaseDao;
import com.zzcm.webase.model.Permission;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PermissionMapper extends BaseDao<Permission,Long> {
    /**
     * 通过角色id 查询角色 拥有的权限
     *
     * @param roleId
     * @return
     */
    List<Permission> selectPermissionsByRoleId(Long roleId);

    List<Permission> selectByPermission(Permission permission);

    public Permission selectBySign(@Param("sign") String sign);
}