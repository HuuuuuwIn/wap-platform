package com.zzcm.webase.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Table(name = "role")
public class Role {
    /**
     * 角色id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 角色名
     */
    @Column(name = "role_name")
    private String roleName;

    /**
     * 角色标识,程序中判断使用,如"admin"
     */
    @Column(name = "role_sign")
    private String roleSign;

    /**
     * 角色描述,UI界面显示使用
     */
    private String description;

    private Set<Permission> permissions = new HashSet<Permission>();

    /**
     * 获取角色id
     *
     * @return id - 角色id
     */
    public Long getId() {
        return id;
    }

    /**
     * 设置角色id
     *
     * @param id 角色id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取角色名
     *
     * @return role_name - 角色名
     */
    public String getRoleName() {
        return roleName;
    }

    /**
     * 设置角色名
     *
     * @param roleName 角色名
     */
    public void setRoleName(String roleName) {
        this.roleName = roleName == null ? null : roleName.trim();
    }

    /**
     * 获取角色标识,程序中判断使用,如"admin"
     *
     * @return role_sign - 角色标识,程序中判断使用,如"admin"
     */
    public String getRoleSign() {
        return roleSign;
    }

    /**
     * 设置角色标识,程序中判断使用,如"admin"
     *
     * @param roleSign 角色标识,程序中判断使用,如"admin"
     */
    public void setRoleSign(String roleSign) {
        this.roleSign = roleSign == null ? null : roleSign.trim();
    }

    /**
     * 获取角色描述,UI界面显示使用
     *
     * @return description - 角色描述,UI界面显示使用
     */
    public String getDescription() {
        return description;
    }

    /**
     * 设置角色描述,UI界面显示使用
     *
     * @param description 角色描述,UI界面显示使用
     */
    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions;
    }
}