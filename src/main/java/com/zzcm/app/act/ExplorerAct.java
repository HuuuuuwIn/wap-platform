package com.zzcm.app.act;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.zzcm.app.model.CodeJson;
import com.zzcm.app.model.ItemFile;
import com.zzcm.app.service.ExplorerService;
import com.zzcm.app.util.AppPath;


@Controller
@RequestMapping("/explorer")
public class ExplorerAct {

    private final static Logger logger = LoggerFactory.getLogger(ExplorerAct.class);

	@Autowired
	private ExplorerService explorerService;

    @RequestMapping(value="/uploads", method = RequestMethod.POST)
    public @ResponseBody
    CodeJson uploads(MultipartHttpServletRequest request) {
        //获取上传文件集合中名称集合
        Iterator<String> itr =  request.getFileNames();

        //遍例集合
        while(itr.hasNext()){

            //通过request的getFile方法获取MultipartFile类型文件
            MultipartFile mpf = request.getFile(itr.next());
            try {
                String outPath = AppPath.WebRoot()+"uploads/"+mpf.getName()+mpf.getOriginalFilename();
                FileCopyUtils.copy(mpf.getBytes(),new File(outPath));
            } catch (IOException e) {
                logger.error("IOException", e);
            }
        }

        return new CodeJson();
    }
	
	@RequestMapping("/viewlist")
	public @ResponseBody List<ItemFile> viewList(@RequestParam(required=false)String path){
		return explorerService.dirFile(AppPath.WebRoot()+"..\\view\\", path);
	}
	
	@RequestMapping("/weblist")
	public @ResponseBody List<ItemFile> webList(@RequestParam(required=false)String path){
		return explorerService.dirFile(AppPath.WebRoot()+"..\\..\\", path);
	}
	
	@RequestMapping("/upload")
	public @ResponseBody List<ItemFile> uploadList(@RequestParam(required=false)String path){
		return explorerService.dirFile(AppPath.WebRoot()+"uploads", path);
	}

}
