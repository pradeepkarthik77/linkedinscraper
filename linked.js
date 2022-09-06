const puppeteer = require("puppeteer");
const fs =require("fs");

var link_arr = ["https://www.linkedin.com/in/sasangan-ramanathan-63079412/","https://www.linkedin.com/in/amol-khedekar/","https://www.linkedin.com/in/pradeep-karthik-muthusamy-bb172a217/","https://www.linkedin.com/in/bindu-k-r-6373113/"];

async function run() {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();

    await page.goto("https://www.linkedin.com/in/sasangan-ramanathan-63079412/",{waitUntil : "domcontentloaded"});
    await page.setViewport({ width: 1366, height: 768});

    await new Promise(r => setTimeout(r, 1000));

    await page.click("button.authwall-join-form__form-toggle--bottom.form-toggle");

    await page.type("#session_key","karthik2252062003@gmail.com");
    await page.type("#session_password","karthik@2486");

    await page.click(".sign-in-form__submit-button");

    for(indx = 0;indx<link_arr.length;indx++)
    {
        await new Promise(r => setTimeout(r, 1000));

        const page2 = await browser.newPage()

        await page2.goto(link_arr[indx],{waitUntil : "domcontentloaded"});
        await page2.setViewport({ width: 1366, height: 768});

        await new Promise(r => setTimeout(r, 3000));

        page_content = await page2.content();

        const page3 = await browser.newPage()

        await page3.goto(link_arr[indx]+"/details/education/",{waitUntil : "domcontentloaded"});
        await page3.setViewport({ width: 1366, height: 768});

        await new Promise(r => setTimeout(r, 3000));

        education_content = await page3.content();

        await new Promise(r => setTimeout(r, 3000));

        page3.close();

        const page4 = await browser.newPage()

        await page4.goto(link_arr[indx]+"/details/experience/",{waitUntil : "domcontentloaded"});
        await page4.setViewport({ width: 1366, height: 768});

        await new Promise(r => setTimeout(r, 3000));

        experience_content = await page4.content();

        await new Promise(r => setTimeout(r, 3000));

        page4.close();



        var dir = `C:/Users/prade/Downloads/NodeJS/sample/soups/person${indx+1}`;

        if (!fs.existsSync(dir))
        {
            fs.mkdirSync(dir);
        }

        fs.writeFile(`C:/Users/prade/Downloads/NodeJS/sample/soups/person${indx+1}/${indx+1}.html`,page_content,err =>{
            if(err)
            {
                console.log(err);
            }
        });

        fs.writeFile(`C:/Users/prade/Downloads/NodeJS/sample/soups/person${indx+1}/${indx+1}education.html`,education_content,err =>{
            if(err)
            {
                console.log(err);
            }
        });

        fs.writeFile(`C:/Users/prade/Downloads/NodeJS/sample/soups/person${indx+1}/${indx+1}experience.html`,experience_content,err =>{
            if(err)
            {
                console.log(err);
            }
        });


        page2.close();

    }
    browser.close();
}
run();