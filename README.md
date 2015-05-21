# CDN All <img src="https://raw.githubusercontent.com/yieme/cdnall/master/img/logo.png" align="right" height="185" border="0" />

Unified CDN server with all the package versions from top public CDN's plus bundling

Standardized naming and straight CDN access for development or production without having to check each service to see if it has the package you're after.

## Project Replaced by [Pakr](https://github.com/yieme/pakr)

It acts as a public CDN redirect or local cache of a public CDN, NPM, GitHub and Bower packages so you can simplify or ignore the backend chain while developing your front end.

Optional ```github```, ```npm``` and ```bower``` packages.

## Usage

- PACKAGE_NAME          default file for the latest version of the package

```
<script src="//cdn.yie.me/bootstrap"></script>
```

- PACKAGE_NAME@VERSION  default file for a specific version of the package

```
<script src="//cdn.yie.me/bootstrap@3.0.2"></script>
```

- PACKAGE               is PACKAGE_NAME || PACKAGE_NAME@VERSION

- BUNDLE                is a series of PACKAGEs of the same kind seperated by ,

```
<!-- type detected from main file of the first entry listed -->
<link href="//cdn.yie.me/font-awesome;bootstrap" rel="stylesheet" type="text/css"></script>
```

- PACK                  is a PACKAGE || BUNDLE and will redirect to PACK/ for proper subfile loading
- PACK/.EXT             first file in list with same EXTension, ex: bootstrap@3.0.2/.js || bootstrap/.min.css

```
<!-- override type detected from first package -->
<link href="//cdn.yie.me/bootstrap;font-awesome/.min.css" rel="stylesheet" type="text/css"></script>
```

- PACK/filename         specific file in the package

- PACK.json             PACK details


- PACK.min.json         Minified PACK details

REDIRECT
- ~PACKAGE              Redirect to upstream CDN

FORM                    Packaged FORMat. b=[b]rowserify, r=[r]equirejs, c=[c]ommonjs, a=[a]mp, g=[g]lobal, u=[u]mp

- [!][~][SERVICE[-FORM]:]PACK[@VERSION][;...]

SPECIALITY
- !                                  active debugging (alert()), otherwise /* error messages */ for .css && .js
- ~                                  CDN redirect for an individual package
- bower[-FORM]:package[@version]     package from bower
- npm[-FORM]:package[@version]       package from npm
- gh[-FORM]:owner/package[@version]  package from github
- CDN:package[@version]              package from a particular CDN
- SWATCH:bootstrap
- fa:icon,list[@version]          just the needed Font Awesome icons
- fi:icon,list[@version]          just the needed Foundation Icons
- md:icon,list[@version]          just the needed Material Design icons
- devicon:icon,list[@version]     just the needed devicons icons
- flag:country,list[@version]     just the needed Flag Icon icons
- bootstrap:class,list[@version]  just the needed bootstrap components

SEARCH module
- api/package/:package         details for a particular package
- api/latest/:search           list of packages that contain :search with latest versions
- api/versions/:search         list of packages that contain :search with versions
- api/find/:search             packages that contain :search

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
