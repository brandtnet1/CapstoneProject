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
    s += crn + " "
    x = mycol.find_one({"Course_Registration_Number": crn})
    s += x.get("Course_Title") + " "



html = """<html>
<head></head>
<body>

<p>Course Schedule</p>


<p>""" + s +  """</P>


</body>
</html>"""

print(html)
