package com.zzcm.webase.orm;

import com.zzcm.webase.orm.annotation.Write;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;

import java.lang.reflect.Method;

/**
 * Created by Administrator on 2016/2/18.
 */

//@Component
//@Aspect
//@Order(0)
public class DataSourceAop {

    //@Before("execution(* com.zzcm.webase.service.*.*(..))")
    public void before(JoinPoint point)
    {
        Object target = point.getTarget();
        String method = point.getSignature().getName();

        //获取接口
        //Class<?>[] classz = target.getClass().getInterfaces();
        Class<?> cls = target.getClass();

        Class<?>[] parameterTypes = ((MethodSignature) point.getSignature())
                .getMethod().getParameterTypes();
        try {
            //Method m = classz[0].getMethod(method, parameterTypes);
            Method m = cls.getMethod(method, parameterTypes);
            if (m != null && m.isAnnotationPresent(Write.class)) {
                //Write data = m.getAnnotation(Write.class);
                DynamicDataSourceHolder.putDataSource("write");
                System.out.println(cls.getCanonicalName()+" method:"+method+",use write.");
            }else{
                DynamicDataSourceHolder.putDataSource("read");
                System.out.println(cls.getCanonicalName()+" method:"+method+",use read.");
            }
        } catch (Exception e) {
            // TODO: handle exception
        }
    }

}
