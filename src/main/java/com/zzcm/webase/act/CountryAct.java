package com.zzcm.webase.act;

import com.zzcm.webase.act.common.BaseAct;
import com.zzcm.webase.core.datatable.DTReq;
import com.zzcm.webase.core.datatable.DTRes;
import com.zzcm.webase.model.Country;
import com.zzcm.webase.page.PageInfo;
import com.zzcm.webase.service.CountryService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * Created by Administrator on 2016/2/17.
 */
@Controller
@RequestMapping(value = "/country")
public class CountryAct extends BaseAct{

    @Resource
    private CountryService countryService;

    @RequestMapping(value = {"/list"})
    public String getList(Country country,
                          @RequestParam(required = false, defaultValue = "1") int page,
                          @RequestParam(required = false, defaultValue = "10") int rows,Model model){
        List<Country> countryList = countryService.selectByCountry(country,page,rows,null);
        model.addAttribute("pageInfo",new PageInfo<Country>(countryList));
        model.addAttribute("queryParam",country);
        model.addAttribute("page",page);
        model.addAttribute("rows",rows);
        return "country/index";
    }

    @RequestMapping(value = {"/test"})
    @ResponseBody
    public String test(Country country,HttpServletRequest request,HttpServletResponse response,Model model){
        //showParams(request);

        DTReq req = getDtReq(request);
        System.out.println("start:"+req.getStart()+",len:"+req.getLength());

        List<Country> list = countryService.selectByCountry(country,req.getStart()/req.getLength()+1,req.getLength(),req.getOrder());
        PageInfo pageInfo = new PageInfo<Country>(list);

        DTRes dtBean = new DTRes();
        dtBean.setDraw(req.getDraw());
        dtBean.setRecordsFiltered(pageInfo.getTotal());
        dtBean.setRecordsTotal(pageInfo.getTotal());
        dtBean.setData(pageInfo.getList());
        return json(dtBean);
    }

    @RequestMapping(value = "view", method = RequestMethod.GET)
    public String view(Country country,Model model) {
        if (country.getId() != null) {
            country = countryService.selectByPrimaryKey(country.getId());
        }
        model.addAttribute("country", country);
        return "country/view";
    }

    @RequestMapping(value = "/save.json", method = RequestMethod.POST)
    @RequiresPermissions(value = {"country:save"})
    @ResponseBody
    public String saveJson(Country country) {
        if (country.getId() != null) {
            countryService.updateByPrimaryKey(country);
        } else {
            countryService.insert(country);
        }
        return json("success");
    }

    @RequestMapping(value = "save", method = RequestMethod.POST)
    public String save(Country country) {
        if (country.getId() != null) {
            countryService.updateByPrimaryKey(country);
        } else {
            countryService.insert(country);
        }
        return "redirect:list";
    }

    @RequestMapping("delete")
    public String delete(Integer id) {
        countryService.deleteByPrimaryKey(id);
        return "redirect:list";
    }

}
