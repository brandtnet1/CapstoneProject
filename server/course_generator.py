import webbrowser
import sys
import codecs
import json
import re
import pymongo
from collections import OrderedDict
import requests


#obtain course database
myclient = pymongo.MongoClient('mongodb+srv://admin:root@cluster0-pmazi.mongodb.net/Capstone?retryWrites=true')
mydb = myclient['Capstone']
mycol = mydb['courses']

#x = mycol.find_one({"Course_Title": "Human Evolution"})
# get CRN's from the command line
crns = re.findall(r'"(.*?)"', str(sys.argv[1]))
crns = crns[0:]

#build Arrays for Days and Colors
MTWRF = ['M','T','W','R','F']
colors = ["#000080","#FFC0CB","00FF00","#FF00FF","0000FF"]

tableColors = []
for color in colors:
    tableColors.append("<td bgcolor=\"" + color + "\"> </td>")

#Build base Table
table  = [[-2,-2,-2,-2,-2]]
for i in range(52):
    table.append([-2,-2,-2,-2,-2])

#Takes integer and converts it to string time
def intToTime(i):
    hour = i//4 + 8
    min = str((i%4)*15)

    if min == '0':
        min = "00"

    if hour>12:
        hour -= 12

    return str(hour) + ":" + str(min)

#Takes time and converts it to integer
def timeToInt(time):

    #Get start and ending string, and if it is in the morning or afternoon
    time = time.split("-")
    start = time[0].split(":")
    end = time[1].split(":")
    aOrP = end[1][2:3]
    end[1] = end[1][0:2]

    #convert start and end to integer
    start = (int(start[0]) * 4) + (int(start[1]) // 15)
    end = (int(end[0]) * 4) + (int(end[1]) // 15)

    #if the class ends in the afternoon adjust accordingly
    if end < start:
        end += 48
    elif aOrP == 'P' and end <=48:
        start += 48
        end += 48

    #subtract innitial 8 hours
    start -= 32
    end -= 32
    return start,end

#adds given time/day to the schedule, with c representing the color
def addToTable(time,days,c):
    #get start and end time
    time = timeToInt(time)
    start = time[0]
    end = time[1]

    #loop through days
    for d in range(len(days)):
        #loop through times
        for t in range(start,end+1):
            #if space is free, add course
            if table[t][MTWRF.index(days[d])] == -2:
                table[t][MTWRF.index(days[d])] = c
            #else mark it as overbook (red)
            else:
                table[t][MTWRF.index(days[d])] = -1

#Returns HTML for course Schedule (LEFT)
def buildSchedule():
    s = ""
    c = 0

    #loop through all courses
    for crn in crns:
        #get course from database
        course = mycol.find_one({"Course_Registration_Number": crn})

        #Add course title to HTML
        s += "<p><b>" + course.get("Course_Title") + " </b>"

        #add days and times to HTML
        times = course.get("Times")
        days = course.get("Days")
        if len(days) == 0 or days[0] == "TBA":
            s+= " TBA"
        else:
            for i in range(len(times)):
                time = times[i]
                day = days[i]
                s += time + " " + day
                addToTable(time,day,c)
            s +="<b><font color=\"" + colors[c] + "\" size=\"30\">.</font></b>"
            c = (c+1)%len(tableColors)
        s += '<br>'

        #add location to HTML
        s += "Location: "
        for loc in course.get("Location"):
            s+= loc + " "
        s += "<br>"
        #add department/Instructor/CRN to HTML
        s += "Department: " + course.get("Course_Department") + "<br>"
        s += "Instructor: " + course.get("Instructor") + "<br>"
        s += "CRN: "  + crn + "<br>"
        s+= "</p>"

    return s

#Builds course Table (RIGHT)
def buildTable():

    #Add header to able
    t = "<table>"
    t += """
        <tr>
            <th>   </th>
            <th>MON</th>
            <th>TUE</th>
            <th>WED</th>
            <th>THU</th>
            <th>FRI</th>
        </tr>
    """

    i = 0
    #Loop through rows of the table (15 minute intervals)
    for row in table:
        #add time to row
        t+= "<tr>"
        t += "<td> " + intToTime(i) + " </td>"
        i += 1

        #add colors to designated areas
        for x in row:
            if x == -2:
                t += "<td> </td>"
            elif x == -1:
                t += "<td bgcolor=\"#FF0000\"> Overlap </td>"
            else:
                t += tableColors[x]

        t += "</tr>"
    t += "</table>"

    return t

#returns the link of the currect page
def getCurrentLink():
    link = "http://localhost:5000/export_cart?"
    for crn in crns:
        link += "CRN=" + crn + "&"
    return link


#print HTML
myschedule = buildSchedule()
myTable = buildTable()
link = getCurrentLink()
html = """<html>
<head></head>
<style>
* {
  box-sizing: border-box;
}
table {
  border: 3px solid black;
  border-collapse: collapse;
  height: 600px;
}

th,td{
 width: 50px;
}

.column {
  float: left;
  width: 50%;
  padding: 10px;
}

.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>
<body>

<p><font size="24">Course Schedule</font></p>

<div class="row">
  <div class="column">
    """ + myschedule + """

    <a href='""" + link + """'download>Download Schedule</a>


  </div>
  <div class="column">
    """ + myTable + """
  </div>
</div>



</body>
</html>"""

print(html)
