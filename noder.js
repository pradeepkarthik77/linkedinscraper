const puppeteer = require("puppeteer");
const fs =require("fs");
const MongoClient = require("mongodb").MongoClient;
const url = 'mongodb://localhost:27017/';


try
{
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("linkedin");
    dbo.createCollection("profiles", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}
catch(err)
{
    console.log("Collection already exists",err)
}


var link_arr = {}//["https://www.linkedin.com/in/sasangan-ramanathan-63079412/","https://www.linkedin.com/in/amol-khedekar/","https://www.linkedin.com/in/pradeep-karthik-muthusamy-bb172a217/","https://www.linkedin.com/in/bindu-k-r-6373113/"];


function readdata()
{
    var Data;
    try
    {
        //fs.readFile('Sample-Linkedin-50K.TXT',"utf8",function (err,data) {if(err){return console.log(err)} Data = data});
        var Data = fs.readFileSync("Sample-Linkedin-50K.TXT");  
    }
    catch(err)
    {
        console.log(err);
        //var Data = ""
    }

    //Data = String(Data)
    //var combine = Data.split("~")
    var data = Data.toString()
    var combine = data.split("~")

    for(var comb of combine)
    {
        var id = comb.match(/[0-9]+?(?=\=)/);
        var arr = comb.split(/[0-9]+?(?=\=)/);
        console.log(id[0])
        console.log(arr)

        try 
        {
        id = id[0]
        var val = arr[1].slice(1,arr[1].length)
        }
        catch(err)
        {
            console.log("Link array index out of range")
            console.log(err);
        }

        link_arr[id] = val
    }

}


async function login() 
{

    try 
    {
    var browser = await puppeteer.launch({headless : false});
    var page = await browser.newPage();

    await page.goto("https://www.linkedin.com/in/sasangan-ramanathan-63079412/",{waitUntil : "domcontentloaded"});
    await page.setViewport({ width: 1366, height: 768});

    await new Promise(r => setTimeout(r, 1000));

    await page.click("button.authwall-join-form__form-toggle--bottom.form-toggle");

    await page.type("#session_key","karthik2252062003@gmail.com");
    await page.type("#session_password","karthik@2486");

    await page.click(".sign-in-form__submit-button");
    }
    catch(err)
    {
        console.log("LOGIN error",err)
    }

    var tim = Math.floor((Math.random() * 1) + 1);
    tim = tim*60*1000;

    await new Promise(r => setTimeout(r, tim));

    for(const [key,linker] of Object.entries(link_arr))
    {

    var firstname = ""
    var middlename = ""
    var lastname = ""
    var fullname = ""
    var jobTitle = ""
    var company1 = ""
    var company2 = ""
    var imageURL = ""
    var connectionsCount = ""
    var linkedinURL = linker //no logic written yet
    var description = ""
    var headline = ""
    var location = ""
    var id = key

    var experience = {}
    var education = {}

    const page2 = await browser.newPage()

    await page2.goto(linker,{waitUntil : "domcontentloaded"});

    await page2.setViewport({ width: 1366, height: 768});

    await new Promise(r => setTimeout(r, 3000));

    try
    {
    var title = await page2.evaluate(() => {
        const title = document.querySelector("h1");
        const titleText = title.innerText;
    
        return titleText.trim();
      });
    
    }
    catch(err)
    {
        console.log("FULL name cannot be found============================================",err);
    }

    let title_arr = title.split(" ");

    fullname = title

    if(title_arr.length == 1)
    {
        firstname = title_arr[0].trim()
    }

    else if(title_arr.length == 2)
    {
        lastname = title_arr[1].trim()
        firstname = title_arr[0].trim()
    }

    else if(title_arr.length >=3)
    {
        lastname = title_arr[title_arr.length-1]
        middlename = title_arr[title_arr.length-2]
        firstname = title_arr.slice(0,title_arr.length-2).toString().trim()
    }

    try
    {
        var header = await page2.evaluate(() => {
        const head = document.querySelector("div.text-body-medium.break-words");
        return head.innerText.trim();
        });

        headline = header
    }
    catch(err)
    {
        console.log("Header cannot be found================================",err)
    }

    try 
    {
    let head_arr = header.split(new RegExp("\\sat\\s"))

    if(head_arr.length == 1)
    {
        jobTitle = head_arr[0].trim()
    }
    else if(head_arr.length >= 2)
    {
        jobTitle = head_arr.slice(0,head_arr.length-1).toString().trim()
        //company = head_arr[head_arr.length-1].trim()
    }
    }
    catch(err)
    {
        console.log("Cannot assign job title================================",err);
    }

    try
    {
        var comp = await page2.evaluate(() => {
            const compan = document.querySelectorAll("ul.pv-text-details__right-panel li.pv-text-details__right-panel-item")

            if(compan.length == 1)
            {
                return [compan[0].innerText]
            }

            else if(compan.length >= 2)
            {
                return [compan[0].innerText,compan[1].innerText]
            }

            else
            {
                return ""
            }
        })

        if(comp.length == 1)
        {
            company1 = comp[0]
        }

        else if(comp.length >=2)
        {
            company1 = comp[0]
            company2 = comp[1]
        }
    }
    catch(err)
    {
        console.log("company finding error"+err)
    }

    try
    {
        var location = await page2.evaluate(() => {
            locality = document.querySelector("div.pv-text-details__left-panel.pb2 > span.text-body-small.inline.t-black--light.break-words").innerText
            return locality
        })
    }
    catch(err)
    {

    }

    try
    {
        var imageURL = await page2.evaluate(() => {
            const imgur = document.querySelector("div.pv-top-card__non-self-photo-wrapper.ml0 > button > img").getAttribute("src");
            return imgur;
        })
    }
    catch(err)
    {
        console.log("Image URL not found",err);
        
    }

    try
    {
        var connectionsCount = await page2.evaluate(() =>{
            const count = document.querySelector("ul.pv-top-card--list.pv-top-card--list-bullet.display-flex.pb1 > li.text-body-small > span.t-black--light > span.t-bold");
            return count.innerText.trim();
        })
    }
    catch(err)
    {
        console.log("Connections count not found========================================",err)
    }

    //console.log("Firstname : ",firstname,"fullname",fullname,"middlename",middlename,"lastname",lastname,"ImgURL",imageURL,"Connections",connectionsCount,"jobtitle",jobTitle,"company",company)


    try
    {
        var description = await page2.evaluate(() => {
            const sects = document.querySelectorAll("section.artdeco-card.ember-view.relative.break-words.pb3.mt2");

            for(var sect of sects)
            {
                try
                {
                var divi = sect.querySelector("div").getAttribute("id");
                }
                catch(err)
                {
                    totalerrors+="div finding error==============================="+err+"\n";
                }
            

                try 
                {
                if(divi == "about")
                {
                    let locdiv = sect.querySelector("div.inline-show-more-text.inline-show-more-text--is-collapsed > span.visually-hidden")
                    description = locdiv.innerText
                    //window.alert(description)
                    return description
                }
                }
                catch(err)
                {
                    return ""
                }

            }
            
        })

        if(description == undefined)
        {
            description = ""
        }
    }
    catch(err)
    {
        console.log("About not found================================================",err)
    }


    try
    {
        var exper = await page2.evaluate(() => {
            const sects = document.querySelectorAll("section.artdeco-card.ember-view.relative.break-words.pb3.mt2");

            for(var sect of sects)
            {
                try
                {
                var divi = sect.querySelector("div").getAttribute("id");
                }
                catch(err)
                {
                    totalerrors+="div finding error==============================="+err+"\n";
                }
            

                
                try 
                {
                var experror = "";
                if(divi == "experience")
                {
                    try
                    {
                    var lists = sect.querySelectorAll("li.artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column");
                    }
                    catch(err)
                    {
                        experror +="No inner list in expereince"+err+"\n";
                        continue;
                    }

                    var expindx = 1

                    try
                    {
                    for(var list of lists)
                    {
                        experience[String(expindx)] = {}
                        try
                        {
                        var ulr = list.querySelectorAll("span.pvs-entity__path-node");
                        }
                        catch(err)
                        {
                            experror+="The inner span.pathnode is not found"+err+"\n"
                        }

                        experror += "length"+ulr.length+"\n"
                        
                        if(ulr.length > 0)
                        {
                            var company_name = ""

                            try
                            {
                            inner_list = list.querySelector("ul.pvs-list").children;
                            }
                            catch(err)
                            {
                                experror += "Some error in unordered list in experience"+err+"\n"
                            }

                            try
                            {
                                company_name = list.querySelector("span.mr1.hoverable-link-text.t-bold > span.visually-hidden").innerText
                            }
                            catch(err)
                            {
                                experror +="Company name not found"+err+"\n"
                            }

                            experience[String(expindx)]["company_name"] = String(company_name).trim()

                            inner_indx = 0

                            for(var inn of inner_list) // to loop through inner unordered list
                            {
                                var title = ""
                                var date_range = ""
                                var duration = ""
                                var location = ""
                                var pracarea = ""

                                try 
                                {
                                title = inn.querySelector("span.mr1.hoverable-link-text.t-bold > span.visually-hidden").innerText.trim()
                                }
                                catch(err)
                                {
                                    title = ""
                                    experror+= "Title not found"+err+"\n";
                                }
                                
                                try 
                                {
                                    var commonnamer = inn.querySelectorAll("span.t-14.t-normal.t-black--light > span.visually-hidden");
    
                                    try 
                                    {
                                        var datetime = commonnamer[0].innerText.trim();
                                        var datelist = datetime.split("·")
                                        try 
                                        {
                                        date_range = datelist[0].trim()
                                        }
                                        catch(err)
                                        {
                                            experror+= "date range not found"+err+"\n"
                                        }
    
                                        try
                                        {
                                            duration = datelist[1].trim()
                                        }
                                        catch(err)
                                        {
                                            experror+= "duration not found"+err+"\n"
                                        }
                                    }
                                    catch(err)
                                    {
                                        experror+="Datetime not found"+err+"\n"
                                    }
    
                                    try
                                    {
                                        location = commonnamer[1].innerText.trim()
                                    }
                                    catch(err)
                                    {
                                        experror += "Location not found"+err+"\n"
                                    }
                                }
                                catch(err)
                                {
                                    experror+= "Commonnamer not found"+err+"\n";
                                }
    
                                try
                                {
                                    pracarea = inn.querySelector("div.inline-show-more-text.inline-show-more-text--is-collapsed > span.visually-hidden").innerText.trim()
                                }
                                catch(err)
                                {
                                    experror += "Pracarea not found"+err+"\n"
                                }

                                //return {"title" : title,"date_range" : date_range,"location" : location,"duration" : duration,"company_nae": company_name,"pracarea" : pracarea}
                                experience[String(expindx)][String(inner_indx)] = {"title" : title,"date_range" : date_range,"company_location" : location,"duration" : duration,"pracarea" : pracarea}
                                inner_indx+=1
                            }

                        }
                        else
                        {
                            var title = ""
                            var date_range = ""
                            var duration = ""
                            var location = ""
                            var pracarea = ""
                            var company_name = ""

                            try 
                            {
                            title = list.querySelector("span.mr1.t-bold > span.visually-hidden").innerText.trim()
                            }
                            catch(err)
                            {
                                title = ""
                                experror+= "Title not found"+err+"\n";
                            }
                            
                            try 
                            {
                            var companyname = list.querySelector("span.t-14.t-normal > span.visually-hidden").innerText.trim()
                            
                            var complist = companyname.split("·")

                            if(complist.length >= 1)
                            {
                                company_name = complist[0].trim()
                            }
                            else
                            {
                                company_name = ""
                            }

                            }
                            catch(err)
                            {
                                experror = "Company name not found"+err+"\n";
                                var companyname = ""
                            }
                            
                            try 
                            {
                                var commonnamer = list.querySelectorAll("span.t-14.t-normal.t-black--light > span.visually-hidden");

                                try 
                                {
                                    var datetime = commonnamer[0].innerText.trim();
                                    var datelist = datetime.split("·")
                                    try 
                                    {
                                    date_range = datelist[0].trim()
                                    }
                                    catch(err)
                                    {
                                        experror+= "date range not found"+err+"\n"
                                    }

                                    try
                                    {
                                        duration = datelist[1].trim()
                                    }
                                    catch(err)
                                    {
                                        experror+= "duration not found"+err+"\n"
                                    }
                                }
                                catch(err)
                                {
                                    experror+="Datetime not found"+err+"\n"
                                }

                                try
                                {
                                    location = commonnamer[1].innerText.trim()
                                }
                                catch(err)
                                {
                                    experror += "Location not found"+err+"\n"
                                }
                            }
                            catch(err)
                            {
                                experror+= "Commonnamer not found"+err+"\n";
                            }

                            try
                            {
                                pracarea = list.querySelector("div.inline-show-more-text.inline-show-more-text--is-collapsed > span.visually-hidden").innerText
                            }
                            catch(err)
                            {
                                experror += "Pracarea not found"+err+"\n"
                            }

                            experience[String(expindx)]["company_name"] = String(company_name)
                            experience[String(expindx)][0] = {"title" : title,"date_range" : date_range,"company_location" : location,"duration" : duration,"pracarea" : pracarea}
                            //return {"title" : title,"date_range" : date_range,"location" : location,"duration" : duration,"company_nae": company_name,"pracarea" : pracarea}
                        }
                        expindx+=1
                    }
                    }
                    catch(err)
                    {
                        experror+= "Some error while processing experience"+err+"\n";
                    }
                    //return [experience,experror]
                    //return experience
                    return experience
                }
                }
                catch(err)
                {
                    experror+= "Experience not found error===================================="
                }
                //return experror
            }  
        })
        if(exper == undefined)
        {
            experience = {}
        }
        else 
        {
        experience = exper
        }

    }
    catch(err)
    {
        console.log("Experience not found================================================",err)
    }


    try
    {
        var educ = await page2.evaluate(() => {
            const sects = document.querySelectorAll("section.artdeco-card.ember-view.relative.break-words.pb3.mt2");

            for(var sect of sects)
            {
                try
                {
                var divi = sect.querySelector("div").getAttribute("id");
                }
                catch(err)
                {
                    totalerrors+="div finding error==============================="+err+"\n";
                }

                try
                {
                if(divi == "education")
                {
                    var eduerror = ""
                    var education = {}

                    try
                    {
                    var lists = sect.querySelectorAll("li.artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column");
                    }
                    catch(err)
                    {
                        eduerror +="No inner list in education"+err+"\n";
                        continue;
                    }

                    var eduindx = 1

                    try
                    {
                    for(var list of lists)
                    {
                        education[String(eduindx)] = {}


                        var university_name = ""
                        var degree_name = ""
                        var Field_of_Study = ""
                        var date_year = ""
                        var grade = ""
                        var Activities_and_Societies = ""


                        try
                        {
                            university_name = list.querySelector("span.mr1.hoverable-link-text.t-bold span.visually-hidden").innerText
                        }
                        catch(err)
                        {
                            eduerror+= "University name not there"+err+"\n"
                        }

                        try
                        {
                            var college_sel = list.querySelector("span.t-14.t-normal span.visually-hidden").innerText

                            college_sel = college_sel.split(",")

                            if(college_sel.length == 1)
                            {
                                degree_name = college_sel[0]
                            }

                            else if(college_sel.length >=2)
                            {
                                degree_name = college_sel[0]
                                Field_of_Study = college_sel.slice(1,college_sel.length).toString()
                            }

                            const re = /[0-9][0-9][0-9][0-9]+/

                            if(re.exec(degree_name) != null)
                            {
                                degree_name = ""
                            }
                        }
                        catch(err)
                        {
                            eduerror+= "Some error in degree name and field of study "+err+"\n"
                        }

                        try
                        {
                            date_year = list.querySelector("span.t-14.t-normal.t-black--light span.visually-hidden").innerText
                        }
                        catch(err)
                        {
                            eduerror+= "Some error in date_year "+err+"\n"
                        }

                        try
                        {
                            newsecs = list.querySelectorAll("ul.pvs-list > li")

                            Activities_and_Societies = ""

                            for(var newsec of newsecs)
                            {
                                cont = newsec.querySelector("span.visually-hidden").innerText

                                cond = cont.split("Grade:")

                                if(cond.length == 1)
                                {
                                    Activities_and_Societies+=cond.toString()
                                }

                                else if(cond.length == 2)
                                {
                                    grade = cond[1]
                                }

                                else if(cond.length >2)
                                {
                                    Activities_and_Societies += cond.toString()
                                }

                                var Activities_and_Societies = Activities_and_Societies.replace("Activities and societies:","").trim() 
                            }
                        }
                        catch(err)
                        {
                            eduerror+= "Grade and activities problem "+err+"\n"
                        }

                        education[String(eduindx)][0] = {"degree_name" : degree_name,"Field_Of_Study" : Field_of_Study,"grade" : grade,"date_year" : date_year,"Activites_Societies" : Activities_and_Societies}
                        education[String(eduindx)]["university_name"] = university_name
                        eduindx+=1
                    }
                    }
                    catch(err)
                    {
                        eduerror+="Some error in looping thorough education "+err+"\n"
                    }

                    return education
                }

                }
                catch(err)
                {
                    eduerror+= "Education not found error======================================"
                }
                //return retlist//return experience//,education//,experror,eduerror,totalerrors]

            }
            
        })

        if(educ == undefined)
        {
            education = {}
        }
        else 
        {
        education = educ
        }
    }
    catch(err)
    {
        console.log("About not found================================================",err)
    }

    var final = {"id" : id,"linkedin_Profile" : linkedinURL,"flag" : 1,"fullName" : fullname.trim(),"firstName" : firstname.trim(),"middleName" : middlename.trim(),"lastName" : lastname.trim(),"headline" : headline.trim(),"location" : location.trim(),"jobTitle" : jobTitle.trim(),"company1" : company1.trim(),"company2" : company2.trim(),"imgURL" : imageURL,"connectionsCount" : connectionsCount.trim(),"description" : description.trim(),"Experience" : experience,"Education" : education}

    console.log(final)

    console.log(experience)
    console.log(education)
    page2.close();

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("linkedin");
        dbo.collection("profiles").insertOne(final, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });

    var tim = Math.floor((Math.random() * 10) + 1);
    tim = tim*60*1000;
  
    await new Promise(r => setTimeout(r, tim));

    }


}
readdata();
login();