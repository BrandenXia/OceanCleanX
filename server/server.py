import asyncio
import json
import logging

import websockets

from control import Control
from motor import MotorControl

logger = logging.getLogger(__name__)

lock = asyncio.Lock()


def with_lock(func):
    async def wrapper(*args, **kwargs):
        global lock

        await lock.acquire()
        res = await func(*args, **kwargs)
        lock.release()
        return res

    return wrapper


@with_lock
async def handler(websocket, control: Control):
    async for message in websocket:
        try:
            data = json.loads(message)
        except json.JSONDecodeError as e:
            logger.error(f"Error decoding JSON: {e}")
            await websocket.send("error: invalid JSON")
            continue

        if not isinstance(data, dict) or "direction" not in data or "speed" not in data:
            await websocket.send("error: missing direction or speed")
            continue

        control.set_speed(data["direction"], data["speed"])
        await websocket.send("ok")


async def main():
    addr = ("0.0.0.0", 9876)
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO
    )

    logger.info("Server started, ctrl-c to stop")
    control = MotorControl()

    async with websockets.serve(lambda ws, path: handler(ws, control), *addr):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
