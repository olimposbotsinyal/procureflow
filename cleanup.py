import os
import pathlib

# Delete the problematic file
file_path = r"d:\Projects\procureflow\web\src\pages\CompanyDetailPage.tsx"

if os.path.exists(file_path):
    os.remove(file_path)
    print(f"✅ Deleted {file_path}")
else:
    print(f"File not found: {file_path}")
