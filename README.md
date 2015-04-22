# CDN All <img src="https://raw.githubusercontent.com/yieme/cdnall/master/img/logo.png" align="right" height="185" border="0" />

Simplified public CDN server

Standardized naming and straight CDN access for development or production without having to check each service to see if it has the package you're after.

It acts as a public CDN redirect or local cache of a public CDN, NPM, GitHub and Bower packages so you can ignore the backend chain while developing your front end.

Optional ```github```, ```npm``` and ```bower``` packages.

## Usage

Using the latest Bootstrap and FontAwesome

```html
<html>
<head>
  <link rel="stylesheet" type="text/css" href="//cdnall.net/bootstrap" />
  <link rel="stylesheet" type="text/css" href="//cdnall.net/font-awesome" />
</head>
<body>
  <!-- site body -->
  <script src="//cdnall.net/bootstrap"></script>
</body>
</html>
```

Using a minified Bootswatch and a particular FontAwesome version

```html
<html>
<head>
  <link rel="stylesheet" type="text/css" href="//cdnall.net/bootstrap:min.css" />
  <link rel="stylesheet" type="text/css" href="//cdnall.net/font-awesome@3.0.2:min.css" />
</head>
<body>
  <!-- site body -->
  <script src="//cdnall.net/bootstrap:min.js"></script>
</body>
</html>
```

Bundle resources

```html
<html>
<head>
  <link rel="stylesheet" type="text/css" href="//cdnall.net/bootstrap.min.css,fontawesome@3.0.2.min.css" />
</head>
<body>
  <!-- site body -->
</body>
</html>
```

## Install

```sh
npm i cdnall
```

## Serve

```sh
PORT=8080 FIREBASE=name:pub,path:cdn npm start
```

## To Do

- break out bootswatch, ex: //cdnall.net/readable-bootstrap@3.0.2

## License: MIT
