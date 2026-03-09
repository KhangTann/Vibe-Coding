from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import models
import schemas
import crud


from fastapi.responses import StreamingResponse
import csv
import io


from database import SessionLocal, engine

models.Base.metadata.clear()
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/students", response_model=list[schemas.Student])
def read_students(name: str = None, db: Session = Depends(get_db)):
    if name:
        return crud.get_students_by_name(db, name)
    return crud.get_students(db)


@app.post("/students", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student.student_id)

    if db_student:
        raise HTTPException(status_code=400, detail="Student already exists")

    return crud.create_student(db, student)

@app.put("/students/{student_id}", response_model=schemas.Student)
def update_student(student_id: str, student: schemas.StudentUpdate, db: Session = Depends(get_db)):
    db_student = crud.update_student(db, student_id, student)

    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")

    return db_student

@app.delete("/students/{student_id}")
def delete_student(student_id: str, db: Session = Depends(get_db)):
    db_student = crud.delete_student(db, student_id)

    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")

    return {"message": "Student deleted"}


@app.get("/classes", response_model=list[schemas.Class])
def read_classes(db: Session = Depends(get_db)):
    return crud.get_classes(db)


@app.get("/students/stats")
def student_stats(db: Session = Depends(get_db)):
    # delegate to crud function for computation
    return crud.calculate_stats(db)

@app.post("/classes", response_model=schemas.Class)
def create_class_endpoint(class_: schemas.ClassCreate, db: Session = Depends(get_db)):
    db_class = crud.get_class(db, class_.class_id)
    if db_class:
        raise HTTPException(status_code=400, detail="Class already exists")
    return crud.create_class(db, class_)




@app.get("/students/export")
def export_students(db: Session = Depends(get_db)):
    students = crud.get_students(db)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["student_id", "name", "birth_year", "major", "gpa", "class_name"])
    for s in students:
        class_name = s.class_.class_name if s.class_ else "N/A"
        writer.writerow([s.student_id, s.name, s.birth_year, s.major, s.gpa, class_name])
    output.seek(0)
    return StreamingResponse(io.BytesIO(output.getvalue().encode('utf-8')), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=students.csv"})
