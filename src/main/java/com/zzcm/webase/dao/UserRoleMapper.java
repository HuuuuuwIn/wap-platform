package com.zzcm.webase.dao;

import com.zzcm.webase.core.dao.BaseDao;
import com.zzcm.webase.model.UserRole;


public interface UserRoleMapper extends BaseDao<UserRole,Long> {
    public int deleteByUserId(Long userId);
}