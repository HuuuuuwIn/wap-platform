package com.zzcm.app.act;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.zzcm.app.model.FileMeta;
import com.zzcm.app.service.ArticleService;
import com.zzcm.app.util.Constant;
import com.zzcm.app.util.DateUtil;
import com.zzcm.app.util.ImageUtil;
import com.zzcm.app.util.MapUtils;
import com.zzcm.app.util.WapUtils;

@Controller
@RequestMapping("/upfile")
public class FileUploadAct {

	private final static Logger logger = LoggerFactory.getLogger(FileUploadAct.class);
	@Value("${imageUpload}")
	public String filePath;
    @Value("${imageRequest}")
	public String imageRequest;
	@Autowired
    private ArticleService articleService;
    
	@RequestMapping("/list")
	public String list(){
		return "upfile/list";
	}
	
	@RequestMapping(value = "/uploadImage/{isWH}/{iSize}", method = RequestMethod.POST)
	public @ResponseBody FileMeta uploadImage(MultipartHttpServletRequest request,
			HttpServletResponse response,@PathVariable Boolean isWH,@PathVariable Boolean iSize) {
		//boolean isWH = request.getParameter("isWH") == null ? false : true;
		return uploadToLocal(iSize,isWH,request,response);
	}

    private FileMeta uploadToLocal(boolean iSize,boolean isWH,MultipartHttpServletRequest request,HttpServletResponse response){
        FileMeta fileMeta = new FileMeta();
        //获取上传文件集合中名称集合
        Iterator<String> itr =  request.getFileNames();
        String fileName = "";
        FileInputStream imageStream = null;
        //遍例集合
        while(itr.hasNext()){
            //通过request的getFile方法获取MultipartFile类型文件
            MultipartFile mpf = request.getFile(itr.next());
            try {
                String suffix = mpf.getOriginalFilename().substring(mpf.getOriginalFilename().lastIndexOf("."));
                String datePath = DateUtil.getCurrentDay("yyyyMMdd");
                if(!new File(filePath + datePath).exists()){
                    new File(filePath + datePath).mkdirs();
                }
                fileName = datePath + "/" +UUID.randomUUID().toString().replaceAll("-", "")+suffix;
                String outPath = filePath+fileName ;
                File image = new File(outPath);
                FileCopyUtils.copy(mpf.getBytes(),image);
                if(isWH) {
                    imageStream = new FileInputStream(image);
                    BufferedImage sourceImg = ImageIO.read(imageStream);
                    int width = sourceImg.getWidth();
                    int height = sourceImg.getHeight();
                    imageStream.close();
                    //500 * 500
                    if (width >= Constant.MAX_WIDTH || height >= Constant.MAX_HEIGHT) {
                        fileMeta.setErrorMsg("图片尺寸必须在" + Constant.MAX_WIDTH + "*" + Constant.MAX_HEIGHT + "以内");
                        image.delete();
                    }
                }
                if(iSize && image != null && image.length() > 200000){
                    fileMeta.setErrorMsg("图片大小必须在200K以内");
                }
                fileMeta.setFileName(fileName);
                fileMeta.setFilePath(imageRequest);
                break;
            } catch (IOException e) {
                if(imageStream!=null){
                    try {
                        imageStream.close();
                    } catch (IOException e1) {
                        e1.printStackTrace();
                    }
                }
                fileMeta.setErrorMsg("图片上传失败");
                logger.error("IOException", e);
                break;
            }
        }
        return fileMeta;
    }
	
	@RequestMapping(value = "/uploadCKedit", method = RequestMethod.POST)
	public void uploadCKedit(MultipartHttpServletRequest request,
			HttpServletResponse response) {
		FileMeta fileMeta = uploadToLocal(true, false, request, response);
        String callback = request.getParameter("CKEditorFuncNum");   
        try {
			response.getWriter().println("<script type=\"text/javascript\">");
            if(StringUtils.isBlank(fileMeta.getErrorMsg()) == false){
                response.getWriter().println("alert('"+fileMeta.getErrorMsg()+"')");
                response.getWriter().println("window.parent.CKEDITOR.tools.callFunction("+ callback + ",'','')");
            }else{
                response.getWriter().println("window.parent.CKEDITOR.tools.callFunction("+ callback + ",'" +imageRequest+ fileMeta.getFileName() + "','')");
            }
			response.getWriter().println("</script>");
		} catch (IOException e) {
            logger.error("IOException",e);
		}  
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/cut")
	public @ResponseBody FileMeta cut(HttpServletRequest request){
		Map<String,Object> paramMap = WapUtils.build(request);
		FileMeta fileMeta = null;
		String path = WapUtils.isEmpty(paramMap.get("localPath")) ? ""  : paramMap.get("localPath") + "";
		int actionType = Integer.parseInt(paramMap.get("other") + "");
		int imageX = new BigDecimal(paramMap.get("cropX") + "").intValue();
        int imageY = new BigDecimal(paramMap.get("cropY") + "").intValue();
        int imageH = new BigDecimal(paramMap.get("cropH") + "").intValue();
        int imageW = new BigDecimal(paramMap.get("cropW") + "").intValue();
        int scale = new BigDecimal(paramMap.get("scale") + "").intValue();
        try {
        	String datePath = DateUtil.getCurrentDay("yyyyMMdd");
            if(!new File(filePath + datePath).exists()){
                new File(filePath + datePath).mkdirs();
            }
        	if(actionType == 1 || WapUtils.isEmpty(path)){
				fileMeta = ImageUtil.imgCut(paramMap.get("srcPath").toString(),filePath + datePath, 
						imageX, imageY, imageW, imageH,scale);
				fileMeta.setFilePath(imageRequest + datePath);
            	path = fileMeta.getFilePath() + "/" + fileMeta.getFileName();
            }
            if(actionType == 2){
            	int litpictype = Integer.parseInt(paramMap.get("litpicType").toString());
                String litpic = paramMap.get("litpic").toString();
                if(litpictype == 3){
                	String[] arr = litpic.split(",");
                	if(arr.length < 3){//图片不够还原默认图片
                		arr = new String[3];
                		String[] arrbak = WapUtils.getArray(request, "litpicbak[]");
                		for (int i = 0; i < arr.length; i++) {
                			String fileName = null;
                			if(i == 0){
                				FileMeta meta = ImageUtil.imgCut(paramMap.get("srcPath").toString(),filePath + datePath, 
                						imageX, imageY, imageW, imageH,scale);
                				fileName = meta.getFileName();
                			}else{
                				fileName = ImageUtil.imgCut2(arrbak[i], filePath + datePath);
                			}
                			if(fileName!=null){
                				arr[i] = imageRequest + datePath + "/" + fileName;
                			}
						}
                	}else{
                		int litpicIndex = Integer.parseInt(paramMap.get("litpicIndex") + "");
                		arr[litpicIndex] = path;
                	}
                	litpic = StringUtils.join(arr,",");
                }else{
                	litpic = path;
                }
            	Map map = MapUtils.add("id", paramMap.get("dependence")).add("litpic", litpic)
            			.add("litpictype", litpictype);
            	articleService.updateLitpic(map);
            }
        } catch (Exception e) {
			logger.error(e.getMessage(),e);
			fileMeta.setErrorMsg(e.getMessage());
		}
        return fileMeta;
	}
}
