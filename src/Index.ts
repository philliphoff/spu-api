import * as debug from 'debug';
import * as request from 'request';

const spuApiDebug = debug('spu:api');

function getWarpAddress(address: string, cb: (err: Error | undefined, address: string) => void): void {
    const options = {
        method: 'GET',
        json: true,
        qs: {
            pAddress: address,
            pActiveOnly: '',
            pUnit: '',
            pRequireSolidWasteServices: true
        },
        url: 'http://www.seattle.gov/UTIL/WARP/Home/GetAddress'
    };

    spuApiDebug('Getting WARP address: %O', options);

    request(options, (err, res, body) => {
        if (err) {
            spuApiDebug('Unable to get address: %O', err);

            return cb(err, undefined);
        }

        spuApiDebug('Got address: %O', body);

        if (body && body.length) {
            cb(undefined, body[0]);
        }
        else {
            const message = 'Got an unexpected address.';
            spuApiDebug(message);
            cb(new Error(message), undefined);
        }
    });
}

interface IWarpCollectionDay {
    allDay: boolean;
    delimitedData: null;
    end: null;
    FoodAndYardWaste: boolean;
    Garbage: boolean;
    id: number;
    Recycling: boolean;
    start: string;
    status: null;
    title: string;
    url: null;
}

function getWarpCollectionDays(address: string, cb: (err: Error | undefined, days: IWarpCollectionDay[] | undefined) => void): void {
    const options = {
        method: 'GET',
        json: true,
        qs: {
            pAccount: '',
            pAddress: address,
            pJustChecking: '',
            pApp: 'CC',
            pIE: '',
            start: 0
        },
        url: 'http://www.seattle.gov/UTIL/WARP/CollectionCalendar/GetCollectionDays'
    };

    spuApiDebug('Getting WARP collection days: %O', options);

    request(options, (err, res, body) => {
        if (err) {
            spuApiDebug('Unable to get collection days: %O', err);

            return cb(err, undefined);
        }

        spuApiDebug('Got collection days: %O', body);

        cb(undefined, body || []);
    });
}

export interface ICollectionDay {
    date: Date;
    foodAndYardWaste: boolean;
    garbage: boolean;
    recycling: boolean;
}

export function getCollectionDays(address: string, cb: (err: Error | undefined, days: ICollectionDay[] | undefined) => void): void {
    getWarpAddress(address, (err, warpAddress) => {
        if (err) {
            return cb(err, undefined);
        }

        getWarpCollectionDays(warpAddress, (daysErr, days) => {
            if (daysErr) {
                return cb(daysErr, undefined);
            }

            cb(undefined, days.map(day => ({
                date: new Date(day.start),
                foodAndYardWaste: day.FoodAndYardWaste,
                garbage: day.Garbage,
                recycling: day.Recycling
            })));
        });
    });
}
