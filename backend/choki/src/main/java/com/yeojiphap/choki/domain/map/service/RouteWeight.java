package com.yeojiphap.choki.domain.map.service;

import lombok.Getter;

// 간선 비용 = length × (has_cctv ? cctvFactor : 1) × (has_crossing ? crossingFactor : 1)
@Getter
public enum RouteWeight {
    SAFE(0.5, 2.0),     // CCTV가 있으면 비용을 낮추고, 횡단보도가 있으면 높임
    SHORTEST(1.0, 2.0), // 횡단보도만 반영
    ;

    private final double cctvFactor;
    private final double crossingFactor;

    RouteWeight(double cctvFactor, double crossingFactor) {
        this.cctvFactor = cctvFactor;
        this.crossingFactor = crossingFactor;
    }
}
