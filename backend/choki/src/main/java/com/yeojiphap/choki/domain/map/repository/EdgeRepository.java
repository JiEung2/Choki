package com.yeojiphap.choki.domain.map.repository;

import com.yeojiphap.choki.domain.map.domain.Edge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EdgeRepository extends JpaRepository<Edge, Long> {
    /*
     * pgr_dijkstra(무방향)로 경로를 찾아 경로 순서대로 노드 좌표를 반환한다. 경로가 없으면 빈 리스트.
     * 탐색 간선은 출발/도착 노드의 외접 사각형을 사방 marginMeters 이상 넓힌 범위로 제한한다.
     * (위도 방향 margin / 1도 길이, 경도 방향 margin / (1도 길이 × cos(최대 위도 + 위도 여유)), 1도 길이 = 2π × 6,371,008.8m / 360, edge.geometry GIST 인덱스 사용)
     * 간선 비용: length × (has_cctv ? cctvFactor : 1) × (has_crossing ? crossingFactor : 1)
     */
    @Query(value = """
            SELECT n.latitude AS latitude, n.longitude AS longitude
            FROM pgr_dijkstra(
                (SELECT format(
                        'SELECT e.id, e.start_node_id AS source, e.end_node_id AS target, %s AS cost, %s AS reverse_cost'
                        || ' FROM edge e WHERE e.geometry && ST_Expand(ST_MakeEnvelope(%s, %s, %s, %s, 4326), %s, %s)',
                        w.cost, w.cost,
                        b.min_lon, b.min_lat, b.max_lon, b.max_lat, b.d_lon, b.d_lat)
                 FROM (SELECT format('e.length * (CASE WHEN e.has_cctv THEN %s ELSE 1.0 END) * (CASE WHEN e.has_crossing THEN %s ELSE 1.0 END)',
                                     CAST(:cctvFactor AS double precision), CAST(:crossingFactor AS double precision)) AS cost) w,
                      (SELECT LEAST(s.longitude, g.longitude) AS min_lon, LEAST(s.latitude, g.latitude) AS min_lat,
                              GREATEST(s.longitude, g.longitude) AS max_lon, GREATEST(s.latitude, g.latitude) AS max_lat,
                              m.d_lat,
                              m.margin / (m.m_per_deg * cos(radians(GREATEST(s.latitude, g.latitude) + m.d_lat))) AS d_lon
                       FROM node s, node g,
                            (SELECT k.margin, k.m_per_deg, k.margin / k.m_per_deg AS d_lat
                             FROM (SELECT CAST(:marginMeters AS double precision) AS margin,
                                          2 * pi() * 6371008.8 / 360 AS m_per_deg) k) m
                       WHERE s.id = :startNodeId AND g.id = :goalNodeId) b),
                CAST(:startNodeId AS bigint), CAST(:goalNodeId AS bigint), false) d
            JOIN node n ON n.id = d.node
            ORDER BY d.seq
            """, nativeQuery = true)
    List<RoutePoint> findRoute(@Param("startNodeId") long startNodeId,
                               @Param("goalNodeId") long goalNodeId,
                               @Param("cctvFactor") double cctvFactor,
                               @Param("crossingFactor") double crossingFactor,
                               @Param("marginMeters") double marginMeters);
}
