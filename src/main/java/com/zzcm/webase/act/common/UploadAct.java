package com.zzcm.webase.act.common;

import com.alibaba.fastjson.JSON;
import com.zzcm.webase.page.StringUtil;
import org.apache.commons.io.FilenameUtils;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Administrator on 2016/2/23.
 */
@Controller
public class UploadAct extends BaseAct{

    public static final String SEP = File.separator;

    private static final Object LOCK = new Object();

    @Value("${file.upload.path}")
    private String filePath;

    @RequestMapping(value = "/upload/test")
    public String test(){
        return "upload/index";
    }


    @RequestMapping(value = "/upload",method = RequestMethod.POST)
    public String upload(@RequestParam(value = "file_data", required = false) MultipartFile file,MultipartHttpServletRequest request,HttpServletResponse response)throws IOException{
        Map<String, Object> result = new HashMap<String, Object>();
        if(StringUtil.isEmpty(filePath)){
            response.setStatus(HttpStatus.UNPROCESSABLE_ENTITY.value());
            result.put("message", "filePath is empty.");
            return ajaxJson(JSON.toJSONString(result),response);
        }

        //暂时按天存储,若需求过大则择情修改
        DateTime dateTime = new DateTime();
        //MultipartFile file = request.getFile("file");
        if(null==file || file.getSize() <= 0){
            response.setStatus(HttpStatus.UNPROCESSABLE_ENTITY.value());
            result.put("message", "file is null.");
            return ajaxJson(JSON.toJSONString(result),response);
        }
        String orgFileName = file.getOriginalFilename();
        orgFileName = (orgFileName == null) ? "" : orgFileName;
        Pattern p = Pattern.compile("\\s|\t|\r|\n");
        Matcher m = p.matcher(orgFileName);
        orgFileName = m.replaceAll("_");
        String suffix = FilenameUtils.getExtension(orgFileName).toLowerCase();
        StringBuilder saveDir = new StringBuilder(filePath);
        saveDir.append(SEP).append(suffix).append(SEP).append(dateTime.getYear()).append(SEP)
                .append(dateTime.getMonthOfYear()).append(SEP).append(dateTime.getDayOfMonth()).append(SEP);
        File dir = new File(saveDir.toString());
        checkDir(dir);
        //暂时采用UUID作为文件名
        String newFileName = UUID.randomUUID().toString().replaceAll("-","").concat(".").concat(suffix);
        File targetFile = new File(dir,newFileName);
        file.transferTo(targetFile);

        result.put("status", "success");
        result.put("message", "上传成功");
        result.put("fileName",targetFile.getAbsolutePath());
        return ajaxHtml(JSON.toJSONString(result),response);
    }

    private void checkDir(File file){
        if(!file.exists()){
            synchronized (LOCK){
                if(!file.exists()){
                    file.mkdirs();
                }
            }
        }
    }


}
