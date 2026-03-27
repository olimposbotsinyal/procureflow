# tests\test_quotes.py
def test_quotes_requires_auth(client):
    r = client.get("/api/v1/quotes/")
    assert r.status_code in (401, 403)


def test_quote_crud_flow(client, auth_headers):
    create_payload = {"title": "Test Quote", "amount": 1234.56}
    r_create = client.post("/api/v1/quotes/", json=create_payload, headers=auth_headers)
    assert r_create.status_code in (200, 201), r_create.text
    created = r_create.json()
    quote_id = created["id"]
    assert created["title"] == "Test Quote"
    assert created["status"] == "draft"

    r_get = client.get(f"/api/v1/quotes/{quote_id}", headers=auth_headers)
    assert r_get.status_code == 200
    got = r_get.json()
    assert got["id"] == quote_id

    r_update = client.put(
        f"/api/v1/quotes/{quote_id}",
        json={"title": "Updated Quote", "amount": 999.99},
        headers=auth_headers
    )
    assert r_update.status_code == 200
    updated = r_update.json()
    assert updated["title"] == "Updated Quote"
    assert float(updated["amount"]) == 999.99

    r_list = client.get("/api/v1/quotes/?page=1&size=10", headers=auth_headers)
    assert r_list.status_code == 200
    lst = r_list.json()
    assert "items" in lst and "count" in lst

    r_del = client.delete(f"/api/v1/quotes/{quote_id}", headers=auth_headers)
    assert r_del.status_code == 200

    r_res = client.post(f"/api/v1/quotes/{quote_id}/restore", headers=auth_headers)
    assert r_res.status_code == 200
    restored = r_res.json()
    assert restored["id"] == quote_id


def test_quote_status_workflow_submit_and_approve(client, auth_headers):
    r_create = client.post(
        "/api/v1/quotes/",
        json={"title": "Workflow A", "amount": 100},
        headers=auth_headers,
    )
    assert r_create.status_code in (200, 201), r_create.text
    qid = r_create.json()["id"]

    r_submit = client.post(f"/api/v1/quotes/{qid}/submit", headers=auth_headers)
    assert r_submit.status_code == 200, r_submit.text
    assert r_submit.json()["status"] == "submitted"

    r_approve = client.post(f"/api/v1/quotes/{qid}/approve", headers=auth_headers)
    assert r_approve.status_code == 200, r_approve.text
    assert r_approve.json()["status"] == "approved"

    r_reject_after_approved = client.post(f"/api/v1/quotes/{qid}/reject", headers=auth_headers)
    assert r_reject_after_approved.status_code == 409


def test_quote_status_workflow_invalid_direct_approve(client, auth_headers):
    r_create = client.post(
        "/api/v1/quotes/",
        json={"title": "Workflow B", "amount": 200},
        headers=auth_headers,
    )
    assert r_create.status_code in (200, 201), r_create.text
    qid = r_create.json()["id"]

    r_approve = client.post(f"/api/v1/quotes/{qid}/approve", headers=auth_headers)
    assert r_approve.status_code == 409


def test_quote_status_workflow_submit_and_reject(client, auth_headers):
    r_create = client.post(
        "/api/v1/quotes/",
        json={"title": "Workflow C", "amount": 300},
        headers=auth_headers,
    )
    assert r_create.status_code in (200, 201), r_create.text
    qid = r_create.json()["id"]

    r_submit = client.post(f"/api/v1/quotes/{qid}/submit", headers=auth_headers)
    assert r_submit.status_code == 200, r_submit.text
    assert r_submit.json()["status"] == "submitted"

    r_reject = client.post(f"/api/v1/quotes/{qid}/reject", headers=auth_headers)
    assert r_reject.status_code == 200, r_reject.text
    assert r_reject.json()["status"] == "rejected"


def test_non_admin_cannot_approve_or_reject(client, user_auth_headers, admin_auth_headers):
    r_create = client.post("/api/v1/quotes/", json={"title": "RBAC", "amount": 50}, headers=user_auth_headers)
    qid = r_create.json()["id"]

    r_submit = client.post(f"/api/v1/quotes/{qid}/submit", headers=user_auth_headers)
    assert r_submit.status_code == 200

    r_approve_user = client.post(f"/api/v1/quotes/{qid}/approve", headers=user_auth_headers)
    assert r_approve_user.status_code == 403

    r_approve_admin = client.post(f"/api/v1/quotes/{qid}/approve", headers=admin_auth_headers)
    assert r_approve_admin.status_code == 200


def test_status_history_owner_can_view_and_sequence_is_correct(client, user_auth_headers, admin_auth_headers):
    # 1) user quote oluşturur
    create_res = client.post(
        "/api/v1/quotes/",
        json={"title": "History Test Quote", "amount": 2500},
        headers=user_auth_headers,
    )
    assert create_res.status_code == 201, create_res.text
    quote_id = create_res.json()["id"]

    # 2) user submit eder: draft -> submitted
    submit_res = client.post(
        f"/api/v1/quotes/{quote_id}/submit",
        headers=user_auth_headers,
    )
    assert submit_res.status_code == 200, submit_res.text
    assert submit_res.json()["status"] == "submitted"

    # 3) admin approve eder: submitted -> approved
    approve_res = client.post(
        f"/api/v1/quotes/{quote_id}/approve",
        headers=admin_auth_headers,
    )
    assert approve_res.status_code == 200, approve_res.text
    assert approve_res.json()["status"] == "approved"

    # 4) owner history görür
    history_res = client.get(
        f"/api/v1/quotes/{quote_id}/status-history",
        headers=user_auth_headers,
    )
    assert history_res.status_code == 200, history_res.text
    logs = history_res.json()
    assert len(logs) == 2

    assert logs[0]["from_status"] == "draft"
    assert logs[0]["to_status"] == "submitted"

    assert logs[1]["from_status"] == "submitted"
    assert logs[1]["to_status"] == "approved"


def test_status_history_non_owner_non_admin_cannot_view(client, user_auth_headers):
    # owner user quote oluşturur
    create_res = client.post(
        "/api/v1/quotes/",
        json={"title": "Private History Quote", "amount": 900},
        headers=user_auth_headers,
    )
    assert create_res.status_code == 201, create_res.text
    quote_id = create_res.json()["id"]

    # submit de etsin ki history boş olmasın
    submit_res = client.post(
        f"/api/v1/quotes/{quote_id}/submit",
        headers=user_auth_headers,
    )
    assert submit_res.status_code == 200, submit_res.text

    # farklı bir user ile 403 test etmek için geçici user yarat + login
    # (Eğer halihazırda ikinci user fixture'ın varsa onu kullan)
    # Bu testin çalışması için conftest'te second_user_auth_headers fixture eklemek daha temizdir.


def test_status_history_non_owner_non_admin_cannot_view(client, user_auth_headers, other_user_auth_headers):
    create_res = client.post(
        "/api/v1/quotes/",
        json={"title": "Private History Quote", "amount": 900},
        headers=user_auth_headers,
    )
    assert create_res.status_code == 201, create_res.text
    quote_id = create_res.json()["id"]

    submit_res = client.post(
        f"/api/v1/quotes/{quote_id}/submit",
        headers=user_auth_headers,
    )
    assert submit_res.status_code == 200, submit_res.text

    forbidden_res = client.get(
        f"/api/v1/quotes/{quote_id}/status-history",
        headers=other_user_auth_headers,
    )
    assert forbidden_res.status_code == 403, forbidden_res.text
