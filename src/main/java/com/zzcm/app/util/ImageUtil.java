package com.zzcm.app.util;

import java.awt.Graphics;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.awt.image.CropImageFilter;
import java.awt.image.FilteredImageSource;
import java.awt.image.ImageFilter;
import java.io.File;
import java.math.BigDecimal;
import java.net.URL;
import java.util.Iterator;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import com.zzcm.app.model.FileMeta;

public class ImageUtil {

//	private static Logger logger = LoggerFactory.getLogger(ImageUtil.class);
	
	public static float ratio = 1.4f;
	public static int scale = 2;
	
	public static FileMeta imgCut(String srcImageFile,String destPath, int x, int y, int desWidth,int desHeight,int scale) throws Exception {
		FileMeta fileMeta = new FileMeta();
		try {
			Image img = null;
			ImageFilter cropFilter = null;
			URL url = new URL(srcImageFile);
			BufferedImage bi = ImageIO.read(url);
			int srcWidth = bi.getWidth();
			int srcHeight = bi.getHeight();
			BigDecimal b1 = new BigDecimal(srcWidth);
			BigDecimal b2 = new BigDecimal(srcHeight);
			BigDecimal b3 = new BigDecimal(scale);
			srcWidth = b1.divide(b3,Constant.scale,BigDecimal.ROUND_HALF_UP).intValue();
			srcHeight = b2.divide(b3,Constant.scale,BigDecimal.ROUND_HALF_UP).intValue();
			Image image = bi.getScaledInstance(srcWidth, srcHeight,Image.SCALE_DEFAULT);
			cropFilter = new CropImageFilter(x, y, desWidth, desHeight);
			img = Toolkit.getDefaultToolkit().createImage(new FilteredImageSource(image.getSource(), cropFilter));
			BufferedImage tag = new BufferedImage(desWidth, desHeight,BufferedImage.TYPE_INT_RGB);
			Graphics g = tag.getGraphics();
			g.drawImage(img, 0, 0, null);
			g.dispose();
			// 输出文件
			String fileName = UUID.randomUUID().toString().replaceAll("-", "")+".jpg";
			fileMeta.setFileName(fileName);
			boolean b =ImageIO.write(tag, "JPG", new File(destPath + "/" + fileName));
			if(!b) throw new Exception("ImageUtil.imgCut 59 : image cut error!");
		} catch (Exception e) {
			throw e;
		} 
		return fileMeta;
	}
	
	/**
     * @param srcImageFile      源图像文件图像地址
     * @param resultImageFile   缩放后的图像地址
     * @param scale             缩放比例
     * @param flag              缩放选择:true 放大; false 缩小;
     */
    public static void scale(String srcImageFile, String resultImageFile,
                             int scale, boolean flag){
        try{
            // 读去图片
            BufferedImage src = ImageIO.read(new File(srcImageFile));
            // 图片宽度
            int width = src.getWidth();
            // 图片高度
            int height = src.getHeight();
            if (flag){
                width = width * scale;
                height = height * scale;
            }else{
                // 缩小
                width = width / scale;
                height = height / scale;
            }
            Image image = src.getScaledInstance(width, height, Image.SCALE_DEFAULT);
            BufferedImage tag = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics g = tag.getGraphics();
            // 绘制处理后的图片
            g.drawImage(image, 0, 0, null);
            g.dispose();
            // 输出到文件
            ImageIO.write(tag, "JPEG", new File(resultImageFile));
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    
    public static String imgCut2(String srcPath,String destPath) throws Exception{
		Image img;
		ImageFilter cropFilter;
		URL url = new URL(srcPath);
		BufferedImage bi = ImageIO.read(url);
		int srcWidth = bi.getWidth();
		int srcHeight = bi.getHeight();
		int destWidth;
		int destHeight;
		BigDecimal b1 = new BigDecimal(srcWidth);
		BigDecimal b2 = new BigDecimal(srcHeight);
		float currRatio = b1.divide(b2,scale,BigDecimal.ROUND_HALF_UP).intValue();
		if(currRatio > ratio){
			destWidth = b2.multiply(new BigDecimal(ratio)).intValue();
			destHeight = srcHeight;
		}else if(currRatio < ratio){
			destWidth = srcWidth;
			destHeight = b1.divide(new BigDecimal(ratio),scale,BigDecimal.ROUND_HALF_UP).intValue();
		}else{
			destWidth = srcWidth;
			destHeight = srcHeight;	
		}
		Image image = bi.getScaledInstance(srcWidth, srcHeight,Image.SCALE_DEFAULT);
		cropFilter = new CropImageFilter(0, 0, destWidth, destHeight);
		img = Toolkit.getDefaultToolkit().createImage(new FilteredImageSource(image.getSource(), cropFilter));
		BufferedImage tag = new BufferedImage(destWidth, destHeight,BufferedImage.TYPE_INT_RGB);
		Graphics g = tag.getGraphics();
		g.drawImage(img, 0, 0, null);
		g.dispose();
		// 输出文件
		String fileName = UUID.randomUUID().toString().replaceAll("-", "")+".jpg";
		boolean b =ImageIO.write(tag, "JPG", new File(destPath + "/" + fileName));
		if(!b) return null;
		return fileName;
	}
    
    public static String getImageType(String path) {
    	try {
            ImageInputStream iis = ImageIO.createImageInputStream(new File(path));
            Iterator<ImageReader> iter = ImageIO.getImageReaders(iis);
            if (!iter.hasNext()) {
                return null;
            }
            ImageReader reader = iter.next();
            iis.close();
            return reader.getFormatName();
        } catch (Exception e) {
        	e.printStackTrace();
        	return null;
        }
	}
    
    
	public static void main(String[] args) throws Exception {
//		long curr = System.currentTimeMillis();
//		for (int i = 0; i < 200; i++) {
			imgCut2("E:/img/20160429/4f34bcf5cf2547d78cc05c18ae8aafdd.jpg","e:/img/");
//		}
//		System.out.println((System.currentTimeMillis() - curr));
//		imgCut("http://img02.tooopen.com/images/20160125/tooopen_sy_155392043992.jpg", "E:\\test2", 100, 100, 100, 100, 2);
	}
}
