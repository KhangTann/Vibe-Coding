from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class ClassModel(Base):
    __tablename__ = "classes"
    __table_args__ = {'extend_existing': True}

    class_id = Column(String, primary_key=True, index=True)
    class_name = Column(String)
    advisor = Column(String)

    students = relationship("Student", back_populates="class_")

class Student(Base):
    __tablename__ = "students"
    __table_args__ = {'extend_existing': True}

    student_id = Column(String, primary_key=True, index=True)
    name = Column(String)
    birth_year = Column(Integer)
    major = Column(String)
    gpa = Column(Float)
    class_id = Column(String, ForeignKey("classes.class_id"))

    class_ = relationship("ClassModel", back_populates="students")