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

def get_classes(db: Session):
    return db.query(models.ClassModel).all()

def get_class(db: Session, class_id: str):
    return db.query(models.ClassModel).filter(models.ClassModel.class_id == class_id).first()

def create_class(db: Session, class_: schemas.ClassCreate):
    db_class = models.ClassModel(**class_.dict())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class


def get_students_by_name(db: Session, name: str):
    return db.query(models.Student).filter(models.Student.name.like(f"%{name}%")).all()


def calculate_stats(db: Session):
    """Return simple statistics for the student table."""
    students = db.query(models.Student).all()
    total = len(students)
    average = 0
    if total > 0:
        average = sum(s.gpa for s in students) / total
    by_major: dict[str, int] = {}
    for s in students:
        by_major[s.major] = by_major.get(s.major, 0) + 1
    return {
        "total_students": total,
        "average_gpa": average,
        "students_by_major": by_major,
    }