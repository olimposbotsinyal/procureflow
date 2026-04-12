"""
Tests for Quote domain concurrency control and domain events.
"""

import pytest


def _quote_payload(title: str):
    return {
        "project_id": 1,
        "title": title,
        "description": f"{title} aciklama",
        "company_name": "Test Company",
        "company_contact_name": "Test Contact",
        "company_contact_phone": "+905551112233",
        "company_contact_email": "contact@test.local",
    }


def test_quote_version_increments_on_transition(client, setup_test_db, auth_headers):
    """Verify that version field increments when transitioning"""
    # 1. Create quote
    create_response = client.post(
        "/api/v1/quotes/",
        json=_quote_payload("Test Quote"),
        headers=auth_headers,
    )
    assert create_response.status_code == 201
    quote_id = create_response.json()["id"]

    # Initial version should be 1
    get_response = client.get(f"/api/v1/quotes/{quote_id}", headers=auth_headers)
    assert get_response.status_code == 200
    initial_version = get_response.json()["version"]
    assert initial_version == 1

    # 2. Submit quote (transition)
    submit_response = client.post(
        f"/api/v1/quotes/{quote_id}/submit", headers=auth_headers
    )
    assert submit_response.status_code == 200

    # Version should increment to 2
    submitted_quote = submit_response.json()
    assert submitted_quote["version"] == 2
    assert submitted_quote["status"] in ("submitted", "sent")


def test_domain_event_emitted_on_transition(client, setup_test_db, auth_headers):
    """Verify that domain event is emitted when transitioning"""
    # Clear previous events
    clear_response = client.post("/api/v1/quotes/internal/events/clear")
    assert clear_response.status_code == 200

    # Create quote
    create_response = client.post(
        "/api/v1/quotes/",
        json=_quote_payload("Event Test Quote"),
        headers=auth_headers,
    )
    assert create_response.status_code == 201
    quote_id = create_response.json()["id"]

    # Submit quote
    submit_response = client.post(
        f"/api/v1/quotes/{quote_id}/submit",
        headers=auth_headers,
    )
    assert submit_response.status_code == 200

    # Check events
    events_response = client.get("/api/v1/quotes/internal/events")
    assert events_response.status_code == 200
    events = events_response.json()

    # Should have at least 1 event
    assert events["count"] >= 1, f"Expected events, got: {events}"


def test_transition_reason_stored(client, setup_test_db, auth_headers):
    """Verify that transition reason is stored in quote"""
    create_response = client.post(
        "/api/v1/quotes/",
        json=_quote_payload("Reason Test Quote"),
        headers=auth_headers,
    )
    assert create_response.status_code == 201
    quote_id = create_response.json()["id"]

    # Submit quote (should store reason)
    submit_response = client.post(
        f"/api/v1/quotes/{quote_id}/submit", headers=auth_headers
    )
    assert submit_response.status_code == 200

    quote_after = submit_response.json()
    assert quote_after["transition_reason"] == "User submitted quote"
