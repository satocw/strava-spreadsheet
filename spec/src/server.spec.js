// const Server = require('../../dist/server');

// describe('Class "Server"', () => {

//     let server;
//     beforeEach(() => {
//         server = new Server();
//     });

//     describe('Function "prepare()"', () => {

//         it('should set props', () => {
//             const args = [
//                 '/Users/satoshi/.nvm/versions/node/v6.9.1/bin/node',
//                 '/Users/satoshi/_dev/_private/activity-archiver/dist/server.js',
//                 '--month=201709',
//                 '--file=activity_1990194124.tcx',
//                 '--to=DOCID',
//             ];

//             server.prepare(args);
//             expect(server.month).toEqual('201709');
//             expect(server.file).toEqual('activity_1990194124.tcx');
//             expect(server.to).toEqual('DOCID');
//         });
//     });
// });