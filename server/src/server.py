import asyncio
import concurrent.futures
import json
import logging

import websockets

from control import Control

logger = logging.getLogger(__name__)

lock = asyncio.Lock()
executor = concurrent.futures.ThreadPoolExecutor()


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

        logger.debug(f"Received data: {data}")

        executor.submit(control.set_speed, data["direction"], data["speed"])

        await websocket.send("ok")


async def _main():
    try:
        from motor import MotorControl
    except ImportError:
        from control import Control as MotorControl

        logger.warning("Motor module not found, using dummy control")
    control = Control()

    addr = ("0.0.0.0", 9876)
    async with websockets.serve(lambda ws, path: handler(ws, control), *addr):
        logger.info("Server started, ctrl-c to stop")
        await asyncio.Future()


def main():
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO
    )

    try:
        asyncio.run(_main())
    except KeyboardInterrupt:
        logger.info("Server stopped")


if __name__ == "__main__":
    main()
