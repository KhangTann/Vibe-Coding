from sqlalchemy.orm import Session
import models, schemas

def get_students(db: Session):
    return db.query(models.Student).all()

def get_student(db: Session, student_id: str):
    return db.query(models.Student).filter(models.Student.student_id == student_id).first()

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def update_student(db: Session, student_id: str, student: schemas.StudentUpdate):
    db_student = get_student(db, student_id)

    if not db_student:
        return None

    for key, value in student.dict().items():
        setattr(db_student, key, value)

    db.commit()
    db.refresh(db_student)

    return db_student

def delete_student(db: Session, student_id: str):
    db_student = get_student(db, student_id)

    if not db_student:
        return None

    db.delete(db_student)
    db.commit()

    return db_student