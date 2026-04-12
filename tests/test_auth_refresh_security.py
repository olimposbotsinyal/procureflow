def test_refresh_token_cannot_be_reused(client, setup_test_db):
    # 1. Login yap -> refresh token al
    login_payload = {"email": "admin@procureflow.dev", "password": "Admin123!"}
    login_response = client.post("/api/v1/auth/login", json=login_payload)
    assert login_response.status_code == 200, login_response.text

    refresh_token = login_response.json()["refresh_token"]

    # 2. İlk refresh başarılı olmalı
    refresh_payload = {"refresh_token": refresh_token}
    refresh_response_1 = client.post("/api/v1/auth/refresh", json=refresh_payload)
    assert refresh_response_1.status_code == 200, refresh_response_1.text
    # 3. Aynı ESKİ refresh token ile 2. kez çağır -> 401 olmalı (revoked)
    refresh_response_2 = client.post("/api/v1/auth/refresh", json=refresh_payload)
    assert (
        refresh_response_2.status_code == 401
    ), f"Expected 401 but got {refresh_response_2.status_code}: {refresh_response_2.text}"
    assert "revoked" in refresh_response_2.json().get("detail", "").lower()


def test_logout_revokes_refresh_token(client, setup_test_db):
    # 1. Login -> refresh token al
    login_payload = {"email": "user@procureflow.dev", "password": "User123!"}
    login_response = client.post("/api/v1/auth/login", json=login_payload)
    assert login_response.status_code == 200, login_response.text

    refresh_token = login_response.json()["refresh_token"]

    # 2. /auth/logout ile revoke et
    logout_payload = {"refresh_token": refresh_token}
    logout_response = client.post("/api/v1/auth/logout", json=logout_payload)
    assert logout_response.status_code == 200, logout_response.text
    assert logout_response.json()["message"] == "Logged out successfully"

    # 3. Aynı refresh token ile /auth/refresh çağır -> 401 olmalı
    refresh_payload = {"refresh_token": refresh_token}
    refresh_response = client.post("/api/v1/auth/refresh", json=refresh_payload)
    assert (
        refresh_response.status_code == 401
    ), f"Expected 401 but got {refresh_response.status_code}: {refresh_response.text}"
    assert "revoked" in refresh_response.json().get("detail", "").lower()
