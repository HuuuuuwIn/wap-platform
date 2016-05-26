package com.zzcm.webase.dao;

import com.zzcm.webase.core.dao.BaseDao;
import com.zzcm.webase.model.Role;
import com.zzcm.webase.model.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RoleMapper extends BaseDao<Role,Long> {
    /**
     * 通过用户id 查询用户 拥有的角色
     *
     * @param userId
     * @return
     */
    List<Role> selectRolesByUserId(Long userId);

    List<Role> selectByRole(Role role);

    public Role selectBySign(@Param("sign") String sign);

    List<Role> selectByPermId(Long id);
}