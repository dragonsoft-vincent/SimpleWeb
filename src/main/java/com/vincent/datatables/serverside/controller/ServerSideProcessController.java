package com.vincent.datatables.serverside.controller;
 
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.gson.Gson;
 
@Controller
@RequestMapping(value="/datatables")
public class ServerSideProcessController {
	
	private static enum ORDER_VALUE {
		asc, desc
	};
 
	@ResponseBody
	@RequestMapping(value="/getData", method = RequestMethod.POST)
	public String getData(int draw, int start, int length, @RequestParam("order[0][column]") final int orderIndex, @RequestParam("order[0][dir]") final String orderValue) {
		Map<String, Object> result = Maps.newHashMap();
		List<String[]> data  = Lists.newArrayList();
		for (int i = 0, total = 500; i < total; i++) {
			String[] record = new String[6];
			int j = i + 1;
			if (i % 3 == 0) {
				record[0] = i + "-1";
				record[1] = i + "-2";
				record[2] = j + "-3";
				record[3] = j + "-4";
				record[4] = j + "-5";
				record[5] = j + "-6";
			}else{
				record[0] = j + "-1";
				record[1] = j + "-2";
				record[2] = j + "-3";
				record[3] = j + "-4";
				record[4] = j + "-5";
				record[5] = j + "-6";
			}
			
			data.add(record);
		}
		
		Collections.sort(data, new Comparator<String[]>() {
            @Override
            public int compare(final String[] entry1, final String[] entry2) {
                final Integer value1 = Integer.valueOf(entry1[orderIndex].split("-")[0]);
                final Integer value2 = Integer.valueOf(entry2[orderIndex].split("-")[0]);
                if(orderValue.trim().equals(ORDER_VALUE.asc.name())){
                	return value1.compareTo(value2);
                }else{
                	return value2.compareTo(value1);
                }
            }
        });

		int fromIndex = start;
		int toIndex = start + length;
		
		if( toIndex > data.size()){
			toIndex = data.size();
		}
		List<String[]> returnData = data.subList(fromIndex, toIndex);
		result.put("draw", draw);
		result.put("recordsTotal", 500);
		result.put("recordsFiltered", 500);
		result.put("data", returnData);
		
		Gson gson = new Gson();
		
		return gson.toJson(result);
	}
}