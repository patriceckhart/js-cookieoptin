# JS Cookie-OptIn for Twitter Bootstrap 5

## Usage

Definition of the cookies used in the json (json folder) files in all necessary languages.

### In your HTML

```html
    <!doctype html>
    <html lang="de">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
        <title>Cookie OptIn</title>
    </head>
    <body>
    
    <p>Content</p>
    
    <script>
        cookieJsonPath = 'json/'
    </script>
    
    <iframe data-cookie="bar" width="1116" height="628" cookie-src="https://www.youtube.com/embed/7KUdmFyefSA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <script data-cookie="all" type="text/plain" async src="https://www.googletagmanager.com/gtag/js?id=UA-143247544-30"></script>
    <script data-cookie="all" type="text/plain">window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "UA-143247544-30");</script>
    
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>
    <script src="cookie.js"></script>
    
    </body>
    </html>
```


## Author

* E-Mail: mail@patriceckhart.com
* URL: http://www.patriceckhart.com
