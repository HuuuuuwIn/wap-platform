package com.zzcm.webase.service;

import com.zzcm.webase.core.service.BaseService;
import com.zzcm.webase.model.Permission;
import com.zzcm.webase.model.User;

import java.util.List;
import java.util.Set;

/**
 * Created by Administrator on 2016/2/17.
 */
public interface UserService extends BaseService<User,Long> {
    /**
     * 用户验证
     *
     * @param user
     * @return
     */
    User authentication(User user);
    /**
     * 根据用户名查询用户
     *
     * @param username
     * @return
     */
    User selectByUsername(String username);

    public Set<Permission> getAllPermission(Long userId);

    User selectUserInfoByName(String username);

    List<User> selectByUser(User user, int page, int size, String order);

    public boolean updateUserRoles(Long uid, List<Long> roles);

    int deleteUserByPrimaryKey(Long id);

    List<User> selectByRoleId(Long id);
}
