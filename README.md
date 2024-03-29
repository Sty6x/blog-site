# blog-site
Creating a more backend focused project by responding to user request and creating APIs for a content editor using CRUD Operations.
## What is it 
A Blog site where I can share my thoughts and opinions about Computer Systems, Web Development also creating tutorials and reviews on my favorite books. but for now I populated the blog site's contents from some of the notes in my markdown web application [Vimnotes](https://github.com/Sty6x/markdown-app) just to see how it looks.
## Reason
I wanted to explore more into the backend side of things by building a multi-page application, the pages that are served to the clients are dynamic and is updated through an API that I can attach to a content editor that can use CRUD operations, and I was also curious how I could implement a JWT authentication strategy to secure my API.   
I might populate this project with meaningful contents to share with other people, but as of now I am currently busy.
## Tools I used
- I use ExpressJs for my server 
- MongoDB with Mongoose ODM
- JSDOM to parse markdown text and interact with the DOM objects in the server.
- MarkdownIt to parse and render the makrdown contents written in a content editor to HTML.   

### Preview to the site
![Screenshot from 2024-01-30 05-24-02](https://github.com/Sty6x/blog-site/assets/53662191/ee798d20-540f-42ae-99cc-b61404163467)
![Screenshot from 2024-01-31 05-50-25](https://github.com/Sty6x/blog-site/assets/53662191/0f2c64a7-2b4f-4efe-bfef-aaaf6a90c6d8)
![Screenshot from 2024-01-30 05-39-31](https://github.com/Sty6x/blog-site/assets/53662191/2dc56d4e-7cf7-4d29-a87a-e7e6f92fd3c6)


## How to run

`$ cd /blog-site`  
> To install dependencies.

`$ npm i`   
`$ npm run dev`  
