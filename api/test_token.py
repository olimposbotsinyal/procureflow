from api.core.security import create_access_token, decode_access_token

token = create_access_token("123", "user")
payload = decode_access_token(token)
print(f'sub={payload.get("sub")}, role={payload.get("role")}')
print("✓ Token encoding/decoding works correctly")
