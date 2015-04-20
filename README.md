# CDN All

Simplified public CDN server

Standardized naming and straight CDN access for development or production without having to check each service to see if it has the package you're after.

It acts as a public CDN redirect or local cache of a public CDN, NPM, GitHub and Bower packages so you can ignore the backend chain while developing your front end.

Optional ```github```, ```npm``` and ```bower``` packages.

## Usage

Using the latest Bootstrap and FontAwesome

```html
<html>
<head>
  <link rel="stylesheet" type="text/css" href="//cdnall.net/bootstrap.css" />
  <link rel="stylesheet" type="text/css" href="//cdnall.net/fontawesome.css" />
</head>
<body>
  <!-- site body -->
  <script src="//cdnall.net/bootstrap.js"></script>
</html>
```

Using a minified Bootswatch and a particular FontAwesome version

```html
<html>
<head>
  <link rel="stylesheet" type="text/css" href="//cdnall.net/readable/bootstrap.min.css" />
  <link rel="stylesheet" type="text/css" href="//cdnall.net/fontawesome.min.css@3.0.2" />
</head>
<body>
  <!-- site body -->
  <script src="//cdnall.net/bootstrap.min.js"></script>
</html>
```
