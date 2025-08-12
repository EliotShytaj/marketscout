package com.marketscout.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChartService {
    private final RestTemplate rest;
    private final String tdKey;

    public ChartService(RestTemplate rest,
                        @Value("${twelvedata.api.key}") String tdKey) {
        this.rest  = rest;
        this.tdKey = tdKey;
    }
    public String getTimeSeries(String symbol,
                                String interval,
                                String startDate,
                                String endDate) {
        String url = String.format(
                "https://api.twelvedata.com/time_series" +
                        "?symbol=%s&interval=%s&start_date=%s&end_date=%s&apikey=%s",
                symbol, interval, startDate, endDate, tdKey
        );
        return rest.getForObject(url, String.class);
    }
}

