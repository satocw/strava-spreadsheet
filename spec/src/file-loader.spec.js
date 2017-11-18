const fileLoader = require('../../dist/file-loader');
const activity = require('../../dist/activity');
const path = require("path");

describe('fileLoader', () => {
    describe('Func loadOneFile()', () => {
        it('should load file', (done) => {
            fileLoader.loadOneFile(path.resolve(__dirname, '../data', 'activity_1990194124.tcx'))
                .subscribe(data => {
                    expect(data).toBeDefined();
                    const act = activity.createFrom(data);
                    expect(act.start_time).toEqual(new Date("2017-09-20T13:39:27.000Z"));
                    done();
                });
        });
    });
});

describe('activity', () => {
    it('should create properly', (done) => {
        fileLoader.loadOneFile(path.resolve(__dirname, '../data', 'activity_1990194124.tcx'))
        .subscribe(data => {
            const act = activity.createFrom(data);
            expect(act.start_time).toEqual(new Date("2017-09-20T13:39:27.000Z"));
            expect(act.time).toEqual(836.0 + 238.0);
            expect(act.distance).toEqual(2543.05 + 698.06);
            expect(act.laps.length).toEqual(2);

            expect(act.laps[1].tracks.length).toEqual(7);
            expect(act.laps[1].ascend).toEqual(0);
            expect(act.laps[1].descend).toEqual(64.0 - 54.20000076293945);
            done();
        });
    });
});