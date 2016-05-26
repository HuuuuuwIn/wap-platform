package com.zzcm.webase.common.resolver;

import com.zzcm.webase.listener.FileUploadProgressListener;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUpload;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by Administrator on 2016/2/23.
 */
public class ZzcmMultipartResolver extends CommonsMultipartResolver{

    private HttpServletRequest request;

    @Override
    protected FileUpload newFileUpload(FileItemFactory fileItemFactory) {
        ServletFileUpload upload = new ServletFileUpload(fileItemFactory);
        upload.setSizeMax(-1);
        if (request != null) {
            HttpSession session = request.getSession();
            FileUploadProgressListener progressListener = new FileUploadProgressListener(session);
            upload.setProgressListener(progressListener);
        }
        return upload;
    }

    @Override
    public MultipartHttpServletRequest resolveMultipart(HttpServletRequest request) throws MultipartException {
        return super.resolveMultipart(request);
    }

    @Override
    protected MultipartParsingResult parseRequest(HttpServletRequest request) throws MultipartException {
        return super.parseRequest(request);
    }
}
