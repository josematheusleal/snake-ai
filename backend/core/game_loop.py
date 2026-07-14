import asyncio

from core.environment import SnakeEnvironment

TICK_SECONDS = 0.15


class GameLoop:
    def __init__(self, agent, on_state_update):
        self.env = SnakeEnvironment()
        self.agent = agent
        self.on_state_update = on_state_update
        self.running = False
        self._task = None

    def reset(self):
        self.env.reset()

    async def start(self):
        self.env.reset()
        self.running = True
        self._task = asyncio.create_task(self._run())

    async def stop(self):
        self.running = False
        if self._task:
            self._task.cancel()

    async def _run(self):
        await self.on_state_update(self.env.get_state())
        while self.running:
            if not self.env.game_over:
                action = self.agent.decide(self.env)
                self.env.step(action)
            await self.on_state_update(self.env.get_state())
            await asyncio.sleep(TICK_SECONDS)