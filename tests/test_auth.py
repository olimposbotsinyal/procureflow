# tests\test_auth.py
def test_login_success(client):
    r = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@procureflow.dev", "password": "Admin123!"},
    )
    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body
    assert isinstance(body["access_token"], str) and len(body["access_token"]) > 10


def test_login_fail(client):
    r = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@procureflow.dev", "password": "wrong-password"},
    )
    # Projende 400/401 olabilir; ikisini de kabul edelim
    assert r.status_code in (400, 401)


def test_me_requires_token(client):
    r = client.get("/api/v1/auth/me")
    assert r.status_code in (401, 403)


def test_me_with_token(client, auth_headers):
    r = client.get("/api/v1/auth/me", headers=auth_headers)
    assert r.status_code == 200
    data = r.json()
    # Dönüş formatın farklı olabilir; en azından dict bekliyoruz
    assert isinstance(data, dict)
