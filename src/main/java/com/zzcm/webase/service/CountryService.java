package com.zzcm.webase.service;

import com.zzcm.webase.core.service.BaseService;
import com.zzcm.webase.model.Country;

import java.util.List;

/**
 * Created by Administrator on 2016/2/17.
 */
public interface CountryService extends BaseService<Country,Integer> {
    List<Country> selectByCountry(Country country,int page,int size,String order);


}
