# Parse it like it's hot
import codecs
import re

#Open HTML file
f=codecs.open("html/rollins_course_schedule.html", 'r')
sections = f.read()
sections = sections.split("</tr>")

courses_json = []

def skip_intersession():
    #skip over intersession courses
    for first in range(0, len(sections)):
        if("FULL TERM" in sections[first]):
            break;
    first += 3;
    sections = sections[first:]


def parseCourse(section):
   
    parts = section.split("<td");
    
    #get status of course
    status = parts[1]
    if("Open" in status):
        status = True
    else: 
        status = False
        
    #get seats available
    seats_available = parts[2]
    seats_available = re.sub('.*><.*?>', '', seats_available)
    seats_available = seats_available.replace(' ', '').split('\n')
    
    # get course_number department & level & section
    cn_d_l = parts[3]
    cn_d_l = cn_d_l[25:len(cn_d_l) - 19]
    cn_d_l = cn_d_l.replace('  ', ' ').replace('  ', ' ').split(" ");
    course_number = cn_d_l[0]
    department = cn_d_l[1]
    level = cn_d_l[2]
    section = 1
    if(len(cn_d_l) == 4):
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
    # Chris is the time master
    # times = time.split('<br>')
    # times[0] = times[0][44:]
    # times[len(time)]
    # ([0-9].:[0-9][0-9]-[0-9][0-9]:[0-9][0-9][a-zA-z])
    #([0-9]. ?:[0-9][0-9]-[0-9]. ?:[0-9][0-9][a-zA-z])
    
    
    #get day
    days = parts[7]
    days = re.sub('.*?><.*?>', '', days).replace('<br>', '')
    days = days.replace(' ', '').split('\n')

    #get location
    location = parts[8]
    location = re.sub('.*><.*?>', '', location).replace('<br>', '')
    location = location.replace(' ', '').split('\n')

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

    return [status, seats_available, course_number, department, level, section, name, credits, times, days, location, instructor, competency, note]

def parse_html():
    skip_intersession()
    
    #loop through all sections in HTML file
    i = 0;
    while(i<len(sections)):
        section = sections[i]
        
        #if this sections contains course details, parse it
        if("Open" in section or "Filled" in section or "Cancelled" in section):
            courses_json.append(parseCourse(section))
            
        i += 1
        

    return courses_json
    

        