# ClassRoom
## Models
### 1. Student
student = { username, password, list(class_id) }
### 2. Tutor
tutor = { username, password, list(class_id) }
### 3. File
file = { url, name, description, uploadedAt, uploadedBy, type }
### 4.Class
class = { name, list(student_id), list(files_id), createdBy, createdOn }
## API
### create student
http:localhost:3000/api/create-student
### login student
http:localhost:3000/api/student-login
### all students
http:localhost:3000/api/students
### create tutor
http:localhost:3000/api/create-tutor
### login tutor
http:localhost:3000/api/tutor-login
### all tutors
http:localhost:3000/api/tutors
### create class
http:localhost:3000/api/create-classroom
### all classes
http:localhost:3000/api/classes
### add student to class
http:localhost:3000/api/add-student
### remove student from class
http:localhost:3000/api/remove-student
### class feed
http:localhost:3000/api/class-feed
### add file
http:localhost:3000/api/upload-file
### modify file
http:localhost:3000/api/modify-file
### delete file
http:localhost:3000/api/file
### get all files
http:localhost:3000/api/files
### file feed
http:localhost:3000/api/file-feed