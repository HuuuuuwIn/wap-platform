package com.zzcm.webase.core.mybatis.provider;

import com.zzcm.webase.core.mybatis.entity.EntityField;
import com.zzcm.webase.core.mybatis.util.FieldUtil;

import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.Iterator;
import java.util.List;

/**
 * Created by Administrator on 2016/2/22.
 */
public class BaseProvider<T> {

    protected Class<T> beanClass;
    private String tableName;
    private List<EntityField> fields;
    private EntityField id;

    public String updateByPrimaryKey(T record){
        StringBuilder sb = new StringBuilder();
        sb.append("update ").append(getTableName(record)).append(" set ");

        List<EntityField> entityFields = getFields();
        for (int i = 0; i < entityFields.size(); i++) {
            EntityField entityField = entityFields.get(i);
            sb.append(entityField.getName()).append("=").append("#{"+entityField.getField().getName()+"}");
            if(i!=entityFields.size()-1){
                sb.append(",");
            }
        }

        sb.append(" where ").append(id.getName()).append("=").append("#{").append(id.getName()).append("} ");
        return sb.toString();
    }

    /**
     * 根据@javax.persistence.Table注解获取表名
     * @return
     */
    private String getTableName(T record){
        if(null==tableName || "".equals(tableName)){
            Class<T> clz = getBeanClass(record);
            if(!clz.isAnnotationPresent(Table.class)){
                throw new RuntimeException("Entity["+clz.getCanonicalName()+"] has not found @Table annotation.");
            }
            Table  table = clz.getAnnotation(Table.class);
            tableName = table.name();
        }
        return tableName;
    }

    private List<EntityField> getFields(){
        if(null==fields){
            List<EntityField> efs = FieldUtil.getFields(getBeanClass());
            Iterator<EntityField> iter = efs.iterator();
            while(iter.hasNext()){
                EntityField field = iter.next();
                if(field.isAnnotationPresent(Transient.class)) iter.remove();
                if(field.isAnnotationPresent(Id.class)) {
                    id = field;
                    iter.remove();
                }
            }
            fields = efs;
        }
        return fields;
    }

    /**
     * 通过反射获取实体的类型
     * @return
     */
    protected Class<T> getBeanClass(T record){
        if(null == beanClass){
            //ParameterizedType parameterizedType = (ParameterizedType)this.getClass().getGenericSuperclass();
            //beanClass = (Class<T>)parameterizedType.getActualTypeArguments()[0];
            beanClass = (Class)record.getClass();
        }

        return beanClass;
    }

    protected Class<T> getBeanClass(){
        return beanClass;
    }

}
