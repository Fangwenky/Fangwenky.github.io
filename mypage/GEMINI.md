# Project Overview

This project is a personal blog and portfolio website. It is a static website built with HTML, CSS, and vanilla JavaScript. There is no backend or build process. All the data for the articles, projects, and personal information is stored in JavaScript files within the `data` directory. The website is single-page application (SPA) style, where content is dynamically loaded into the pages using JavaScript.

## Key Files

*   `index.html`: The main entry point of the website.
*   `style.css`: Contains all the styles for the website.
*   `script.js`: The main JavaScript file that handles dynamic content loading, animations, and user interactions.
*   `data/`: This directory contains the data for the website.
    *   `articlesData.js`: Contains the data for the blog articles.
    *   `projectsData.js`: Contains the data for the projects.
    *   `skillsData.js`: Contains the data for the skills section.
    *   `aboutMeData.js`: Contains the data for the "About Me" section.
*   `images/`: This directory contains all the images for the website.

## Building and Running

This is a static website, so there is no build process. To run the website, simply open the `index.html` file in a web browser.

### TODO

*   It is recommended to run the website with a local web server to avoid any potential issues with Cross-Origin Resource Sharing (CORS) when fetching the data files. A simple way to do this is to use Python's built-in HTTP server:

    ```bash
    python -m http.server
    ```

    Or if you have Node.js installed:

    ```bash
    npx serve
    ```

## Development Conventions

The project uses a modular approach for its data, with separate JavaScript files for different data types. The code is written in vanilla JavaScript and uses ES6 modules. The code is well-structured and easy to follow.
