package com.zzcm.webase.core.datatable;

import java.util.List;

/**
 * Created by Administrator on 2016/2/25.
 */
public class DTRes {
    /**
     * count
     */
    private long recordsTotal;
    /**
     * pageSize
     */
    private long recordsFiltered;
    /**
     * 请求回显
     */
    private String draw;
    /**
     * 数据
     */
    private List data;

    public long getRecordsTotal() {
        return recordsTotal;
    }

    public void setRecordsTotal(long recordsTotal) {
        this.recordsTotal = recordsTotal;
    }

    public long getRecordsFiltered() {
        return recordsFiltered;
    }

    public void setRecordsFiltered(long recordsFiltered) {
        this.recordsFiltered = recordsFiltered;
    }

    public String getDraw() {
        return draw;
    }

    public void setDraw(String draw) {
        this.draw = draw;
    }

	public List getData() {
        return data;
    }

    public void setData(List data) {
        this.data = data;
    }
}
