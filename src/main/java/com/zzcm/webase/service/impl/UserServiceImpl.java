package com.zzcm.webase.service.impl;

import com.zzcm.webase.core.service.BaseServiceImpl;
import com.zzcm.webase.dao.UserMapper;
import com.zzcm.webase.dao.UserRoleMapper;
import com.zzcm.webase.model.Permission;
import com.zzcm.webase.model.Role;
import com.zzcm.webase.model.User;
import com.zzcm.webase.model.UserRole;
import com.zzcm.webase.page.PageHelper;
import com.zzcm.webase.service.PermissionService;
import com.zzcm.webase.service.RoleService;
import com.zzcm.webase.service.UserService;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by Administrator on 2016/2/17.
 */
@Service
public class UserServiceImpl extends BaseServiceImpl<User,Long,UserMapper> implements UserService {

    @Resource
    private RoleService roleService;
    @Resource
    private PermissionService permissionService;

    private UserRoleMapper userRoleMapper;

    @Resource(name = "writeSqlSession")
    public void setUserRoleMapper(SqlSession sqlSession) {
        this.userRoleMapper = sqlSession.getMapper(UserRoleMapper.class);
    }

    @Override
    public User authentication(User user) {
        return readDao.authentication(user);
    }

    @Override
    public User selectByUsername(String username) {
        List<User> list = readDao.selectByUsername(username);
        if(null==list || list.isEmpty()) return null;
        return list.get(0);
    }

    @Override
    public Set<Permission> getAllPermission(Long userId) {
        final List<Role> roles = roleService.selectRolesByUserId(userId);
        Set<Permission> permissions = new HashSet<Permission>();
        if(null!=roles){
            for (Role role : roles) {
                final List<Permission> pms = permissionService.selectPermissionsByRoleId(role.getId());
                if(null!=permissions) permissions.addAll(pms);
            }
        }
        return permissions;
    }

    @Override
    public User selectUserInfoByName(String username) {
        return readDao.selectUserInfoByName(username);
    }

    @Override
    public List<User> selectByUser(User user, int page, int size, String order) {
        if(size<0){
            return readDao.selectByUser(user);
        }
        PageHelper.startPage(page, size, order);
        return readDao.selectByUser(user);
    }

    @Override
    public boolean updateUserRoles(Long uid, List<Long> roles) {
        if(null!=uid && null!=roles){
            userRoleMapper.deleteByUserId(uid);
            for (Long role : roles) {
                UserRole ur = new UserRole();
                ur.setUserId(uid);
                ur.setRoleId(role);
                userRoleMapper.insert(ur);
            }
            return true;
        }
        return false;
    }

    @Override
    public int deleteUserByPrimaryKey(Long id) {
        userRoleMapper.deleteByUserId(id);
        return deleteByPrimaryKey(id);
    }

    @Override
    public List<User> selectByRoleId(Long id) {
        return readDao.selectByRoleId(id);
    }
}
