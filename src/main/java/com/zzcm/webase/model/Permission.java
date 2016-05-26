package com.zzcm.webase.model;

import javax.persistence.*;

@Table(name = "permission")
public class Permission {
    /**
     * 权限id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 权限名
     */
    @Column(name = "permission_name")
    private String permissionName;

    /**
     * 权限标识,程序中判断使用,如"user:create"
     */
    @Column(name = "permission_sign")
    private String permissionSign;

    /**
     * 权限描述,UI界面显示使用
     */
    private String description;

    /**
     * 获取权限id
     *
     * @return id - 权限id
     */
    public Long getId() {
        return id;
    }

    /**
     * 设置权限id
     *
     * @param id 权限id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取权限名
     *
     * @return permission_name - 权限名
     */
    public String getPermissionName() {
        return permissionName;
    }

    /**
     * 设置权限名
     *
     * @param permissionName 权限名
     */
    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName == null ? null : permissionName.trim();
    }

    /**
     * 获取权限标识,程序中判断使用,如"user:create"
     *
     * @return permission_sign - 权限标识,程序中判断使用,如"user:create"
     */
    public String getPermissionSign() {
        return permissionSign;
    }

    /**
     * 设置权限标识,程序中判断使用,如"user:create"
     *
     * @param permissionSign 权限标识,程序中判断使用,如"user:create"
     */
    public void setPermissionSign(String permissionSign) {
        this.permissionSign = permissionSign == null ? null : permissionSign.trim();
    }

    /**
     * 获取权限描述,UI界面显示使用
     *
     * @return description - 权限描述,UI界面显示使用
     */
    public String getDescription() {
        return description;
    }

    /**
     * 设置权限描述,UI界面显示使用
     *
     * @param description 权限描述,UI界面显示使用
     */
    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }
}