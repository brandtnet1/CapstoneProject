import webbrowser
import sys
import codecs
import json
import re
import pymongo
from collections import OrderedDict
import requests



myclient = pymongo.MongoClient('mongodb+srv://admin:root@cluster0-pmazi.mongodb.net/Capstone?retryWrites=true')
mydb = myclient['Capstone']
mycol = mydb['courses']

x = mycol.find_one({"Course_Title": "Human Evolution"})
crns = re.findall(r'"(.*?)"', str(sys.argv[1]))
crns = crns[1:]

s = ""

for crn in crns:

    course = mycol.find_one({"Course_Registration_Number": crn})

    s += "<p><b>" + course.get("Course_Title") + " </b>"

    #Add Times
    for time in course.get("Times"):
        s += time + " "


    for day in course.get("Days"):
        s += day + " "
    s += '<br>'


    s += "Location: "
    for loc in course.get("Location"):
        s+= loc + " "
    s += "<br>"

    s += "Department: " + course.get("Course_Department") + "<br>"
    s += "Instructor: " + course.get("Instructor") + "<br>"
    s += "CRN: "  + crn + "<br>"


    s+= "</p>"




html = """<html>
<head></head>
<body>

<p><font size="24">Course Schedule</font></p>

""" + s +  """

<button> save </button>
</body>
</html>"""

print(html)
