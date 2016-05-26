package com.zzcm.webase.dao;

import com.zzcm.webase.core.dao.BaseDao;
import com.zzcm.webase.model.Country;

import java.util.List;

public interface CountryMapper extends BaseDao<Country,Integer> {

    public List<Country> selectByCountry(Country country);
}