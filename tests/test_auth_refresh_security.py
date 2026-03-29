def test_refresh_token_cannot_be_reused(client, setup_test_db):
    # burada login yap -> refresh al -> 1. refresh çağrısı başarılı
    # aynı eski refresh ile 2. kez çağır -> 401 bekle
    pass


def test_logout_revokes_refresh_token(client, setup_test_db):
    # login -> refresh al
    # /auth/logout ile revoke et
    # aynı refresh ile /auth/refresh çağır -> 401
    pass
