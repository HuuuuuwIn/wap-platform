package com.zzcm.webase.service;

import com.zzcm.webase.core.service.BaseService;
import com.zzcm.webase.model.Role;

import java.util.List;

/**
 * Created by Administrator on 2016/2/17.
 */
public interface RoleService extends BaseService<Role,Long> {
    /**
     * 通过用户id 查询用户 拥有的角色
     *
     * @param userId
     * @return
     */
    List<Role> selectRolesByUserId(Long userId);

    List<Role> selectByRole(Role role, int page, int size, String order);

    Role selectBySign(String sign);

    public boolean updateRolePerms(Long rid, List<Long> perms);

    int deleteRoleByPrimaryKey(Long id);

    List<Role> selectByPermId(Long id);
}
