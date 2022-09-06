from ast import Subscript
import encodings
from threading import local
from bs4 import BeautifulSoup
import requests 
from tqdm import tqdm 
import re
import time
import pymongo 
import urllib.parse
from pprint import pprint
import html
import pandas as pd
import pandas

link_arr = []

class person:


    class expcompany:

        def __init__(comp):

            comp.explist = {}
            comp.company_name = ""
        
        def setexp(comp,listr):
            
            try:
                souper = BeautifulSoup(str(listr),"html5lib")
            except:
                print("CANNOT SOUP OUT EXPERIENCE ===================================")
                time.sleep(10)
                return 

            expindx = 0
            
            ulr = souper.select("span.pvs-entity__path-node")


            if len(ulr)>0:

                unorexp = souper.select_one("ul.pvs-list")

                listers =  unorexp.findChildren("li" , recursive=False)

                try:
                    comp.company_name = html.unescape(souper.select ("span.mr1.hoverable-link-text.t-bold span.visually-hidden")[0].text).strip()
                
                except Exception as e:
                    print("Cannot put company name in if")
                    print(e)
                    time.sleep(10)

                for lister in listers:

                    title = ""
                    date_range = ""
                    duration = ""
                    location = ""
                    pracarea = ""

                    listsoup = BeautifulSoup(str(lister),"html5lib")
                    
                    try:
                        title = listsoup.select("span.mr1.hoverable-link-text.t-bold span.visually-hidden")[0].text 
                        title = html.unescape(title).strip()
                    except:
                        print("Cannot find the title of the experience",lister)
                        time.sleep(10)
                    
                    try:
                        commonnamer = listsoup.select("span.t-14.t-normal.t-black--light")
                    except Exception as e:
                        commonnamer = []
                        print("Cannot find date and location of ",lister)
                        time.sleep(10)
                        print(e)
                        time.sleep(10)
                    
                    try:
                        datetime = commonnamer[0].find("span",class_ = "visually-hidden").text
                        datetime = datetime.replace("Â","")
                        datetime = datetime.split("·")
                        
                        date_range = html.unescape(datetime[0]).strip()
                        duration = html.unescape(datetime[1]).strip()

                    except Exception as e:
                        print("Cannot split datetime")
                        time.sleep(10)
                        print(e)
                        time.sleep(10)
                    
                    
                    try:
                        location = commonnamer[1].find("span",class_ = "visually-hidden").text
                        location = html.unescape(location).strip()
                        
                    except Exception as e:
                        location = ""
                        print("Cannot find location")
                        time.sleep(5)
                        print(e)
                        time.sleep(10)

                    try:
                        pracarea = listsoup.select("div.inline-show-more-text.inline-show-more-text--is-collapsed span.visually-hidden")[0].text 
                        pracarea = html.unescape(pracarea).strip()
                    
                    except Exception as e:
                        print("cannot find pracarea")
                        time.sleep(0)
                        print(e)
                        time.sleep(5)
                    
                    comp.explist[str(expindx)] = {"title" : title,"date_range" : date_range,"duration" : duration,"company_location" : location,"pracarea" : pracarea}
                    expindx+=1
            else:
                title = ""
                date_range = ""
                duration = ""
                location = ""
                pracarea = ""
                
                try:
                    title = souper.select("span.mr1.t-bold span.visually-hidden")[0].text 
                    title = html.unescape(title).strip()
                except:
                    print("Cannot find the title of the experience",listr)
                    time.sleep(10)
                    return False
                    
                
                try:
                    compnamer = souper.select("span.t-14.t-normal span.visually-hidden")[0].text
                    compnamer = compnamer.replace("Â","")
                    compnamer = compnamer.split("·")
                
                except Exception as e:
                    
                    print("Cannot find the company name of ",listr)
                    time.sleep(10)
                    print(e)
                    time.sleep(10)
                
                try:
                    comp.company_name = html.unescape(compnamer[0]).strip()
                except Exception as e:
                    print("Company name list index out of range")
                    time.sleep(10)
                    print(e)
                    time.sleep(10)
                
                try:
                    commonnamer = souper.select("span.t-14.t-normal.t-black--light span.visually-hidden")
                except Exception as e:
                    commonnamer = []
                    print("Cannot find date and location of ",listr)
                    time.sleep(10)
                    print(e)
                    time.sleep(10)
                
                try:
                    datetime = commonnamer[0].text
                    datetime = datetime.replace("Â","")
                    datetime = datetime.split("·")
                    
                    date_range = html.unescape(datetime[0]).strip()
                    duration = html.unescape(datetime[1]).strip()

                except Exception as e:
                    print("Cannot split datetime")
                    time.sleep(10)
                    print(e)
                    time.sleep(10)
                
                try:
                    location = commonnamer[1].text.strip()
                    
                except Exception as e:
                    location = ""
                    print("Cannot find location")
                    time.sleep(5)
                    print(e)
                    time.sleep(10)
                try:
                    pracarea = souper.select("div.inline-show-more-text.inline-show-more-text--is-collapsed span.visually-hidden")[0].text 
                    pracarea = html.unescape(pracarea).strip()
                    try:
                        pracarea = pracarea.decode(encoding="UTF-8",errors='ignore')
                    except:
                        pass
                    #pracarea = pracarea.replace("\nï","")
                    #pracarea = pracarea.replace("ï","")
                    #pass
                
                except Exception as e:
                    print("cannot find pracarea")
                    time.sleep(0)
                    print(e)
                    time.sleep(5)
                comp.explist['0'] = {"title" : title,"date_range" : date_range,"duration" : duration,"company_location" : location,"pracarea" : pracarea}

            return True
        

        def returndict(comp):

            diction = {}

            diction['company_name'] = comp.company_name

            for key,item in comp.explist.items():
                diction[key] = item
            return diction


    class educomp:

        def __init__(edu):

            edu.university_name = ""
            edu.education_list = {}
        
        def setedu(edu,listr):

            try:
                souper = BeautifulSoup(str(listr),"html5lib")
            except:
                print("CANNOT SOUP OUT EDUCATION ===================================")
                time.sleep(10)
                return False

            eduindx = 0

            degree_name = ""
            field_of_study = ""
            grade = "" 
            date_year = ""
            Activities_Societies = ""
            
            try:
                degree = souper.select("span.t-14.t-normal span.visually-hidden")[0].text 
                degree  = html.unescape(degree).strip()
                deg = degree.split(",")

                if len(re.findall(r"[0-9][0-9][0-9][0-9]+",degree))>0:
                    degree_name = ""
                else:
                    if len(deg) == 1:
                        degree_name = deg[0]
                    elif len(deg) >=2:
                        field_of_study = deg[-1]
                        degree_name = " ".join(deg[:-1])
            except:
                print("Cannot find the degree of the education",lister)
                time.sleep(10)
            
            try:
                edu.university_name = souper.select("span.mr1.hoverable-link-text.t-bold span.visually-hidden")[0].text
                edu.university_name = html.unescape(edu.university_name).strip()
            except Exception as e:
                print("Cannot find UNIVERSITY NAME IN ",souper.prettify())
                print(e)
                time.sleep(10)
            
            try:
                date_year = souper.select("span.t-14.t-normal.t-black--light span.visually-hidden")[0].text
                date_year = html.unescape(date_year).strip()
            except Exception as e:
                print("date year not found")
                print(e)
                time.sleep(10)

            try:
                gradeortext = souper.select("div.inline-show-more-text.inline-show-more-text--is-collapsed span.visually-hidden")

                for grader in gradeortext:

                    texter = html.unescape(grader.text).strip()

                    texas = texter.split("Grade:")

                    if len(texas) ==1:
                        tex = texter.split("Activities and societies:")
                        if len(tex) == 1:
                            Activities_Societies = tex[0]
                        
                        if len(tex) >=2:
                            Activities_Societies = " ".join(tex[1::]).strip()
                    
                    else:
                        grade = texas[1]

            except Exception as e:
                print("Error in grade and activities allocation")
                print(e)
                time.sleep(10)    
            
            edu.education_list[str(eduindx)] = {"degree_name" : degree_name,"Field_Of_Study" : field_of_study,"grade" : grade,"date_year" : date_year,"Activities_Societies" : Activities_Societies}
            eduindx+=1

            return True

        def returndict(edu):

            diction = {}

            diction['university_name'] = edu.university_name

            for key,item in edu.education_list.items():
                diction[key] = item
            return diction

    def __init__(self):
        self.personname = ""
        self.firstname = ""
        self.middlename = ""
        self.lastname = ""
        self.linked_profile = ""
        self.headline = ""
        self.location = ""
        self.jobtitle = ""
        self.company = ""
        self.image = ""
        self.connections = ""
        self.description = ""
        self.experience = {}
        self.education = {}
    
    def setname(self):
        if self.personname == "":
            print("PERSONNAME PROBLEM==============================================================")
            time.sleep(50)
        
        namer = self.personname.split()

        if len(namer) == 1:
            self.firstname = namer[0]
        
        elif len(namer) == 2:
            self.firstname = namer[0]
            self.lastname = namer[1]

        elif len(namer)>=3:
            self.lastname = namer[-1]
            self.middlename = namer[-2]
            self.firstname = " ".join(namer[:-2])
    
    def sethead(self):

        try:
            header  = re.split("\sat\s",self.headline)
            
            if len(header) <=1:
                print("HEADLINE SPLIT ERROR =============================================================")
                raise Exception("HEADLINE NOT SPLITTABLE")
            
            self.jobtitle = header[0]
            self.company = header[1]
        
        except:
            print("header doesnt' have AT")
            time.sleep(3)

            self.jobtitle = header[0]
    
    # def returnedu(self):

    #     retdict = {}

    #     for i in self.education.keys():
    #         retdict[i] = {"title" : self.education[i][]}
            
def get_links():

    global link_arr

    df = pd.read_excel(r"C:\Users\prade\Downloads\Sample-Data.xlsx")

    link_arr = df['Sample-Links'].to_list()

    #print(link_arr)



def main():

    global link_arr

    #link_arr = ["https://www.linkedin.com/in/sasangan-ramanathan-63079412/","https://www.linkedin.com/in/amol-khedekar/","https://www.linkedin.com/in/pradeep-karthik-muthusamy-bb172a217/","https://www.linkedin.com/in/bindu-k-r-6373113/"];

    client = pymongo.MongoClient("mongodb://localhost:27017/");

    voxxdb = client['linkedin'];

    linkedin = voxxdb['collect'];

    linkedin.drop()

    linkedin = voxxdb['collect']

    for index in range(len(link_arr)):

        curr = person()

        curr.linked_profile = link_arr[index]

        print(curr.linked_profile)

        
        fp = open(fr"C:\Users\prade\Downloads\NodeJS\sample\soups\person{index+1}\{index+1}.html",encoding="utf8")

        soup = BeautifulSoup(fp,"html5lib")

        try:
            finder = soup.select("h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words")[0].text
        except:
            finder = ""
        
        curr.personname = html.unescape(finder).strip() 

        curr.setname()

        try:
            head = soup.select("div.text-body-medium.break-words")[0].text
        except:
            print("Header choosing error==============================================================")
            time.sleep(10)
            head = ""
        
        curr.headline = html.unescape(head).strip()

        curr.sethead()

        try:
            location = soup.select("span.text-body-small.inline.t-black--light.break-words")[0].text 
        
        except:
            print("LOCATION ERROR==========================================================")
            print("")   #----------------------------------------------------------------------------------insert URL----------------
            time.sleep(10)
            location = ""
        
        curr.location = html.unescape(location).strip()

        try:
            curr.image = soup.select("div.pv-top-card__non-self-photo-wrapper.ml0 button img")[0]['src']
        except:
            print("IMAGE EXCEPTION =================================================================")
            time.sleep(10)

        try:
            connect = soup.select("ul.pv-top-card--list.pv-top-card--list-bullet.display-flex.pb1 li span span")[0].text
        except:
            print("NO OF CONNECTIONS ERROR ================================================================")
            time.sleep(10)
            connect = ""
        
        curr.connections = html.unescape(connect).strip()

        try:
            descript = soup.select("section.artdeco-card.ember-view.relative.break-words.pb3.mt2")
            description = ""

            for desc in descript:
                try:
                    descsoup = BeautifulSoup(str(desc),"html5lib")

                    divi = descsoup.find("div",class_="pv-profile-card-anchor")

                    if divi['id'] == "about":
                        print("about success")
                        description = descsoup.select("div.inline-show-more-text.inline-show-more-text--is-collapsed span.visually-hidden")[0].text
                        description = html.unescape(description).strip()
                        break
                except:
                    pass


        except:
            print("DESCRPTION NOT FOUND")
            time.sleep(10)
            description = ""
        
        curr.description = html.unescape(description).strip()

        expindx = 1
        eduindx = 1


        fped = open(fr"C:\Users\prade\Downloads\NodeJS\sample\soups\person{index+1}\{index+1}experience.html",encoding = "utf8")

        expsoup = BeautifulSoup(fped,"html5lib")

        unor = expsoup.select("ul.pvs-list")[0]

        listers = unor.find_all("li",class_ = "pvs-list__paged-list-item artdeco-list__item pvs-list__item--line-separated")

        for lis in listers:

            expobj = curr.expcompany()
            
            if expobj.setexp(lis):

                curr.experience[str(expindx)] = expobj.returndict()
                expindx+=1
            
            else:
                pass


        fpex = open(fr"C:\Users\prade\Downloads\NodeJS\sample\soups\person{index+1}\{index+1}education.html",encoding = "utf8")

        expsoup = BeautifulSoup(fpex,"html5lib")

        unor = expsoup.select("ul.pvs-list")[0]

        listers = unor.find_all("li",class_ = "pvs-list__paged-list-item artdeco-list__item pvs-list__item--line-separated")

        for lis in listers:

            eduobj = curr.educomp()
            
            eduobj.setedu(lis)

            curr.education[str(eduindx)] = eduobj.returndict()
            eduindx+=1
        
        pprint(curr.__dict__)

        # expdict = {}


        # for key in curr.experience.keys():
        #     print(curr.experience)

        #     expdict[key] = {}

        #     expdict[key]['company_name'] = curr.experience[key]['company_name']

        #     print(curr.ex)

        #     for k in curr.experience['explist'].keys():
        #         expdict[key][k] = curr.experience[key]['explist'][k]
                
        #     print(expdict)
        diction = {"linkedin_Profile" : curr.linked_profile,"fullName" : curr.personname,"firstName" : curr.firstname,"lastName" : curr.lastname,"middleName" : curr.middlename,"headline" : curr.headline,"location" : curr.location,"jobTitle" : curr.jobtitle,"company" : curr.company,"imgURL" : curr.image,"connectionsCount" : curr.connections,"description" : curr.description,"Experience" : curr.experience,"Education" : curr.education}
        linkedin.insert_one(diction)
        break

if __name__ == "__main__":
    get_links()
    main()