-- 경로 탐색(pgRouting) 사전 설정. 애플리케이션이 자동 실행하지 않으므로 DB에 수동으로 1회 적용한다.
-- 서버에 pgRouting 패키지가 설치되어 있어야 한다 (예: pgrouting/pgrouting 이미지 또는 postgresql-16-pgrouting).
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgrouting;

-- NodeRepository.findNearestNode: KNN(<->) 최근접 노드
CREATE INDEX IF NOT EXISTS idx_node_geometry ON node USING gist (geometry);

-- EdgeRepository.findRoute: bbox(&&) 간선 필터
CREATE INDEX IF NOT EXISTS idx_edge_geometry ON edge USING gist (geometry);

ANALYZE node;
ANALYZE edge;
