def test_me_with_valid_token(client, auth_headers):
    res = client.get("/auth/me", headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert "email" in body
    assert "role" in body


def test_me_without_token(client):
    res = client.get("/auth/me")
    assert res.status_code in (401, 403)
