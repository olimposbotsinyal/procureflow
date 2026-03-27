# tests\test_quotes.py
def test_quotes_requires_auth(client):
    r = client.get("/api/v1/quotes/")
    assert r.status_code in (401, 403)


def test_quote_crud_flow(client, auth_headers):
    # CREATE
    create_payload = {"title": "Test Quote", "amount": 1234.56}
    r_create = client.post("/api/v1/quotes/", json=create_payload, headers=auth_headers)
    assert r_create.status_code in (200, 201), r_create.text
    created = r_create.json()
    quote_id = created["id"]
    assert created["title"] == "Test Quote"

    # GET ONE
    r_get = client.get(f"/api/v1/quotes/{quote_id}", headers=auth_headers)
    assert r_get.status_code == 200
    got = r_get.json()
    assert got["id"] == quote_id

    # UPDATE
    r_update = client.put(
        f"/api/v1/quotes/{quote_id}",
        json={"title": "Updated Quote", "amount": 999.99},
        headers=auth_headers
    )
    assert r_update.status_code == 200
    updated = r_update.json()
    assert updated["title"] == "Updated Quote"
    assert float(updated["amount"]) == 999.99

    # LIST (basic)
    r_list = client.get("/api/v1/quotes/?page=1&size=10", headers=auth_headers)
    assert r_list.status_code == 200
    lst = r_list.json()
    assert "items" in lst and "count" in lst

    # DELETE (soft)
    r_del = client.delete(f"/api/v1/quotes/{quote_id}", headers=auth_headers)
    assert r_del.status_code == 200

    # RESTORE
    r_res = client.post(f"/api/v1/quotes/{quote_id}/restore", headers=auth_headers)
    assert r_res.status_code == 200
    restored = r_res.json()
    assert restored["id"] == quote_id
