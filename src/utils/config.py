import yaml
from pathlib import Path

def load_config(config_path=None):
    if config_path is None:
        config_path = Path(__file__).parent.parent.parent / 'config' / 'config.yaml'
    with open(config_path, 'r') as f:
        return yaml.safe_load(f)
