import requests
from bs4 import BeautifulSoup

import mysql.connector
from dotenv import load_dotenv
import os

import re

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

# Create a Courses table
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

# Create a Prerequisites table
mycursor.execute("""
CREATE TABLE IF NOT EXISTS Prerequisites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(255),
    prereq VARCHAR(255)
);
""")     
db.commit()              

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

def findPrereq(arr):
    """
    This function takes in a list which was taken from the pTag when trying to find notes
    and returns a list of prerequisites.

    arr: an array of notes
    """

    # \b[A-Z]{2,4}: Only Capital letters from A-Z with 2-4 characters
    # \s?: optional space
    # \d[0-9]{2,3}\b: digits from 0-9, with 2-3 characters
    pattern = r'\b[A-Z]{2,4}\s?\d[0-9]{2,3}\b'

    prerequisites = []
    next = False
    for i in arr:
        if 'Prerequisite' in i:
            next = True
            continue
        if next:
            prerequisites = re.findall(pattern, i)
            next = False
            break

    # Removes the period from from the raw text    
    noDecimalsPrereqs = []
    for i in prerequisites:
        noDecimalsPrereqs.append(i.split('.')[0])

    # Removes the space in between the course names
    cleanedPrereqs = []
    for i in noDecimalsPrereqs:
        cleanedPrereqs.append(i.replace(" ", ""))
         
    return cleanedPrereqs

def fetch_subjects():
    url = f"https://catalogue.usask.ca/"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    # Find the select element by id
    select = soup.find("select", id="subj-code")

    # Extract all option values
    subjects = [option['value'] for option in select.find_all("option") if option['value']]

    # Print the results
    return subjects

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
        prerequisite = []
        if divRow:
            colPrereq = divRow.find('div', class_='col-md-5')
            if colPrereq:
                pTag = colPrereq.find('p')
                pTagList = list(pTag.stripped_strings)
            notes = list_to_text(pTagList)  

        prerequisite = findPrereq(pTagList)
        
        courses.append({
            'title': title,
            'subject': courseSubject,
            'number': int(number),
            'class_name': name,
            'description': description,
            'notes': notes,
            'prerequisite': prerequisite
        })
    return courses

def main():
    subjects = fetch_subjects()
    for subject in subjects:
        courses = fetch_courses(subject)
        for i in courses:
            mycursor.execute("""
            INSERT INTO Courses (
                title,
                subject,
                number,
                class_name,
                description,
                notes)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (i['title'], i['subject'], i['number'], i['class_name'], i['description'], i['notes']))
        db.commit()

        for i in courses:
            if i['prerequisite'] == []:
                continue
            for j in i['prerequisite']:
                mycursor.execute("""
                INSERT INTO Prerequisites (course, prereq)
                VALUES (%s, %s)
            """, (i['class_name'], j))
        db.commit()
    print("courses and prerequisites have been added successfully")    


if __name__=="__main__":
    main()
