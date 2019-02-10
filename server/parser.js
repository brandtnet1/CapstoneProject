
const mongoose = require('mongoose');
const Course = require("/models/Course");

/*
var temp = Course.register(
           new Course({ Status : s, 
                        Seats_Available : sa, 
                        Course_Registration_Number : crn, 
                        Course_Department : cd, 
                        Course_Level: cl, 
                        Course_Section : cs, 
                        Course_Title : ct, 
                        Course_Credits : cc, 
                        Times : time_array, 
                        Days : day_array, 
                        Location : l, 
                        Instructor : i, 
                        Competency : c, 
                        Comments : comms
                    });
*/

// Load html file

// Parse html file
    // Find each time a class is mentioned in a row and ignore
        //hdrCourse(gray), partOfTerm(blue), hdrDept(yellow)
    // Start saving the variables for creating database entry
    
// Create database objects for courses
import codecs

#Open HTML file
f=codecs.open("schedule.html", 'r')
sections = f.read()
sections = sections.split("</tr>")


#skip over intersession courses
for first in range(0, len(sections)):
    if("FULL TERM" in sections[first]):
        break;
first += 3;
sections = sections[first:]



def parseCourse(section):
    lines = section.splitlines()
    parts = section.split("</td>");
    
    #get status of course
    status = False
    if("Open" in section):
        status = True
        
    #get seats available
    seats_available = int(parts[1][27:len(parts[1]) - 7])
    
    # get course_number department & level
    line = parts[2]
    line = line[29:len(line) - 7]
    line = line.replace("  ", " ")
    line = line.split(" ");
    
    course_number = line[0]
    department = line[1]
    course_level = line[3]
    course_section = 1
    if(len(line) == 5):
        course_section = int(line[4])
        
    # instructor name
    instructor = parts[len(parts) - 4][21:]
    instructor = instructor.split(" ")
    instructor = instructor[0] + " " + instructor[1]
    
    #find name of course
    name = parts[3][28:]
    
    #get location
    location = parts[len(parts) - 8]
    location = location[42:len(location) - 7]
   
    
    #get credits
    credits = parts[4]
    try:
        credits = int(credits[33: len(credits) - 6])
    except:
        credits = 0
    

    
    print str(status) + " " + str(seats_available) + " "+ course_number + " " + department + " " + course_level + " " + str(course_section) + " " + name +" " + str(credits) +  " " + instructor + " " + location
    


#loop through all sections in HTML file
i = 0;
while(i<len(sections)):
    section = sections[i]
    
    #if this sections contains course details, parse it
    if("Open" in section or "Filled" in section):
        parseCourse(section)
        
    i += 1
        
    
    







# skip over all intersession courses
#for line in lines:
#    i += 1
#    if('FULL TERM' in line):
#        lines = lines[i+2:]
#        break
        
    
    

        
        
        

    
        
        