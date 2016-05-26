package com.zzcm.webase.dao;

import com.zzcm.webase.core.dao.BaseDao;
import com.zzcm.webase.model.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper extends BaseDao<User,Long> {
    /**
     * 用户登录验证查询
     *
     * @param record
     * @return
     */
    User authentication(@Param("record") User record);

    public List<User> selectByUsername(String username);

    public User selectUserInfoByName(String username);

    List<User> selectByUser(User user);

    List<User> selectByRoleId(Long id);
}