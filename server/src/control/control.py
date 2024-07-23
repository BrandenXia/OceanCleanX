import abc
import logging

logger = logging.getLogger(__name__)


class Control(abc.ABC):
    @staticmethod
    def set_speed(direction: float, speed: float):
        logger.info(f"speed: {speed}, direction: {direction}")
