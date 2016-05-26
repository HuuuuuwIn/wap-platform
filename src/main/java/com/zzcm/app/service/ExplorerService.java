package com.zzcm.app.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.stereotype.Service;

import com.zzcm.app.model.ItemFile;



/**
 * 文件管理器
 * @author Administrator
 *
 */
@Service
public class ExplorerService {
	
	/**
	 * 获取指定文件夹下文件和目录
	 * @param root 根目录
	 * @param path 相对路径
	 * @return
	 */
	public List<ItemFile> dirFile(String root,String path){
		List<ItemFile> list = new ArrayList<ItemFile>();
		String dirpath = root + path;
		File dir = new File(dirpath);
		if(dir.isDirectory()){
			for(String sing : dir.list()){
				ItemFile item = new ItemFile();
				item.setRoot(root);
				item.setPath(path);
				
				File temFile = new File(dirpath+sing);
				item.setId(temFile.hashCode());
				item.setIsdir(temFile.isDirectory());
				item.setName(temFile.getName());
				item.setAllpath(temFile.getPath());
				item.setSize(temFile.length());
                item.setLastModified(DateFormatUtils.format(temFile.lastModified(),"yyyy-MM-dd HH:mm:ss"));

				list.add(item);
			}
		}
        //排序
        Collections.sort(list, new Comparator<ItemFile>() {
            public int compare(ItemFile before, ItemFile after) {
                return before.getName().compareTo(after.getName());
            }
        });
		return list.size() == 0 ? null : list;
	}
	
}
