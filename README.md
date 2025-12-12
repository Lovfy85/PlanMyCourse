
# PlanMyCourse
This is a full stack application designed for students at USASK,to help them plan and figure out which classes they still need to take and check each class prerequisites without having to navigate to another page. This app would also allow users to create reviews and comments on classes.

## How To Run This Project: 
Before running this project you must have Docker Desktop installed

### Steps to Run
**Clone the repo**
```
git clone https://git.cs.usask.ca/kbv851/PlanMyCourse.git planmycourse
```
**Change terminal directory into root project file**
```
cd planmycourse
```
**Copy .env variables**
```
cp backend/.env.example backend/.env
```
**Initialize the data base**
```
docker-compose up -d db
```
**Initialize the scraper**
```
docker-compose up -d scraper
```
**Scrape Data**
```
docker exec -it course_scraper python courseScraper.py
```
**Build Docker**
```
docker-compose up -d --build
```
**Build Docker Up**
```
docker-compose up -d
```
**Start the server**
```
docker logs -f main_server
```
**Start the frontend**

Make sure you are on a different terminal (still the same directory as before) when you run this command:
```
docker logs -f main_frontend
```
**To stop docker**
```
docker-compose down
```

## Troubleshooting

If you are experiencing any permission issues or are having issues with running the docker commands run `sudo` after every docker command.

`Note:` This issue might occur if you are on a UNIX (Linux or Mac) device 

**Example**
```
sudo docker-compose up -d db
```

**For Mac Users**

Instead of `docker-compose` use `docker compose`


## Authors and acknowledgment
Antoinette Rubia

Cedar Ancheta

Charles Gamboa

Melvin Cruz

Randolf Pugong

## License
MIT License