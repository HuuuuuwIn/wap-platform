package com.zzcm.webase.service.impl;

import com.zzcm.webase.core.service.BaseServiceImpl;
import com.zzcm.webase.dao.CountryMapper;
import com.zzcm.webase.model.Country;
import com.zzcm.webase.page.PageHelper;
import com.zzcm.webase.service.CountryService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2016/2/17.
 */
@Service
public class CountryServiceImpl extends BaseServiceImpl<Country,Integer,CountryMapper> implements CountryService {

    @Override
    public List<Country> selectByCountry(Country country, int page, int size,String order) {
        PageHelper.startPage(page, size,order);
        return readDao.selectByCountry(country);
    }
}
