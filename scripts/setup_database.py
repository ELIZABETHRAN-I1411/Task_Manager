import json
import os
from datetime import datetime
from uuid import uuid4

def init_database():
    """Initialize the tasks JSON database"""
    db_file = "tasks.json"
    
    # Create initial database structure if it doesn't exist
    if not os.path.exists(db_file):
        initial_data = {
            "tasks": []
        }
        with open(db_file, 'w') as f:
            json.dump(initial_data, f, indent=2)
        print(f"Database initialized: {db_file}")
    else:
        print(f"Database already exists: {db_file}")

if __name__ == "__main__":
    init_database()
