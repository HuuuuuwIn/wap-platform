package com.zzcm.webase.service.impl;

import com.zzcm.webase.core.service.BaseServiceImpl;
import com.zzcm.webase.dao.RoleMapper;
import com.zzcm.webase.dao.RolePermissionMapper;
import com.zzcm.webase.dao.UserRoleMapper;
import com.zzcm.webase.model.Role;
import com.zzcm.webase.model.RolePermission;
import com.zzcm.webase.page.PageHelper;
import com.zzcm.webase.service.RoleService;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by Administrator on 2016/2/17.
 */
@Service
public class RoleServiceImpl extends BaseServiceImpl<Role,Long,RoleMapper> implements RoleService {
    @Resource
    private RolePermissionMapper rolePermissionMapper;

    @Resource(name = "writeSqlSession")
    public void setRolePermissionMapper(SqlSession sqlSession) {
        this.rolePermissionMapper = sqlSession.getMapper(RolePermissionMapper.class);
    }

    @Override
    public List<Role> selectRolesByUserId(Long userId) {
        return readDao.selectRolesByUserId(userId);
    }

    @Override
    public List<Role> selectByRole(Role role,int page,int size,String order) {
        if(size<0) return readDao.selectByRole(role);
        PageHelper.startPage(page, size, order);
        return readDao.selectByRole(role);
    }
    @Override
    public Role selectBySign(String sign) {
        return readDao.selectBySign(sign);
    }

    @Override
    public boolean updateRolePerms(Long rid, List<Long> perms) {
        if(null!=rid && null!=perms){
            rolePermissionMapper.deleteByRoleId(rid);
            for (Long perm : perms) {
                RolePermission rp = new RolePermission();
                rp.setRoleId(rid);
                rp.setPermissionId(perm);
                rolePermissionMapper.insert(rp);
            }
            return true;
        }
        return false;
    }

    @Override
    public int deleteRoleByPrimaryKey(Long id) {
        rolePermissionMapper.deleteByRoleId(id);
        return deleteByPrimaryKey(id);
    }

    @Override
    public List<Role> selectByPermId(Long id) {
        return readDao.selectByPermId(id);
    }
}
