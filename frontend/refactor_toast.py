import os
import re

FRONTEND_DIR = r"c:\Projects\LABMENTIX\CogniVault\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If it already imports getErrorMessage, skip (unless we need to refactor more)
    # But let's check if it uses err.response?.data
    
    modified = False
    
    # We want to replace patterns like:
    # toast.error(err.response?.data?.detail || 'Failed to load ...');
    # with:
    # toast.error(getErrorMessage(err));
    
    # We can use a regex to find catch blocks with err.response
    
    # A simple regex to find toast.error(err.response...) or similar
    pattern = r"toast\.error\(\s*(?:err|error)\.response\?\.data[^\)]+\)"
    
    if re.search(pattern, content):
        content = re.sub(pattern, lambda m: "toast.error(getErrorMessage(" + ("err" if "err." in m.group(0) else "error") + "))", content)
        modified = True
        
    # Also find toast.error(err.message ...)
    pattern2 = r"toast\.error\(\s*(?:err|error)\.message[^\)]+\)"
    if re.search(pattern2, content) and "getErrorMessage" not in content:
        # maybe they just used err.message, it's safer to use getErrorMessage
        content = re.sub(pattern2, lambda m: "toast.error(getErrorMessage(" + ("err" if "err." in m.group(0) else "error") + "))", content)
        modified = True

    if modified:
        # add import if needed
        if "getErrorMessage" not in content[:1000]: # check imports area
            # find last import
            import_idx = content.rfind("import ")
            if import_idx != -1:
                end_of_line = content.find("\n", import_idx)
                
                # figure out relative path to utils/error
                # count depth
                rel_path = os.path.relpath(os.path.join(FRONTEND_DIR, "utils", "error"), os.path.dirname(filepath)).replace("\\", "/")
                
                import_stmt = f"\nimport {{ getErrorMessage }} from '{rel_path}';"
                content = content[:end_of_line+1] + import_stmt + content[end_of_line+1:]
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            process_file(os.path.join(root, file))

print("Done refactoring toast.error")
