package com.yeojiphap.choki.domain.map.repository;

import com.yeojiphap.choki.domain.map.domain.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NodeRepository extends JpaRepository<Node, Long> {
    // KNN(<->) 정렬, node.geometry GIST 인덱스 사용 (db/route_index.sql)
    @Query(value = "SELECT * FROM node ORDER BY geometry <-> ST_SetSRID(ST_Point(:longitude, :latitude), 4326) LIMIT 1", nativeQuery = true)
    Node findNearestNode(@Param("latitude") double latitude, @Param("longitude") double longitude);
}
