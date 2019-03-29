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

table  = [[0,0,0,0,0]]
MTWRF = ['M','T','W','R','F']
for i in range(51):
    table.append([0,0,0,0,0])

def intToTime(i):
    hour = i//4 + 8
    min = str((i%4)*15)

    if(min == '0'):
        min = "00"

    if(hour>12):
        hour -= 12

    return str(hour) + ":" + str(min)

def timeToInt(time):
    time = time.split("-")

    start = time[0].split(":")
    end = time[1].split(":")
    aOrP = end[1][2:3]
    end[1] = end[1][0:2]

    start = (int(start[0]) * 4) + (int(start[1]) // 15)
    end = (int(end[0]) * 4) + (int(end[1]) // 15)

    if (end<start):
        end += 48
    elif(aOrP == 'P' and end <=48):
        start += 48
        end += 48

    start -= 32
    end -= 32
    return start,end

def addToTable(time,days):
    time = timeToInt(time)
    start = time[0]
    end = time[1]


    for d in range(len(days)):
        for t in range(start,end+1):
            table[t][MTWRF.index(days[d])] += 1

def buildSchedule():
    s = ""
    for crn in crns:

        course = mycol.find_one({"Course_Registration_Number": crn})

        s += "<p><b>" + course.get("Course_Title") + " </b>"

        #Add Times
        #for time in course.get("Times"):
        #    s += time + " "


        #for day in course.get("Days"):
        #    s += day + " "
        #s += '<br>'

        times = course.get("Times")
        days = course.get("Days")

        for i in range(len(times)):
            time = times[i]
            day = days[i]
            s += time + " " + day
            addToTable(time,day)


        s += '<br>'



        s += "Location: "
        for loc in course.get("Location"):
            s+= loc + " "
        s += "<br>"

        s += "Department: " + course.get("Course_Department") + "<br>"
        s += "Instructor: " + course.get("Instructor") + "<br>"
        s += "CRN: "  + crn + "<br>"


        s+= "</p>"
    return s

def buildTable():

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
    for row in table:
        t+= "<tr>"
        t += "<td> " + intToTime(i) + " </td>"
        i += 1
        #t+= "<td height=\"2\" bgcolor=\"#FF0000\"> </td> <td height=\"2\"> </td> <td height=\"2\"> </td> <td height=\"2\"> </td> <td height=\"2\"> </td>"
        for x in row:
            if(x == 0):
                t += "<td bgcolor=\"#FFFFFF\">  </td>"
            elif(x >=2):
                t += "<td bgcolor=\"#FF0000\">  </td>"
            else:
                t += "<td bgcolor=\"#00FF00\">  </td>"

        t += "</tr>"
    t += "</table>"

    return t



schedule = buildSchedule()
mySchedule = buildTable();
html = """<html>
<head></head>
<style>
* {
  box-sizing: border-box;
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
    """ + schedule + """
  </div>
  <div class="column">
    """ + mySchedule + """
  </div>
</div>


</body>
</html>"""

print(html)
