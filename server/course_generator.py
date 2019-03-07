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

html = """<html>
<head></head>
<body>

<p>Hello World!</p>
<p>""" + sys.argv[1].Course_Registration_Number +  """</P>

</body>
</html>"""

print(html)
