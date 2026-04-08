# routers/admin.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from api.core.deps import get_db, get_current_user
from api.core.security import get_password_hash
from api.models import (
    Department,
    Project,
    User,
    Company,
    ProjectFile,
    Role,
    Permission,
    ProjectPermission,
    Quote,
    QuoteStatusLog,
    user_project_permissions,
)
from api.models.project import user_projects
from api.models.report import QuoteComparison, SupplierRating, PriceAnalysis, Contract
from api.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentOut
from api.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut, ProjectFileOut
from api.schemas.user import UserCreate, UserUpdate, UserOut
from api.schemas.company import CompanyCreate, CompanyUpdate, CompanyOut
from api.schemas.role import RoleCreate, RoleUpdate, RoleOut
from api.schemas.permission import PermissionCreate, PermissionOut
from api.services.file_service import FileUploadService
from api.services.user_department_service import resolve_effective_department_id

router = APIRouter(prefix="/admin", tags=["admin"])


# Helper to check if user is super admin
def require_super_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece super admin bu işlemi yapabilir",
        )
    return current_user


# ==================== COMPANY ENDPOINTS ====================


@router.get("/companies", response_model=list[CompanyOut])
async def list_companies(
    db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    """Tüm firmaları listele"""
    return db.query(Company).filter(Company.is_active).all()


@router.post("/companies", response_model=CompanyOut)
async def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Yeni firma ekle (Sadece Super Admin)"""
    existing = db.query(Company).filter(Company.name == company.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Bu firma zaten mevcut"
        )

    new_company = Company(**company.model_dump())
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company


@router.put("/companies/{company_id}", response_model=CompanyOut)
async def update_company(
    company_id: int,
    company: CompanyUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Firma bilgilerini güncelle"""
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Firma bulunamadı"
        )

    update_data = company.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_company, key, value)

    db.commit()
    db.refresh(db_company)
    return db_company


@router.delete("/companies/{company_id}")
async def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Firma sil"""
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Firma bulunamadı"
        )

    db.delete(db_company)
    db.commit()
    return {"message": "Firma başarıyla silindi"}


# ==================== DEPARTMENT ENDPOINTS ====================


@router.get("/departments", response_model=list[DepartmentOut])
async def list_departments(
    db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    """Tüm departmanları listele"""
    return db.query(Department).filter(Department.is_active).all()


@router.post("/departments", response_model=DepartmentOut)
async def create_department(
    dept: DepartmentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Yeni departman ekle (Sadece Super Admin)"""
    existing = db.query(Department).filter(Department.name == dept.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Bu departman zaten mevcut"
        )

    new_dept = Department(**dept.model_dump())
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept


@router.put("/departments/{dept_id}", response_model=DepartmentOut)
async def update_department(
    dept_id: int,
    dept_data: DepartmentUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Departman güncelle (Sadece Super Admin)"""
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Departman bulunamadı")

    update_data = dept_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(dept, field, value)

    db.commit()
    db.refresh(dept)
    return dept


@router.delete("/departments/{dept_id}")
async def delete_department(
    dept_id: int, db: Session = Depends(get_db), _: User = Depends(require_super_admin)
):
    """Departman sil (Sadece Super Admin)"""
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Departman bulunamadı")

    # Check if department has users
    users_count = db.query(User).filter(User.department_id == dept_id).count()
    if users_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bu departmanda {users_count} personel var. Önce onları başka departmana taşıyın",
        )

    db.delete(dept)
    db.commit()
    return {"message": "Departman silindi"}


# ==================== ROLE ENDPOINTS ====================


@router.get("/roles", response_model=list[RoleOut])
async def list_roles(
    db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    """Tüm rolleri listele"""
    return db.query(Role).filter(Role.is_active).all()


@router.post("/roles", response_model=RoleOut)
async def create_role(
    role_data: RoleCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Yeni rol ekle"""
    existing = db.query(Role).filter(Role.name == role_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Bu rol zaten mevcut"
        )

    # Calculate hierarchy level based on parent
    hierarchy_level = 0
    if role_data.parent_id:
        parent_role = db.query(Role).filter(Role.id == role_data.parent_id).first()
        if not parent_role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Parent rol bulunamadı"
            )
        hierarchy_level = parent_role.hierarchy_level + 1

    new_role = Role(
        name=role_data.name,
        description=role_data.description,
        parent_id=role_data.parent_id,
        hierarchy_level=hierarchy_level,
        is_active=True,
    )

    # Add permissions if provided
    if role_data.permission_ids:
        permissions = (
            db.query(Permission)
            .filter(Permission.id.in_(role_data.permission_ids))
            .all()
        )
        new_role.permissions = permissions

    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role


@router.put("/roles/{role_id}", response_model=RoleOut)
async def update_role(
    role_id: int,
    role_data: RoleUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Rol güncelle"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rol bulunamadı"
        )

    update_data = role_data.model_dump(exclude_unset=True)

    # Handle permissions separately
    permission_ids = update_data.pop("permission_ids", None)
    parent_id = update_data.pop("parent_id", None)

    # If parent_id changed, recalculate hierarchy_level
    if parent_id is not None:
        parent_role = db.query(Role).filter(Role.id == parent_id).first()
        if parent_role:
            update_data["hierarchy_level"] = parent_role.hierarchy_level + 1
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Parent rol bulunamadı"
            )

    # Apply updates
    for field, value in update_data.items():
        setattr(role, field, value)

    if parent_id is not None:
        role.parent_id = parent_id

    if permission_ids is not None:
        permissions = (
            db.query(Permission).filter(Permission.id.in_(permission_ids)).all()
        )
        role.permissions = permissions

    db.commit()
    db.refresh(role)
    return role


@router.delete("/roles/{role_id}")
async def delete_role(
    role_id: int, db: Session = Depends(get_db), _: User = Depends(require_super_admin)
):
    """Rol sil"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rol bulunamadı"
        )

    db.delete(role)
    db.commit()
    return {"message": "Rol başarıyla silindi"}


# ==================== PERMISSION ENDPOINTS ====================


@router.get("/permissions", response_model=list[PermissionOut])
async def list_permissions(
    db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    """Tüm izinleri listele"""
    return db.query(Permission).all()


# ==================== PROJECT ENDPOINTS ====================


@router.get("/projects", response_model=list[ProjectOut])
async def list_projects(
    db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    """Tüm projeleri listele"""
    return db.query(Project).filter(Project.is_active).all()


@router.post("/projects", response_model=ProjectOut)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_super_admin),
):
    """Yeni proje ekle (Sadece Super Admin)"""
    try:
        print(f"[DEBUG] Proje oluşturma isteği alındı: {project}")
        print(f"[DEBUG] Kullanıcı: {current_user.email} ({current_user.role})")

        # Proje kodunun unique olup olmadığını kontrol et
        existing = db.query(Project).filter(Project.code == project.code).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu proje kodu zaten mevcut",
            )

        # Schema data'sını model'e dönüştür
        data = project.model_dump()
        print(f"[DEBUG] Proje data: {data}")

        new_project = Project(**data)
        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        print(f"[DEBUG] Proje başarıyla oluşturuldu: ID={new_project.id}")
        return new_project

    except ValueError as e:
        print(f"[ERROR] Validation hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation hatası: {str(e)}",
        )
    except Exception as e:
        print(f"[ERROR] Proje oluşturma hatası: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Proje oluşturulamadı: {str(e)}",
        )


@router.put("/projects/{proj_id}", response_model=ProjectOut)
async def update_project(
    proj_id: int,
    proj_data: ProjectUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Proje güncelle (Sadece Super Admin)"""
    proj = db.query(Project).filter(Project.id == proj_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    update_data = proj_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(proj, field, value)

    db.commit()
    db.refresh(proj)
    return proj


@router.delete("/projects/{proj_id}")
async def delete_project(
    proj_id: int, db: Session = Depends(get_db), _: User = Depends(require_super_admin)
):
    """Proje sil (Sadece Super Admin)"""
    proj = db.query(Project).filter(Project.id == proj_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    try:
        # Some legacy tables are not wired with ORM cascades; clear them explicitly.
        quote_ids = [
            qid
            for (qid,) in db.query(Quote.id).filter(Quote.project_id == proj_id).all()
        ]
        if quote_ids:
            db.execute(delete(Contract).where(Contract.quote_id.in_(quote_ids)))
            db.execute(
                delete(PriceAnalysis).where(PriceAnalysis.quote_id.in_(quote_ids))
            )
            db.execute(
                delete(SupplierRating).where(SupplierRating.quote_id.in_(quote_ids))
            )
            db.execute(
                delete(QuoteComparison).where(QuoteComparison.quote_id.in_(quote_ids))
            )
            db.execute(
                delete(QuoteStatusLog).where(QuoteStatusLog.quote_id.in_(quote_ids))
            )

        db.execute(
            delete(ProjectPermission).where(ProjectPermission.project_id == proj_id)
        )
        db.execute(
            delete(user_project_permissions).where(
                user_project_permissions.c.project_id == proj_id
            )
        )
        db.execute(delete(user_projects).where(user_projects.c.project_id == proj_id))

        db.delete(proj)
        db.commit()
        return {"message": "Proje silindi"}
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Proje silinemedi: projeye bagli kayitlar var ({str(e.orig)})",
        )


# ==================== USER/PERSONNEL ENDPOINTS ====================


@router.get("/users", response_model=list[UserOut])
async def list_users(
    db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    """Tüm personeli listele"""
    users = db.query(User).filter(User.is_active).all()
    for user in users:
        resolve_effective_department_id(db, user)
    db.commit()
    return users


@router.post("/users", response_model=UserOut)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Yeni personel ekle (Sadece Super Admin)"""
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Bu email zaten kayıtlı"
        )

    # Set default approval limits based on role
    approval_limits = {
        "satinalmaci": 100000,
        "satinalma_uzmani": 200000,
        "satinalma_yoneticisi": 300000,
        "satinalma_direktoru": 1000000,
    }

    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
        role=user_data.role,
        approval_limit=user_data.approval_limit
        or approval_limits.get(user_data.role, 100000),
        department_id=user_data.department_id,
        is_active=user_data.is_active,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.put("/users/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Personel güncelle (Sadece Super Admin)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")

    update_data = user_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int, db: Session = Depends(get_db), _: User = Depends(require_super_admin)
):
    """Personel sil (Sadece Super Admin)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")

    # Soft delete
    user.is_active = False
    db.commit()
    return {"message": "Personel silindi"}


@router.post("/users/{user_id}/projects/{project_id}")
async def assign_user_to_project(
    user_id: int,
    project_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Personeli projeye ata (Sadece Super Admin)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    if project not in user.projects:
        user.projects.append(project)
        db.commit()

    return {"message": f"{user.full_name} {project.name} projesine atandı"}


@router.delete("/users/{user_id}/projects/{project_id}")
async def remove_user_from_project(
    user_id: int,
    project_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    """Personeli projeden çıkar (Sadece Super Admin)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Personel bulunamadı")

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")

    if project in user.projects:
        user.projects.remove(project)
        db.commit()

    return {"message": f"{user.full_name} {project.name} projesinden çıkarıldı"}


# ==================== PROJECT FILE ENDPOINTS ====================


@router.post("/projects/{proj_id}/files", response_model=ProjectFileOut)
async def upload_project_file(
    proj_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_super_admin),
):
    """Projeye dosya yukle (Sadece Super Admin)"""
    # Proje kontrolu
    project = db.query(Project).filter(Project.id == proj_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamadi")

    # Sirket kontrolu
    if not project.company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Proje bir sirkete atanmis olmali",
        )

    # Dosya içeriğini oku
    file_content = await file.read()
    file_size = len(file_content)

    # Dosya doğrulama
    is_valid, error_msg = FileUploadService.validate_file(file.filename, file_size)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)

    # Önce veritabanında kayıt oluştur (ID almak için)
    project_file = ProjectFile(
        project_id=proj_id,
        filename="",  # Gecici, dosya kaydettikten sonra guncellenecek
        original_filename=file.filename,
        file_type=file.content_type or FileUploadService.get_file_type(file.filename),
        file_size=file_size,
        file_path="",  # Gecici, dosya kaydettikten sonra guncellenecek
        uploaded_by=current_user.id,
    )

    db.add(project_file)
    db.flush()  # ID'yi almak için flush et
    file_id = project_file.id

    # Dosyayı kaydet (sirket/proje kategorisine)
    try:
        file_path = FileUploadService.save_file(
            company_id=project.company_id,
            project_id=proj_id,
            file_id=file_id,
            file_content=file_content,
            original_filename=file.filename,
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dosya kaydedilemedi: {str(e)}",
        )

    # Dosya yolunu ve adını güncelle
    filename = FileUploadService.generate_filename(file_id, file.filename)
    project_file.filename = filename
    project_file.file_path = file_path

    db.commit()
    db.refresh(project_file)

    return project_file


@router.get("/projects/{proj_id}/files", response_model=list[ProjectFileOut])
async def list_project_files(
    proj_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    """Proje dosyalar�n� listele"""
    project = db.query(Project).filter(Project.id == proj_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proje bulunamad�")

    files = db.query(ProjectFile).filter(ProjectFile.project_id == proj_id).all()
    return files


@router.delete("/files/{file_id}")
async def delete_project_file(
    file_id: int, db: Session = Depends(get_db), _: User = Depends(require_super_admin)
):
    """Proje dosyas�n� sil (Sadece Super Admin)"""
    project_file = db.query(ProjectFile).filter(ProjectFile.id == file_id).first()
    if not project_file:
        raise HTTPException(status_code=404, detail="Dosya bulunamad�")

    # Fiziksel dosyay� sil
    FileUploadService.delete_file(project_file.file_path)

    # Veritaban�ndan sil
    db.delete(project_file)
    db.commit()

    return {"message": "Dosya silindi"}


# ==================== DEMO DATA ENDPOINTS ====================


@router.post("/load-demo-data")
async def load_demo_data(
    db: Session = Depends(get_db), _: User = Depends(require_super_admin)
):
    """Demo verilerini yükle (Sadece Super Admin)"""
    try:
        results = {
            "users": 0,
            "departments": 0,
            "companies": 0,
            "projects": 0,
            "skipped": {
                "users": 0,
                "departments": 0,
                "companies": 0,
                "projects": 0,
            },
        }

        # Users Data
        users_data = [
            {
                "email": "satinalma@example.com",
                "full_name": "SATIN ALAMA",
                "role": "personnel",
                "password": "Test123!",
            },
            {
                "email": "satinalmauzmani@example.com",
                "full_name": "SATIN ALAMA UZMANI",
                "role": "personnel",
                "password": "Test123!",
            },
            {
                "email": "satinalmayoneticisi@example.com",
                "full_name": "SATIN ALAMA YÖNETİCİSİ",
                "role": "personnel",
                "password": "Test123!",
            },
            {
                "email": "satinalmamuduru@example.com",
                "full_name": "SATIN ALAMA MÜDÜRÜ",
                "role": "personnel",
                "password": "Test123!",
            },
            {
                "email": "satinalmadirektoru@example.com",
                "full_name": "SATIN ALAMA DİREKTÖRÜ",
                "role": "personnel",
                "password": "Test123!",
            },
        ]

        for user in users_data:
            existing = db.query(User).filter(User.email == user["email"]).first()
            if existing:
                results["skipped"]["users"] += 1
            else:
                new_user = User(
                    email=user["email"],
                    full_name=user["full_name"],
                    hashed_password=get_password_hash(user["password"]),
                    role=user["role"],
                    is_active=True,
                )
                db.add(new_user)
                results["users"] += 1

        db.commit()

        # Departments Data
        departments_data = [
            "SATIN ALAMA",
            "SATIN ALAMA UZMANI",
            "SATIN ALAMA YÖNETİCİSİ",
            "SATIN ALAMA MÜDÜRÜ",
            "SATIN ALAMA DİREKTÖRÜ",
        ]

        for dept_name in departments_data:
            existing = db.query(Department).filter(Department.name == dept_name).first()
            if existing:
                results["skipped"]["departments"] += 1
            else:
                new_dept = Department(
                    name=dept_name, description=f"{dept_name} Departmanı"
                )
                db.add(new_dept)
                results["departments"] += 1

        db.commit()

        # Companies Data
        companies_data = [
            {"name": "YÖRPAŞ AŞ.", "color": "#8B008B"},
            {"name": "KOMAGENE", "color": "#0000FF"},
            {"name": "PİZZA MAX", "color": "#FFFF00"},
            {"name": "BEREKET DÖNER", "color": "#008000"},
            {"name": "SCHBİTZEL LANDMANN", "color": "#FF0000"},
        ]

        for company in companies_data:
            existing = db.query(Company).filter(Company.name == company["name"]).first()
            if existing:
                results["skipped"]["companies"] += 1
            else:
                new_company = Company(
                    name=company["name"], color_code=company["color"], is_active=True
                )
                db.add(new_company)
                results["companies"] += 1

        db.commit()

        # Fetch companies for projects
        companies = db.query(Company).all()

        # Projects Data
        project_names = [
            "E-Ticaret Platformu Geliştirme",
            "Mobil Uygulama Yazılımı",
            "KYS Sistem İyileştirmesi",
            "Veritabanı Migrasyonu",
            "API Entegrasyonu",
        ]

        project_codes = ["ECOM", "MOB", "KYS", "DB", "API"]
        project_locations = [
            "İstanbul, Levent",
            "Ankara, Çankaya",
            "İzmir, Alsancak",
            "Bursa, Osmangazi",
            "Gaziantep, Şehitkamil",
        ]
        project_phones = [
            "0212 123 45 67",
            "0312 234 56 78",
            "0232 345 67 89",
            "0224 456 78 90",
            "0342 567 89 01",
        ]

        for company in companies:
            for i in range(5):
                code = f"{project_codes[i]}-{str(company.id).zfill(3)}"
                existing = db.query(Project).filter(Project.code == code).first()
                if existing:
                    results["skipped"]["projects"] += 1
                else:
                    new_project = Project(
                        name=f"{project_names[i]} - {company.name}",
                        description=f"Demo proje: {project_names[i]}",
                        code=code,
                        company_id=company.id,
                        manager_email="serkaneryilmazz@gmail.com",
                        manager_name=f"Proje Müdürü {i+1}",
                        manager_phone=project_phones[i],
                        address=project_locations[i],
                        budget=5500000,
                        is_active=True,
                    )
                    db.add(new_project)
                    results["projects"] += 1

        db.commit()

        return {
            "message": "Demo verileri başarıyla yüklendi",
            "created": {
                "users": results["users"],
                "departments": results["departments"],
                "companies": results["companies"],
                "projects": results["projects"],
            },
            "skipped": results["skipped"],
            "total": {
                "created": sum(
                    [
                        results["users"],
                        results["departments"],
                        results["companies"],
                        results["projects"],
                    ]
                ),
                "skipped": sum(results["skipped"].values()),
            },
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Demo veri yükleme hatası: {str(e)}",
        )
