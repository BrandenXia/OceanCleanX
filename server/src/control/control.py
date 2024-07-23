import abc
import logging

logger = logging.getLogger(__name__)


class Control(abc.ABC):
    @staticmethod
    def set_speed(direction: float, speed: float):
        if abs(direction) > 1 or abs(speed) > 1:
            logger.warning(f"Invalid speed or direction: {speed}, {direction}")
            return

        logger.info(f"speed: {speed}, direction: {direction}")
