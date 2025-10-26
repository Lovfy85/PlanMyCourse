import requests
from bs4 import BeautifulSoup

import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

# MySql Config
db = mysql.connector.connect(
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASS'),
    database=os.getenv('DB_NAME'),
    host=os.getenv('DB_HOST')
)
if db.is_connected():
    print("Connected to database")
else:
    print("Did not connect")

mycursor = db.cursor()

# Create a courses table
mycursor.execute("""
CREATE TABLE IF NOT EXISTS Courses (
    courseId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    subject VARCHAR(255),
    number INT,
    class_name VARCHAR(255),
    description TEXT,
    notes TEXT
)
""")              

def get_class_num(title):
    """
    Takes in a title, splits the array based on the white spaces
    then returns only the class number.

    title: A string where the second word is the class number
    """
    # Turns title into an array
    titleParts = title.strip().split()

    num = titleParts[1].split('.')[0] #No period, or extra numbers
    return num

def list_to_text(arr):
    """
    Takes in an array and arranges it into one string,
    with each element in a new line.

    arr: An array filled with strings
    """

    notes = ""
    for i in arr:
        notes = notes + i + "\n"
    
    return notes


def fetch_courses(courseSubject):
    """
    Takes in a course subject such as CMPT, and extracts all the data
    related to that subject from the usask course catalogue page. 

    courseSubject: A subject that is in all capitals
    
    """

    url = f"https://catalogue.usask.ca/?subj_code={courseSubject}&cnum="
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    courses = []
    course_elements = soup.find_all('div')


    # Initial values for elements that might not be in the url
    description = ""
    notes = ""
    

    # Iterate through all div tags
    for course in course_elements:

        # Finding the title of the course
        if course.find('h4') is None:
            continue
        elif course.find('h4').find('a') is None:
            continue
        else:
            rawTitle = course.find('h4').find('a').text
            title = rawTitle.strip()
        
        # Class number
        number = get_class_num(title)

        # Class name, ex. CMPT145
        name = courseSubject + number

        #Finding course description
        divRow = course.find('div', class_='row')
        if divRow:
            divCol = divRow.find('div', class_='col-md-7')
            if divCol is None:
                continue
            description = divCol.find('p').text

        # Finding notes
        if divRow:
            colPrereq = divRow.find('div', class_='col-md-5')
            if colPrereq:
                pTag = colPrereq.find('p')
                pTagList = list(pTag.stripped_strings)
            notes = list_to_text(pTagList)  
        
        courses.append({
            'title': title,
            'subject': courseSubject,
            'number': int(number),
            'class_name': courseSubject + number,
            'description': notes,
            'notes': notes
        })
    return courses

def main():
    courses = fetch_courses('CMPT')

    for i in courses:
        mycursor.execute("""
        INSERT IGNORE INTO Courses (
            title,
            subject,
            number,
            class_name,
            description,
            notes)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (i['title'], i['subject'], i['number'], i['class_name'], i['description'], i['notes']))
    db.commit()


if __name__=="__main__":
    main()
