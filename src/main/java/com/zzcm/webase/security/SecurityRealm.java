package com.zzcm.webase.security;

import com.zzcm.webase.model.Permission;
import com.zzcm.webase.model.Role;
import com.zzcm.webase.model.User;
import com.zzcm.webase.service.PermissionService;
import com.zzcm.webase.service.RoleService;
import com.zzcm.webase.service.UserService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;

/**
 * Shiro用户身份验证
 * Created by Administrator on 2016/2/17.
 */
@Component(value = "securityRealm")
public class SecurityRealm extends AuthorizingRealm{

    @Resource
    private UserService userService;
    @Resource
    private RoleService roleService;
    @Resource
    private PermissionService permissionService;


    /**
     * 权限检查
     * @param principalCollection
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        String username = String.valueOf(principalCollection.getPrimaryPrincipal());

        final User user = userService.selectByUsername(username);
        if(null==user) return null;
        final List<Role> roles = roleService.selectRolesByUserId(user.getId());
        if(null!=roles){
            for (Role role : roles) {
                authorizationInfo.addRole(role.getRoleSign());
                final List<Permission> permissions = permissionService.selectPermissionsByRoleId(role.getId());
                if(null!=permissions)
                    for (Permission permission : permissions) {
                        authorizationInfo.addStringPermission(permission.getPermissionSign());
                    }
            }
        }
        return authorizationInfo;
    }

    /**
     * 登录验证
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        String username = String.valueOf(authenticationToken.getPrincipal());
        String password = new String((char[])authenticationToken.getCredentials());
        final User user = userService.authentication(new User(username,password));
        if(null==user){
            throw new AuthenticationException("用户名或密码错误.");
        }
        SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(username,password,getName());
        return authenticationInfo;
    }
}
