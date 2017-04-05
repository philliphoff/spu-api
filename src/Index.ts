import * as request from 'request';

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

    request(options, (err, res, body) => {
        if (err) {
            return cb(err, undefined);
        }

        cb(undefined, body[0]);
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

    request(options, (err, res, body) => {
        if (err) {
            return cb(err, undefined);
        }

        cb(undefined, body);
    });
}

export interface ICollectionDay {
    date: string;
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
                date: day.start,
                foodAndYardWaste: day.FoodAndYardWaste,
                garbage: day.Garbage,
                recycling: day.Recycling
            })));
        });
    });
}
