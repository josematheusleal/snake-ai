from collections import deque
from typing import List, Optional, Set, Tuple

from core.environment import Direction, DIRECTION_ORDER, SnakeEnvironment


class HeuristicAgent:

    def decide(self, env: SnakeEnvironment) -> str:
        """Assinatura esperada pelo game_loop.py (agent.decide(env))."""
        return self.get_action(env)

    def get_action(self, env: SnakeEnvironment) -> str:
        grid_size = env.grid_size
        snake = env.snake
        if not snake:
            return "straight"
        head = snake[0]
        body_blocking: Set[Tuple[int, int]] = set(snake)

        path = self._bfs(head, env.apple, body_blocking, grid_size)

        if path:
            virtual_snake = self._simulate_after_eating(snake, path)
            if self._can_reach_tail(virtual_snake, grid_size):
                return self._direction_to_action(env, head, path[0])
 
        return self._safest_action(env)


    def _bfs(
        self,
        start: Tuple[int, int],
        goal: Tuple[int, int],
        blocked: Set[Tuple[int, int]],
        grid_size: int,
    ) -> Optional[List[Tuple[int, int]]]:
        if start == goal:
            return []

        queue = deque([start])
        came_from = {start: None}

        while queue:
            current = queue.popleft()
            if current == goal:
                return self._reconstruct_path(came_from, start, goal)

            for dx, dy in (d.value for d in DIRECTION_ORDER):
                neighbor = (current[0] + dx, current[1] + dy)
                if not self._in_bounds(neighbor, grid_size):
                    continue
                if neighbor in blocked:
                    continue
                if neighbor in came_from:
                    continue
                came_from[neighbor] = current
                queue.append(neighbor)

        return None

    def _reconstruct_path(
        self,
        came_from: dict,
        start: Tuple[int, int],
        goal: Tuple[int, int],
    ) -> List[Tuple[int, int]]:
        path = [goal]
        while path[-1] != start:
            path.append(came_from[path[-1]])
        path.reverse()
        return path[1:] 

    def _in_bounds(self, pos: Tuple[int, int], grid_size: int) -> bool:
        x, y = pos
        return 0 <= x < grid_size and 0 <= y < grid_size

    def _direction_to_action(
        self,
        env: SnakeEnvironment,
        head: Tuple[int, int],
        next_cell: Tuple[int, int],
    ) -> str:
        dx = next_cell[0] - head[0]
        dy = next_cell[1] - head[1]
        target_direction = next(d for d in Direction if d.value == (dx, dy))

        current_idx = DIRECTION_ORDER.index(env.direction)
        target_idx = DIRECTION_ORDER.index(target_direction)
        diff = (target_idx - current_idx) % 4

        if diff == 1:
            return "right"
        if diff == 3:
            return "left"
        return "straight"

    def _simulate_after_eating(
        self,
        snake: List[Tuple[int, int]],
        path: List[Tuple[int, int]],
    ) -> List[Tuple[int, int]]:
        virtual = list(snake)
        last_index = len(path) - 1
        for i, cell in enumerate(path):
            virtual.insert(0, cell)
            if i != last_index:
                virtual.pop()
        return virtual

    def _can_reach_tail(
        self,
        virtual_snake: List[Tuple[int, int]],
        grid_size: int,
    ) -> bool:
        if len(virtual_snake) <= 1:
            return True
        head = virtual_snake[0]
        tail = virtual_snake[-1]
        blocked = set(virtual_snake[:-1])  # cauda é o alvo, não um obstáculo
        return self._bfs(head, tail, blocked, grid_size) is not None

    def _safest_action(self, env: SnakeEnvironment) -> str:
        head = env.snake[0]
        snake = env.snake
        grid_size = env.grid_size
        occupied_after_move = set(snake)
        best_action = "straight"
        best_reaches_tail = False
        best_space = -1
        found_valid = False

        for action in ("straight", "left", "right"):
            direction = env._rotate(env.direction, action)
            dx, dy = direction.value
            next_cell = (head[0] + dx, head[1] + dy)

            if not self._in_bounds(next_cell, grid_size):
                continue
            if next_cell in occupied_after_move:
                continue

            virtual_snake = [next_cell] + list(snake[:-1])
            reaches_tail = self._can_reach_tail(virtual_snake, grid_size)
            space = self._time_aware_reachable_space(next_cell, snake, grid_size)

            candidate = (reaches_tail, space)
            current_best = (best_reaches_tail, best_space)
            if not found_valid or candidate > current_best:
                found_valid = True
                best_reaches_tail, best_space = reaches_tail, space
                best_action = action

        return best_action

    def _time_aware_reachable_space(
        self,
        start: Tuple[int, int],
        snake: List[Tuple[int, int]],
        grid_size: int,
    ) -> int:
        n = len(snake)
        moves_until_free = {cell: n - i + 1 for i, cell in enumerate(snake)}

        visited = {start}
        queue = deque([(start, 0)])
        count = 0

        while queue:
            current, dist = queue.popleft()
            count += 1
            for dx, dy in (d.value for d in DIRECTION_ORDER):
                neighbor = (current[0] + dx, current[1] + dy)
                if not self._in_bounds(neighbor, grid_size) or neighbor in visited:
                    continue

                neighbor_dist = dist + 1
                elapsed = 1 + neighbor_dist  # movimentos reais até alcançar neighbor
                free_at = moves_until_free.get(neighbor)
                if free_at is not None and elapsed < free_at:
                    continue  # ainda vai estar ocupada quando a cobra chegar lá

                visited.add(neighbor)
                queue.append((neighbor, neighbor_dist))

        return count