# Parse it like it's hot
import codecs
import json
import re
import pymongo
from collections import OrderedDict
import requests

# Connect to database and set variable for specific object
myclient = pymongo.MongoClient('mongodb+srv://admin:root@cluster0-pmazi.mongodb.net/Capstone?retryWrites=true')
mydb = myclient['Capstone']
mycol = mydb['courses']

#Get HTML
try:
    sections = requests.get("https://bannerweb.rollins.edu/prod/owa/www_infotech.pkg_display_schedule.p_get_rschedule_fall?i_term_code=201909&i_campus_code=R")
except:
    print "Error, now loading from file"
    f=codecs.open("html/rollins_course_schedule_fall_2019.html", 'r')
    sections = f.read()

# split html by table rows
sections = sections.split("</tr>")

#skip over intersession courses
for first in range(0, len(sections)):
    if "FULL TERM" in sections[first]:
        break

first += 3
sections = sections[first:]

def parseCourse(section):
    # break the row down into individual columns
    parts = section.split("<td")

    #get status of course
    status = parts[1]
    if "Open" in status:
        status = "Open"
    elif "Filled" in status:
        status = "Filled"
    else:
        status = "Canceled"

    #get seats available
    seats_available = parts[2]
    seats_available = re.sub('.*><.*?>', '', seats_available)
    seats_available = seats_available.strip()

    # get course_number department & level & section
    cn_d_l = parts[3]
    cn_d_l = cn_d_l[25:len(cn_d_l) - 19]
    cn_d_l = cn_d_l.replace('  ', ' ').replace('  ', ' ').split(" ");
    course_number = cn_d_l[0]
    department = cn_d_l[1]
    level = cn_d_l[2]
    section = 1
    if len(cn_d_l) == 4:
        section = cn_d_l[3]

    #find name of course
    name = parts[4]
    name = name[18:len(name) - 12]

    #get credits
    credits = parts[5]
    try:
        credits = int(credits[23:len(credits) - 12])
    except:
        credits = 0


    #get time
    times = parts[6]
    times = re.findall('([0-9]. ?:[0-9][0-9]-[0-9]. ?:[0-9][0-9][a-zA-z])', times)
    times = [x.replace(' ', '') for x in times if x]
    # Chris is the time master, REGEX
    # ([0-9].:[0-9][0-9]-[0-9][0-9]:[0-9][0-9][a-zA-z]) first, incorrect
    # ([0-9]. ?:[0-9][0-9]-[0-9]. ?:[0-9][0-9][a-zA-z])


    #get day
    days = parts[7]
    days = re.sub('.*?><.*?>', '', days).replace('<br>', '')
    days = days.replace(' ', '').split('\n')
    days = [x for x in days if x]

    #get location
    location = parts[8]
    location = re.sub('.*><.*?>', '', location).replace('<br>', '')
    location = location.replace(' ', '').split('\n')
    location = [x for x in location if x]

    # instructor name
    instructor = parts[9]
    instructor = instructor[17:]
    instructor = instructor.split(" ")
    instructor = instructor[0] + " " + instructor[1]


    #get competency
    competency = parts[10]
    competency = competency[23: len(competency) - 12].replace('&nbsp;', '')

    #get note
    note = parts[11]
    note = note[21: len(note) - 12]
    if "nbsp" in note:
        note = "n/a"

    # Course object to be added to database
    course = [("Status", status), ("Seats_Available", seats_available),
             ("Course_Registration_Number", course_number),
             ("Course_Department", department), ("Course_Level", level),
             ("Course_Section", section), ("Course_Title", name),
             ("Course_Credits", credits), ("Times", times),
             ("Days", days), ("Location", location), ("Instructor", instructor),
             ("Competency", competency), ("Comments", note)]

    # https://www.w3schools.com/python/python_mongodb_insert.asp
    # insert one course into the database
    mycol.insert_one(OrderedDict(course))

#loop through all sections in HTML file
i = 0
while i<len(sections):
    section = sections[i]

    #if this sections contains course details, parse it
    if "Open" in section or "Filled" in section or "Cancelled" in section:
        parseCourse(section)

    i += 1

print "Done"
