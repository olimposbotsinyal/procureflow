def test_refresh_requires_token(client):
    res = client.post("/api/v1/auth/refresh", json={"refresh_token": ""})
    assert res.status_code in (401, 422)
