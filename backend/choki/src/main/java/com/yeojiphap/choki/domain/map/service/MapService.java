package com.yeojiphap.choki.domain.map.service;

import com.yeojiphap.choki.domain.map.domain.*;
import com.yeojiphap.choki.domain.map.dto.request.RouteSearchRequest;
import com.yeojiphap.choki.domain.map.dto.request.RouteRegisterRequest;
import com.yeojiphap.choki.domain.map.dto.response.RouteDto;
import com.yeojiphap.choki.domain.map.dto.response.DestinationsDto;
import com.yeojiphap.choki.domain.map.exception.RouteNotFoundException;
import com.yeojiphap.choki.domain.map.repository.EdgeRepository;
import com.yeojiphap.choki.domain.map.repository.RouteRepository;
import com.yeojiphap.choki.domain.map.repository.NodeRepository;
import com.yeojiphap.choki.domain.map.repository.RoutePoint;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.yeojiphap.choki.domain.map.message.MapSuccessMessage.*;

@Service
@RequiredArgsConstructor
public class MapService {
    // 탐색 범위: 출발/도착 노드 외접 사각형을 사방으로 넓히는 거리(m)
    private static final double ROUTE_SEARCH_MARGIN_METERS = 1000.0;

    private final UserService userService;
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;
    private final RouteRepository routeRepository;

    public String saveRoutes(RouteRegisterRequest request) {
        User user = userService.findCurrentUser();
        Location userLocation = getUserLocation(user);
        saveRoute(user, userLocation, request.destination(), request.routes(), RouteType.GUIDED_PATH);
        saveSafeRoute(user, userLocation, request.destination());
        saveShortestRoute(user, userLocation, request.destination());
        return GUIDED_ROUTE_SAVE_SUCCESS.getMessage();
    }

    private void saveRoute(User user, Location userLocation, Location request, List<Location> routes, RouteType guidedPath) {
        Route route = Route.builder()
                .userId(user.getUsername())
                .startPoint(userLocation)
                .destination(request)
                .routes(routes)
                .routeType(guidedPath)
                .build();

        routeRepository.save(route);
    }

    public DestinationsDto getDestinations() {
        List<Location> destinations = routeRepository.findDistinctDestinations(SecurityUtil.getCurrentUsername());
        return new DestinationsDto(destinations);
    }

    public RouteDto getRoute(RouteSearchRequest request) {
        Route route = routeRepository.findByUserIdAndDestinationAndRouteType(SecurityUtil.getCurrentUsername(), request.destination(), request.routeType()).orElseThrow(RouteNotFoundException::new);
        return RouteDto.from(route);
    }

    private Location getUserLocation(User user) {
        return new Location(user.getAddress(), user.getLatitude(),user.getLongitude());
    }

    public void saveSafeRoute(User user, Location startPoint, Location destination) {
        List<Location> path = findPath(startPoint, destination, RouteWeight.SAFE);
        saveRoute(user, startPoint, destination, path, RouteType.SAFE_PATH);
    }

    public void saveShortestRoute(User user, Location startPoint, Location destination) {
        List<Location> path = findPath(startPoint, destination, RouteWeight.SHORTEST);
        saveRoute(user, startPoint, destination, path, RouteType.SHORTEST_PATH);
    }

    private Node findNearestNode(Location location) {
        return nodeRepository.findNearestNode(location.latitude(), location.longitude());
    }

    private List<Location> findPath(Location startPoint, Location destination, RouteWeight routeWeight) {
        Node start = findNearestNode(startPoint);
        Node goal = findNearestNode(destination);

        if (start == null || goal == null) {
            throw new RouteNotFoundException();
        }

        // 출발/도착 노드가 같으면 pgr_dijkstra는 빈 결과를 반환하므로 노드 하나짜리 경로로 처리
        if (start.getId().equals(goal.getId())) {
            return List.of(new Location("", start.getLatitude(), start.getLongitude()));
        }

        List<RoutePoint> routePoints = edgeRepository.findRoute(start.getId(), goal.getId(),
                routeWeight.getCctvFactor(), routeWeight.getCrossingFactor(), ROUTE_SEARCH_MARGIN_METERS);

        if (routePoints.isEmpty()) {
            throw new RouteNotFoundException();
        }

        return routePoints.stream()
                .map(point -> new Location("", point.getLatitude(), point.getLongitude()))
                .collect(Collectors.toList());
    }
}
