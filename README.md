# Seattle Public Utilities API

A Node.js library for Seattle Public Utilities web services.

> Note: this library is in no way affiliated, endorsed, or otherwise acknowledged by Seattle Public Utilities.

## API

`function getCollectionDays(address, cb)`

 - `address`: (string) A Seattle house number and street.
 - `cb`: (function) A callback that will receive either an error or an array representing the next few collection days.

Each collection day object has the following properties:

 - `date`: (string) The day's date. 
 - `foodAndYardWaste`: (boolean) True if food and yard waste bins will be collected.
 - `garbage`: (boolean) True if garbage bins will be collected.
 - `recycling`: (boolean) True if recycling bins will be collected.

## Example

```javascript
var spu = require('spu-api');

spu.getCollectionDays('123 MAIN ST', function (err, days) {
    if (err) {
        return console.error(err);
    }

    console.log(days);
});
```

## License

MIT