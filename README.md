
# Plan My Course

## Description
This is a full stack application designed for students at USASK,to help them plan and figure out which classes they still need to take and check each class prerequisites without having to navigate to another page. This app would also allow users to create reviews and comments on classes.

## How To Run This Project: 
    ***Before starting, make sure you have node installed***

    Once you have node installed
    clone the project to a local repo
    
    To make it so that the project runs on any OS, make sure you have that of docker desktop installed.
    If you do have it, these are the steps:
        * Note, if you are running this on a UNIX device (linux or mac) and you are getting permission errors,
        add sudo before the command to every command that uses docker. 
        example:
            sudo docker-compose up -d

        If on windows just follow the instructions normally    

        Make sure you are in the project directory itself in the terminal. Once you are, do the following: 
            docker-compose up -d (It needs to be reworked right now since it gets the previous course catalogue table)

        --> This will start up that of server and if you want to go into the website, the link is: http://localhost:5173/
        
        --> If you want to stop the docker-compose.yml from running: 
            docker-compose down

            ---> The safest way to stop it.

        --> If running that of the docker-compose.yml and this message occurs during the build: 
            ✘ Container course_scraper service "scraper" didn't complete successfully: exit 1   
            Just simply run back the docker-compose.yml: docker-compose up -d

                ---> The message happens because of doing: docker-compose down -v where it removes that of the volume being used in which 
                    stores the web-scraper.

## Roadmap
Finish deliverable 2 part 2

## Contributing
Not accepting contributions from outside our group

## Authors and acknowledgment
Antoinette Rubia

Cedar Ancheta

Charles Gamboa

Melvin Cruz

Randolf Pugong

## License
MIT License

## Project status
This project is in its coding stages, testing will be done when majority of the features are implemented.
