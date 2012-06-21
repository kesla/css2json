# Css2json

Css2json transform CSS to JSON.

## Installation

```
npm install css2json
```

## Usage

```
var css2json = require('css2json');
var json = css2json(css);
```

## Example

The css

```
h1#header {
  font-family: 'Times New Roman';
}

p {
  margin-right: 100px;
}

h1#header {
  color: #ff0000  
}
```

would transform into

```
{
  "h1#header": {
    "font-family": "Times New Roman",
    "color": "#ff0000"
  },
  "p": {
    "margin-right": "100px"
  }
}
```
